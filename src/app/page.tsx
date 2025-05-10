import Link from 'next/link';

// Placeholder icons
const SettingsIcon = () => <svg className="w-6 h-6 text-primary-color" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const ChartIcon = () => <svg className="w-6 h-6 text-secondary-color" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>;
const InfoIcon = () => <svg className="w-6 h-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="content-title">儀表板總覽</h1>
      <p className="content-description">
        歡迎使用 Jira Dashboard Pro。在這裡您可以管理您的 Jira 連接，配置查詢頁面，並查看詳細的數據分析。
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="jira-card p-6">
          <div className="flex items-start mb-4">
            <SettingsIcon />
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">系統設定</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">配置您的 Jira 連線並客製化您的查詢頁面。</p>
            </div>
          </div>
          <Link 
            href="/config" 
            className="btn btn-primary w-full sm:w-auto"
          >
            前往設定
          </Link>
        </div>
        
        <div className="jira-card p-6">
          <div className="flex items-start mb-4">
            <ChartIcon />
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">報表分析</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">基於您定義的 JQL 查詢來查看客製化的 Jira 報表。</p>
            </div>
          </div>
          <Link 
            href="/dashboard" 
            className="btn btn-secondary w-full sm:w-auto"
          >
            查看報表
          </Link>
        </div>
      </div>
      
      <div className="jira-card p-6">
        <div className="flex items-start">
          <InfoIcon />
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">關於本系統</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              此應用程式旨在提供一個強大且靈活的工具，幫助您從 Jira 中提取有價值的數據洞察。您可以創建多個不同的查詢頁面，每個頁面專注於您 Jira 項目的特定方面，從而實現高效的數據可視化和問題追蹤。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
