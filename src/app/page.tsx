import Link from 'next/link';

export default function Home() {
  return (
    <>
      <h1 className="content-title">儀表板概覽</h1>
      <p className="content-description">
        此頁面提供各種Jira報表和功能的快速訪問。
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="jira-card p-5">
          <div className="flex items-center mb-3">
            <span className="sidebar-icon text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              </svg>
            </span>
            <h2 className="text-lg font-semibold ml-2">系統設定</h2>
          </div>
          <p className="mb-4">配置您的Jira連接和自定義儀表板頁面。</p>
          <Link 
            href="/config" 
            className="inline-block text-white font-medium py-2 px-4 rounded"
            style={{ backgroundColor: 'rgb(var(--primary-color))' }}
          >
            管理設定
          </Link>
        </div>
        
        <div className="jira-card p-5">
          <div className="flex items-center mb-3">
            <span className="sidebar-icon text-secondary-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </span>
            <h2 className="text-lg font-semibold ml-2">報表分析</h2>
          </div>
          <p className="mb-4">查看基於JQL查詢的自定義Jira儀表板。</p>
          <Link 
            href="/dashboard" 
            className="inline-block text-white font-medium py-2 px-4 rounded"
            style={{ backgroundColor: 'rgb(var(--secondary-color))' }}
          >
            查看報表
          </Link>
        </div>
      </div>
      
      <div className="mt-8 jira-card p-5">
        <div className="flex items-center mb-3">
          <span className="sidebar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </span>
          <h2 className="text-lg font-semibold ml-2">關於系統</h2>
        </div>
        <p>
          本應用程序允許您為Jira數據創建自定義儀表板。
          您可以定義多個頁面，每個頁面具有自己的JQL查詢，以可視化Jira項目的不同方面。
        </p>
      </div>
    </>
  );
}
