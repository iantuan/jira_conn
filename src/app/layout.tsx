import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jira儀表板",
  description: "自定義Jira儀表板，基於JQL查詢",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <Providers>
          <div className="app-container">
            <header className="app-header">
              <div className="app-header-title">Jira儀表板系統</div>
              <div className="flex items-center">
                <input 
                  type="text" 
                  className="app-search" 
                  placeholder="搜索..." 
                />
                <div className="ml-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
              </div>
            </header>
            <div className="app-body">
              <aside className="app-sidebar">
                <Navigation />
              </aside>
              <main className="app-content">
                {children}
              </main>
            </div>
            <footer className="p-4 text-center text-sm text-gray-500">
              © 2024 Jira儀表板系統 版權所有
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
