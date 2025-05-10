'use client';

import { useState, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { jiraConfigAtom, currentPageIdAtom, searchParamsAtom, currentPageAtom } from '@/store/jiraStore';
import { useJiraIssues } from '@/hooks/useJira';
import Link from 'next/link';
import { JiraIssue } from '@/types/jira';
import { formatDistanceToNow } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { callJiraApi, createJiraService } from '@/services/jiraService';

export default function DashboardPage() {
  const config = useAtomValue(jiraConfigAtom);
  const [currentPageId, setCurrentPageId] = useAtom(currentPageIdAtom);
  const [searchParams, setSearchParams] = useAtom(searchParamsAtom);
  const [currentPage] = useAtom(currentPageAtom);
  const { data, error, isLoading, mutate } = useJiraIssues();
  const [showDebug, setShowDebug] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const searchParamsNav = useSearchParams();
  const pageId = searchParamsNav.get('pageId');
  
  // Check if there's any page and set current page if not set
  useEffect(() => {
    if (config.pages.length > 0 && !currentPageId) {
      setCurrentPageId(config.pages[0].id);
    }
  }, [config.pages, currentPageId, setCurrentPageId]);

  // 如果URL中有pageId參數，則更新當前選中的頁面
  useEffect(() => {
    if (pageId && pageId !== currentPageId) {
      setCurrentPageId(pageId);
    }
  }, [pageId, currentPageId, setCurrentPageId]);

  // Current page
  const currentPageDashboard = config.pages.find(page => page.id === currentPageId);
  
  // Handle page change
  const handlePageChange = (pageId: string) => {
    setCurrentPageId(pageId);
    setSearchParams(prev => ({ ...prev, startAt: 0 }));
  };
  
  // Handle pagination
  const handleNextPage = () => {
    if (data && data.startAt + data.maxResults < data.total) {
      setSearchParams(prev => ({ 
        ...prev, 
        startAt: prev.startAt + prev.maxResults 
      }));
    }
  };
  
  const handlePrevPage = () => {
    if (searchParams.startAt > 0) {
      setSearchParams(prev => ({ 
        ...prev, 
        startAt: Math.max(0, prev.startAt - prev.maxResults) 
      }));
    }
  };
  
  // Formatter for date fields
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };
  
  // Get status badge class
  const getStatusClass = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('to do') || statusLower.includes('open') || statusLower.includes('new')) {
      return 'status-todo';
    } else if (statusLower.includes('progress') || statusLower.includes('review')) {
      return 'status-inprogress';
    } else if (statusLower.includes('done') || statusLower.includes('closed') || statusLower.includes('resolved')) {
      return 'status-done';
    } else if (statusLower.includes('block') || statusLower.includes('impediment')) {
      return 'status-blocked';
    }
    return 'bg-gray-100 text-gray-800';
  };
  
  // Render an issue row
  const renderIssueRow = (issue: JiraIssue) => {
    const { fields } = issue;
    
    // 防止空值
    if (!fields) {
      console.warn(`Issue ${issue.key} has no fields`, issue);
      return null;
    }
    
    const statusName = fields.status?.name || 'Unknown';
    const statusClass = getStatusClass(statusName);
    
    return (
      <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b">
        <td className="px-4 py-3">
          <Link 
            href={`/dashboard/issue/${issue.key}`}
            className="text-blue-600 hover:underline flex items-center"
          >
            {fields.issuetype && (
              <img 
                src={fields.issuetype.iconUrl} 
                alt={fields.issuetype.name} 
                className="w-4 h-4 mr-2" 
              />
            )}
            {issue.key}
          </Link>
        </td>
        <td className="px-4 py-3">
          <Link 
            href={`/dashboard/issue/${issue.key}`}
            className="hover:text-blue-600 hover:underline font-medium"
          >
            {fields.summary}
          </Link>
        </td>
        <td className="px-4 py-3">
          <span className={`status-badge ${statusClass}`}>
            {statusName}
          </span>
        </td>
        <td className="px-4 py-3">
          {fields.assignee ? (
            <div className="flex items-center">
              {fields.assignee.avatarUrls && (
                <img 
                  src={fields.assignee.avatarUrls['24x24']} 
                  alt={fields.assignee.displayName}
                  className="w-5 h-5 rounded-full mr-2" 
                />
              )}
              <span>{fields.assignee.displayName}</span>
            </div>
          ) : (
            <span className="text-gray-400">未分配</span>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {formatDate(fields.updated)}
        </td>
      </tr>
    );
  };
  
  // If no configuration is set
  if (config.pages.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">No Pages Configured</h1>
        <p className="mb-4">You need to configure at least one page to view the dashboard.</p>
        <Link
          href="/config"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Go to Configuration
        </Link>
      </div>
    );
  }
  
  // 如果沒有選擇頁面，顯示頁面選擇界面
  if (!currentPage) {
    return (
      <div className="p-6">
        <h1 className="content-title">Jira儀表板</h1>
        <p className="content-description mb-6">請從左側選擇一個查詢頁面或創建新頁面</p>
      </div>
    );
  }

  // 錯誤處理
  if (error) {
    return (
      <div className="p-6">
        <h1 className="content-title">{currentPage.title}</h1>
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded mt-4">
          <div className="font-semibold mb-2">獲取Jira數據時出錯</div>
          <div className="text-sm">{error.message || '未知錯誤'}</div>
        </div>
      </div>
    );
  }

  // 加載中的顯示
  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="content-title">{currentPage.title}</h1>
        <div className="animate-pulse mt-6">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  // 數據為空的情況
  if (!data || !data.issues || data.issues.length === 0) {
    return (
      <div className="p-6">
        <h1 className="content-title">{currentPage.title}</h1>
        <p className="content-description">{currentPage.description}</p>
        <div className="jira-card p-6 mt-4 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
          </svg>
          <p>沒有符合查詢條件的結果</p>
          <div className="mt-2 text-sm text-gray-500">JQL: {currentPage.jql}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="py-4 px-4 mb-4 border-b flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Jira Dashboard</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => mutate()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            重新整理
          </button>
          
          <Link
            href="/config"
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            設定
          </Link>
          
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Main Content with Sidebar */}
      <div className="layout-container px-4 mb-8">
        {/* Sidebar with Page Tabs */}
        <div className={`sidebar bg-white dark:bg-gray-800 rounded-lg jira-card ${isSidebarOpen ? '' : 'hidden md:block'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">頁面</h2>
            <button 
              className="md:hidden text-gray-600 dark:text-gray-400"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-1">
            {config.pages.map(page => (
              <button
                key={page.id}
                onClick={() => handlePageChange(page.id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  currentPageId === page.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${currentPageId === page.id ? 'text-blue-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                    <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                  <span>{page.title}</span>
                </div>
                {page.description && (
                  <p className="ml-6 text-xs text-gray-500 dark:text-gray-400 truncate">
                    {page.description}
                  </p>
                )}
              </button>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <Link 
              href="/config"
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
              </svg>
              新增頁面
            </Link>
          </div>
        </div>
        
        {/* Mobile Sidebar Toggle */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="fixed bottom-4 left-4 z-10 md:hidden bg-blue-600 text-white rounded-full p-3 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        )}
        
        {/* Main Content */}
        <div className="main-content">
          {/* Debug Information */}
          {showDebug && (
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg overflow-auto max-h-96 jira-card">
              <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
              <div className="space-y-2">
                <div>
                  <strong>Base URL:</strong> {config.baseUrl}
                </div>
                <div>
                  <strong>Current Page:</strong> {currentPage?.title || 'None'} (ID: {currentPageId || 'None'})
                </div>
                <div>
                  <strong>JQL:</strong> <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{currentPage?.jql || 'None'}</code>
                </div>
                <div>
                  <strong>Pagination:</strong> startAt={searchParams.startAt}, maxResults={searchParams.maxResults}
                </div>
                <div>
                  <strong>Response:</strong> {isLoading ? 'Loading...' : error ? `Error: ${error.message}` : data ? `${data.issues?.length || 0} issues of ${data.total || 0} total` : 'No data'}
                </div>
                {data && data.issues && data.issues.length > 0 && (
                  <div>
                    <strong>Sample Issue:</strong>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs mt-1 overflow-auto">
                      {JSON.stringify(data.issues[0], null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Current Page Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg jira-card mb-5">
            {currentPage && (
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">{currentPage.title}</h2>
                {currentPage.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{currentPage.description}</p>
                )}
                <div className="text-xs font-mono bg-gray-50 dark:bg-gray-700 p-2 mt-2 rounded border border-gray-100 dark:border-gray-600">
                  {currentPage.jql}
                </div>
              </div>
            )}
            
            {/* Issues Table */}
            {isLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">載入中...</p>
              </div>
            ) : error ? (
              <div className="p-4">
                <div className="bg-red-100 text-red-800 p-4 rounded-lg">
                  <p className="font-semibold">載入錯誤</p>
                  <p className="text-sm">{error.message}</p>
                </div>
              </div>
            ) : data && data.issues && data.issues.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                      <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Key</th>
                      <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Summary</th>
                      <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Status</th>
                      <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Assignee</th>
                      <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.issues.map(renderIssueRow)}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6">
                <div className="bg-yellow-50 text-yellow-800 p-6 rounded-lg text-center">
                  <p className="text-lg font-medium">No issues found</p>
                  <p className="mt-2">Try checking these common issues:</p>
                  <ul className="list-disc list-inside mt-2 text-left max-w-lg mx-auto text-sm">
                    <li>JQL 語法是否正確? 嘗試在 Jira 中直接運行您的 JQL 查詢。</li>
                    <li>您是否有權限訪問這些問題? JQL 中指定的項目可能需要特定權限。</li>
                    <li>檢查 Jira 連接設定是否正確 (正確的 URL、電子郵件和 API 令牌)。</li>
                    <li>嘗試簡化 JQL，例如使用: <code className="bg-white px-1">project = "項目代碼"</code> 來測試。</li>
                  </ul>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => mutate()}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                      重新嘗試
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Pagination */}
            {data && data.issues && data.issues.length > 0 && (
              <div className="border-t p-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {`顯示 ${searchParams.startAt + 1} - ${Math.min(searchParams.startAt + (data.issues?.length || 0), data.total)} / 共 ${data.total || 0} 個項目`}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={searchParams.startAt === 0}
                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    上一頁
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={!data || searchParams.startAt + data.maxResults >= data.total}
                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    下一頁
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 