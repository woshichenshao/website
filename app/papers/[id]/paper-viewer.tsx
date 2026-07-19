"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";

type FitMode = "width" | "custom";

export function PaperViewer({ paperId, title, expectedPages }: { paperId: string; title: string; expectedPages: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const documentRef = useRef<PDFDocumentProxy | null>(null);
  const renderRef = useRef<RenderTask | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(expectedPages);
  const [zoom, setZoom] = useState(1);
  const [fitMode, setFitMode] = useState<FitMode>("width");
  const [width, setWidth] = useState(0);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("正在载入论文……");

  useEffect(() => {
    let active = true;
    let loadingTask: PDFDocumentLoadingTask | null = null;
    void import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      loadingTask = pdfjs.getDocument({ url: `/paper-content/${paperId}`, rangeChunkSize: 262144, disableAutoFetch: false });
      return loadingTask.promise;
    }).then((document) => {
      if (!active) return void document.destroy();
      documentRef.current = document;
      setPages(document.numPages);
      setReady(true);
      setStatus("");
    }).catch(() => active && setStatus("论文载入失败，请稍后重试。"));
    return () => {
      active = false;
      renderRef.current?.cancel();
      void loadingTask?.destroy();
      documentRef.current = null;
    };
  }, [paperId]);

  useEffect(() => {
    if (!hostRef.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(hostRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const document = documentRef.current;
    const canvas = canvasRef.current;
    if (!document || !canvas || width === 0) return;
    let cancelled = false;
    void document.getPage(page).then((pdfPage) => {
      if (cancelled) return;
      const base = pdfPage.getViewport({ scale: 1 });
      const fitScale = Math.max(0.25, (width - 32) / base.width);
      const scale = (fitMode === "width" ? fitScale : fitScale * zoom);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = pdfPage.getViewport({ scale: scale * pixelRatio });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width / pixelRatio)}px`;
      canvas.style.height = `${Math.floor(viewport.height / pixelRatio)}px`;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) throw new Error("Canvas is unavailable");
      renderRef.current?.cancel();
      renderRef.current = pdfPage.render({ canvasContext: context, viewport, canvas });
      return renderRef.current.promise;
    }).catch((error) => {
      if (!cancelled && error?.name !== "RenderingCancelledException") setStatus("本页渲染失败，请切换页面后重试。" );
    });
    return () => { cancelled = true; renderRef.current?.cancel(); };
  }, [page, pages, width, zoom, fitMode, ready]);

  const stopRestrictedAction = useCallback((event: Event) => event.preventDefault(), []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const restricted = (event.ctrlKey || event.metaKey) && ["s", "p", "c", "u"].includes(event.key.toLowerCase());
      if (restricted) event.preventDefault();
      if (event.key === "PageDown" || event.key === "ArrowRight") setPage((value) => Math.min(pages, value + 1));
      if (event.key === "PageUp" || event.key === "ArrowLeft") setPage((value) => Math.max(1, value - 1));
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [pages]);

  const adjustZoom = (delta: number) => {
    setFitMode("custom");
    setZoom((value) => Math.min(2.5, Math.max(0.5, Number((value + delta).toFixed(2)))));
  };

  return (
    <section className="paper-viewer" aria-label={`${title} 在线只读阅读器`} onContextMenu={stopRestrictedAction} onCopy={stopRestrictedAction} onCut={stopRestrictedAction} onDragStart={stopRestrictedAction}>
      <div className="paper-toolbar" role="toolbar" aria-label="论文翻页和缩放">
        <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1}>上一页</button>
        <label><span>页码</span><input aria-label="当前页码" inputMode="numeric" value={page} onChange={(event) => { const next = Number(event.target.value); if (Number.isInteger(next)) setPage(Math.min(pages, Math.max(1, next))); }} /><b>/ {pages}</b></label>
        <button type="button" onClick={() => setPage((value) => Math.min(pages, value + 1))} disabled={page >= pages}>下一页</button>
        <i aria-hidden="true" />
        <button type="button" aria-label="缩小" onClick={() => adjustZoom(-0.15)}>−</button>
        <button type="button" onClick={() => { setFitMode("width"); setZoom(1); }}>适合宽度</button>
        <button type="button" aria-label="放大" onClick={() => adjustZoom(0.15)}>＋</button>
      </div>
      <div className="paper-canvas-host" ref={hostRef} aria-busy={Boolean(status)}>
        {status ? <p className="paper-status" role="status">{status}</p> : null}
        <canvas ref={canvasRef} aria-label={`${title} 第 ${page} 页`} />
      </div>
    </section>
  );
}
