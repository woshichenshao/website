import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);

  return {
    metadataBase: base,
    title: {
      default: "接口之外｜AI、技术与个人实践",
      template: "%s｜接口之外",
    },
    description:
      "界外的 AI 技术实践笔记：记录工具、工作流与项目复盘，把复杂技术写成可以真正使用的方法。",
    authors: [{ name: "界外" }],
    creator: "界外",
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName: "接口之外",
      title: "接口之外｜AI、技术与个人实践",
      description: "把复杂技术，写成可以真正使用的方法。",
      images: [new URL("/og.png", base).toString()],
    },
    twitter: {
      card: "summary_large_image",
      title: "接口之外｜AI、技术与个人实践",
      description: "把复杂技术，写成可以真正使用的方法。",
      images: [new URL("/og.png", base).toString()],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main-content">
          跳到正文
        </a>
        {children}
      </body>
    </html>
  );
}
