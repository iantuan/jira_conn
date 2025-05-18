import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";
import Link from 'next/link';
import AuthButton from "../components/AuthButton";
import { Navigation } from "../components/Navigation";

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
                  {/* Search can be a client component if it needs interaction */}
                  {/* <input 
                    type="search" 
                    className="app-search w-full" 
                    placeholder="搜尋看板、問題..." 
                  /> */}
                </div>
                <div className="ml-4 flex items-center">
                  {/* Notification Icon - can be a separate component */}
                  {/* <button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 dark:text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.017 5.454 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                  </button> */}
                  <AuthButton />
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
            <footer className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-header-border">
              © {new Date().getFullYear()} Jira Dashboard Pro. All rights reserved.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
