import argparse
import io
import json
import os
import re
import zipfile
from pathlib import Path

import img2pdf

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def natural_key(value: str):
    return [int(part) if part.isdigit() else part.casefold() for part in re.split(r"(\d+)", value)]


def normalized_name(path: Path):
    return re.sub(r"\s*[（(]1[）)]$", "", path.stem) + path.suffix.lower()


def directory_images(root: Path):
    selected = {}
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in IMAGE_EXTENSIONS:
            continue
        key = str(path.relative_to(root).parent / normalized_name(path)).casefold()
        existing = selected.get(key)
        if existing is None or "(1)" in existing.name or "（1）" in existing.name:
            selected[key] = path
    return [path.read_bytes() for path in sorted(selected.values(), key=lambda item: natural_key(str(item.relative_to(root))))]


def zip_images(archive: Path, code: str):
    with zipfile.ZipFile(archive) as source:
        names = [
            name for name in source.namelist()
            if re.search(rf"/{re.escape(code)}/\d+\.(?:jpe?g|png)$", name, re.IGNORECASE)
        ]
        names.sort(key=lambda name: natural_key(name.rsplit("/", 1)[-1]))
        return [source.read(name) for name in names]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("jobs")
    args = parser.parse_args()
    jobs = json.loads(Path(args.jobs).read_text(encoding="utf-8"))
    results = []
    for job in jobs:
        source = job["source"]
        if source["kind"] == "directory-images":
            images = directory_images(Path(source["path"]))
        else:
            images = zip_images(Path(source["path"]), source["code"])
        if not images:
            raise RuntimeError(f"No scan pages found for {job['id']}")
        output = Path(job["output"])
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_bytes(img2pdf.convert(*[io.BytesIO(image) for image in images]))
        results.append({"id": job["id"], "pages": len(images), "output": str(output)})
    print(json.dumps({"converted": len(results), "results": results}, ensure_ascii=False))


if __name__ == "__main__":
    main()
