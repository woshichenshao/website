/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  PAPERS: R2Bucket;
  PAPER_UPLOAD_TOKEN?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const paperMatch = url.pathname.match(/^\/paper-content\/(paper-[a-z0-9-]+)$/);
    if (paperMatch) return servePaper(request, env.PAPERS, paperMatch[1]);

    if (url.pathname === "/paper-upload-status") return paperUploadStatus(request, env.PAPERS);

    const uploadMatch = url.pathname.match(/^\/_internal\/paper-upload\/(paper-[a-z0-9-]+)(?:\/(.*))?$/);
    if (uploadMatch) return handlePaperUpload(request, env, uploadMatch[1], uploadMatch[2] ?? "");

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

async function paperUploadStatus(request: Request, bucket: R2Bucket) {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
  let cursor: string | undefined;
  let count = 0;
  let bytes = 0;
  do {
    const page = await bucket.list({ prefix: "papers/", cursor });
    count += page.objects.length;
    bytes += page.objects.reduce((sum, object) => sum + object.size, 0);
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return Response.json(
    { count, expected: 521, bytes, complete: count === 521 },
    { headers: { "cache-control": "no-store", "x-robots-tag": "noindex, noarchive, nosnippet" } },
  );
}

async function servePaper(request: Request, bucket: R2Bucket, paperId: string) {
  if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405 });
  const object = await bucket.get(`papers/${paperId}.pdf`, { range: request.headers });
  if (!object) return new Response("Paper not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", "application/pdf");
  headers.set("Content-Disposition", "inline; filename=paper.pdf");
  headers.set("Cache-Control", "no-store, private, max-age=0");
  headers.set("Accept-Ranges", "bytes");
  headers.set("X-Robots-Tag", "noindex, noarchive, nosnippet");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
  headers.set("X-Content-Type-Options", "nosniff");

  let status = 200;
  if (object.range) {
    status = 206;
    headers.set("Content-Range", `bytes ${object.range.offset}-${object.range.offset + object.range.length - 1}/${object.size}`);
    headers.set("Content-Length", String(object.range.length));
  } else {
    headers.set("Content-Length", String(object.size));
  }
  return new Response(request.method === "HEAD" ? null : object.body, { status, headers });
}

async function handlePaperUpload(request: Request, env: Env, paperId: string, action: string) {
  const supplied = request.headers.get("authorization");
  if (!env.PAPER_UPLOAD_TOKEN || supplied !== `Bearer ${env.PAPER_UPLOAD_TOKEN}`) return new Response("Unauthorized", { status: 401 });
  const key = `papers/${paperId}.pdf`;
  if (request.method === "HEAD" && !action) {
    const object = await env.PAPERS.head(key);
    if (!object) return new Response(null, { status: 404 });
    return new Response(null, { headers: { "content-length": String(object.size), "x-paper-sha256": object.customMetadata?.sha256 ?? "" } });
  }
  if (request.method === "POST" && action === "multipart/start") {
    const payload = await request.json<{ sha256: string }>();
    const upload = await env.PAPERS.createMultipartUpload(key, {
      httpMetadata: { contentType: "application/pdf", cacheControl: "no-store" },
      customMetadata: { sha256: payload.sha256 ?? "" },
    });
    return Response.json({ uploadId: upload.uploadId });
  }
  const partMatch = action.match(/^multipart\/([^/]+)\/part\/(\d+)$/);
  if (request.method === "PUT" && partMatch) {
    const payload = await request.json<{ data: string }>();
    if (!payload.data) return new Response("Missing part data", { status: 400 });
    const binary = atob(payload.data);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    const upload = env.PAPERS.resumeMultipartUpload(key, decodeURIComponent(partMatch[1]));
    const part = await upload.uploadPart(Number(partMatch[2]), bytes);
    return Response.json(part);
  }
  const completeMatch = action.match(/^multipart\/([^/]+)\/complete$/);
  if (request.method === "POST" && completeMatch) {
    const payload = await request.json<{ parts: R2UploadedPart[] }>();
    const upload = env.PAPERS.resumeMultipartUpload(key, decodeURIComponent(completeMatch[1]));
    const object = await upload.complete(payload.parts);
    return Response.json({ ok: true, size: object.size });
  }
  const abortMatch = action.match(/^multipart\/([^/]+)$/);
  if (request.method === "DELETE" && abortMatch) {
    await env.PAPERS.resumeMultipartUpload(key, decodeURIComponent(abortMatch[1])).abort();
    return new Response(null, { status: 204 });
  }
  if (request.method !== "PUT" || action || !request.body) return new Response("Method not allowed", { status: 405 });
  const sha256 = request.headers.get("x-paper-sha256") ?? "";
  await env.PAPERS.put(key, request.body, {
    httpMetadata: { contentType: "application/pdf", cacheControl: "no-store" },
    customMetadata: { sha256 },
  });
  return new Response(JSON.stringify({ ok: true, key }), { status: 201, headers: { "content-type": "application/json" } });
}

export default worker;
