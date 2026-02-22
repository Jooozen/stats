import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: "Basketball Stats",
  description: "バスケットボール スタッツ記録アプリ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body className="antialiased bg-basketball-bg text-basketball-text">
        <div className="flex min-h-dvh">
          {/* サイドバー: lg以上で表示 */}
          <Navigation />
          {/* メインコンテンツ */}
          <main className="flex-1 pb-20 lg:pb-0 lg:pl-64">
            <div className="mx-auto max-w-5xl p-4 lg:p-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
