'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>;
  }

  if (session) {
    return (
      <div className="flex items-center">
        <span className="text-sm text-gray-700 dark:text-gray-300 mr-3 hidden sm:inline">
          {session.user?.username || session.user?.name}
        </span>
        <div className="relative group">
          <div className="w-8 h-8 bg-primary-color text-white rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer ring-2 ring-offset-2 dark:ring-offset-header-bg ring-primary-color/50">
            {session.user?.username?.charAt(0).toUpperCase() || session.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="absolute right-0 mt-2 w-48 bg-card-bg rounded-md shadow-lg py-1 z-20 border border-card-border hidden group-hover:block">
            <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-card-border">
              Signed in as <strong>{session.user?.username}</strong>
            </div>
            {session.user?.role === 'ADMIN' && (
              <Link href="/config" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                系統設定
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button onClick={() => signIn()} className="btn btn-primary py-1.5 px-3 text-sm">
      登入
    </button>
  );
} 