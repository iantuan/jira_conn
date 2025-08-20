'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (status === 'loading') {
    return <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>;
  }

  if (session) {
    return (
      <div className="flex items-center">
        <span className="text-sm text-gray-700 dark:text-gray-300 mr-3 hidden sm:inline">
          {session.user?.username || session.user?.name}
        </span>
        <div className="relative">
          <div 
            ref={buttonRef}
            className="w-8 h-8 bg-primary-color text-white rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer ring-2 ring-offset-2 dark:ring-offset-header-bg ring-primary-color/50 hover:bg-primary-color/90 transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onMouseEnter={() => setIsDropdownOpen(true)}
          >
            {session.user?.username?.charAt(0).toUpperCase() || session.user?.name?.charAt(0).toUpperCase()}
          </div>
          
          {/* 增加一個不可見的橋接區域，讓滑鼠更容易移動到下拉菜單 */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full w-48 h-2 bg-transparent" />
          )}
          
          <div 
            ref={dropdownRef}
            className={`absolute right-0 top-full mt-1 w-48 bg-card-bg rounded-md shadow-xl py-1 z-50 border border-card-border transition-all duration-200 ${
              isDropdownOpen 
                ? 'opacity-100 visible translate-y-0' 
                : 'opacity-0 invisible -translate-y-1'
            }`}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-card-border">
              Signed in as <strong>{session.user?.username}</strong>
            </div>
            {session.user?.role === 'ADMIN' && (
              <Link 
                href="/config" 
                className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                系統設定
              </Link>
            )}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="block w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
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