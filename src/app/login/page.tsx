'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, FormEvent, Suspense } from 'react';

// 顯示載入圖標的組件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-background-start-rgb">
    <div className="jira-card p-8 w-full max-w-md text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-color mx-auto"></div>
      <p className="mt-3">載入中...</p>
    </div>
  </div>
);

// 包含 useSearchParams 的實際登入表單組件
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(error ? "Invalid credentials" : null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setLoginError(null);

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setLoginError(result.error === "CredentialsSignin" ? "Invalid username or password." : result.error);
    } else if (result?.url) {
      router.push(result.url);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-start-rgb">
      <div className="jira-card p-8 w-full max-w-md">
        <h1 className="content-title text-center mb-6">登入系統</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              使用者名稱
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-color focus:border-primary-color dark:bg-gray-700 dark:text-gray-100"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              密碼
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-color focus:border-primary-color dark:bg-gray-700 dark:text-gray-100"
              disabled={loading}
            />
          </div>

          {loginError && (
            <p className="text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-2.5 rounded-md">
              {loginError}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-2.5"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
              ) : (
                '登入'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 主頁面組件，使用 Suspense 包裹 LoginForm
export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginForm />
    </Suspense>
  );
} 