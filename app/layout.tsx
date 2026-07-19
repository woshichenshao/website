import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);

  return {
    metadataBase: base,
    title: { default: "接口之外｜数学建模竞赛知识站", template: "%s｜接口之外" },
    description: "从理解赛题到论文提交：数学建模竞赛的备赛路线、模型方法、论文写作、AI 辅助与历年资料索引。",
    authors: [{ name: "界外" }],
    creator: "界外",
    keywords: ["数学建模", "数学建模竞赛", "CUMCM", "模型选择", "论文写作", "AI 辅助建模"],
    openGraph: {
      type: "website", locale: "zh_CN", siteName: "接口之外",
      title: "接口之外｜数学建模竞赛知识站",
      description: "从赛题到论文，把建模做成一套可复用的方法。",
      images: [new URL("/og.png", base).toString()],
    },
    twitter: {
      card: "summary_large_image", title: "接口之外｜数学建模竞赛知识站",
      description: "从赛题到论文，把建模做成一套可复用的方法。",
      images: [new URL("/og.png", base).toString()],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><a className="skip-link" href="#main-content">跳到正文</a>{children}</body></html>;
}
