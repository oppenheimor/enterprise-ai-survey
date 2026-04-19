import localFont from "next/font/local";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const headingFont = Space_Grotesk({
  variable: "--font-heading-display",
  subsets: ["latin"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono-display",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const localHeadingFont = localFont({
  src: [
    {
      path: "../public/fonts/alibaba-puhuiti-2-75-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/alibaba-puhuiti-2-75-semibold.woff",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-heading-local",
  display: "swap",
});

export const metadata: Metadata = {
  title: "企业 AI 转型评估 H5",
  description: "16 道选择题，帮助企业负责人完成一次克制、可解释的 AI 转型初步诊断。",
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${headingFont.variable} ${monoFont.variable} ${localHeadingFont.variable}`}>{children}</body>
    </html>
  );
}
