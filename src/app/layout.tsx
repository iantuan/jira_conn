import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";
import Link from 'next/link';
import AuthButton from "@/components/AuthButton";
import ResizableSidebar from "@/components/ResizableSidebar";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Jira 儀表板",
  description: "現代化的Jira數據可視化與追蹤工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="antialiased">
      <body className={`${inter.className} bg-background-start text-foreground`}>
        <Providers>
          <div className="app-container">
            <header className="app-header">
              <Link href="/" className="app-header-title">
                Jira Dashboard Pro
              </Link>
              <div className="flex items-center flex-grow justify-end">
                <div className="flex-grow max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl ml-4">
                </div>
                <div className="ml-4 flex items-center">
                  <AuthButton />
                </div>
              </div>
            </header>
            <div className="app-body">
              <ResizableSidebar />
              <main className="app-content">
                {children}
              </main>
            </div>
            <footer className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-header-border">
              © {new Date().getFullYear()} Jira Dashboard Pro. All rights reserved.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
