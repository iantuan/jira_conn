'use client';

import { useState, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { jiraConfigAtom, currentPageIdAtom, currentPageAtom } from '@/store/jiraStore';
import Link from 'next/link';
import { JiraIssue } from '@/types/jira';
import { formatDistanceToNow } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { createJiraService } from '@/services/jiraService';

// Placeholder icons from globals.css or a component library
const LoadingIcon = () => <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-color mx-auto"></div>;
const ErrorIcon = () => <svg className="w-12 h-12 text-accent-color mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
const EmptyIcon = () => <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;

export default function DashboardPage() {
  const searchParamsNav = useSearchParams();
  const pageIdFromUrl = searchParamsNav.get('pageId');
  
  const jiraConfig = useAtomValue(jiraConfigAtom);
  const [currentPageId, setCurrentPageId] = useAtom(currentPageIdAtom);
  const [currentPageDetails] = useAtom(currentPageAtom); // This atom is derived from currentPageId and jiraConfig
  
  const [startAt, setStartAt] = useState(0);
  const issuesPerPage = 20; // Or make this configurable

  // Effect to sync currentPageId with URL, and reset pagination
  useEffect(() => {
    if (pageIdFromUrl && pageIdFromUrl !== currentPageId) {
      setCurrentPageId(pageIdFromUrl);
      setStartAt(0); 
    } else if (!pageIdFromUrl && jiraConfig.pages.length > 0 && !currentPageId) {
      // If no pageId in URL, but pages exist and no currentPageId is set, default to first page
      // This might be handled by Navigation component too, ensuring currentPageIdAtom is set.
      // For robustness, we can set it here if it's still null.
      // setCurrentPageId(jiraConfig.pages[0].id);
      // setStartAt(0);
    } else if (!pageIdFromUrl && !currentPageId && jiraConfig.pages.length === 0){
      // No pages configured, currentPageId will be null, handled by return below
    }
  }, [pageIdFromUrl, currentPageId, setCurrentPageId, jiraConfig.pages]);

  const { data, error, isLoading, mutate } = useSWR(
    currentPageDetails && jiraConfig.baseUrl && currentPageDetails.jql
      ? [`jira-search`, currentPageDetails.jql, jiraConfig, startAt, issuesPerPage] 
      : null,
    async ([_, jql, config, currentStartAt, currentMaxResults]) => {
      const service = createJiraService(config);
      return service.searchIssues(jql, currentStartAt, currentMaxResults);
    },
    { revalidateOnFocus: true, keepPreviousData: true } // keepPreviousData for smoother pagination
  );

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      console.warn("Error formatting date:", dateString, e);
      return dateString;
    }
  };
  
  const getStatusClass = (statusCategoryKey?: string, statusName?: string) => {
    if (statusCategoryKey === 'done') return 'status-done';
    if (statusCategoryKey === 'indeterminate') return 'status-inprogress';
    if (statusCategoryKey === 'new' || statusCategoryKey === 'undefined') return 'status-todo'; // 'undefined' for some Jira Cloud statuses
    // Fallback for specific names if category is not standard
    if (statusName?.toLowerCase().includes('block')) return 'status-blocked';
    return 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'; // Default fallback
  };

  // Initial state: No pages configured at all
  if (jiraConfig.pages.length === 0) {
    return (
      <div className="text-center py-10">
        <EmptyIcon />
        <h2 className="content-title text-xl">尚未設定查詢頁面</h2>
        <p className="content-description">您需要先設定至少一個查詢頁面才能查看儀表板。</p>
        <Link href="/config" className="btn btn-primary mt-4">
          前往設定頁面
        </Link>
      </div>
    );
  }

  // State: Pages configured, but no specific page selected (e.g. /dashboard direct access)
  if (!currentPageDetails) {
    return (
      <div className="text-center py-10">
        <EmptyIcon />
        <h2 className="content-title text-xl">請選擇一個查詢</h2>
        <p className="content-description">請從左側側邊欄選擇一個 Jira 查詢頁面來顯示相關問題。</p>
        {/* Optionally, show a list of available pages here as well, or guide to sidebar more explicitly */}
      </div>
    );
  }

  // Main content rendering logic for a selected page
  const renderContent = () => {
    if (isLoading && !data) { // Show full page loader only on initial load or when JQL changes
      return (
        <div className="text-center py-20">
          <LoadingIcon />
          <p className="mt-3 text-gray-600 dark:text-gray-400">正在載入問題...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="jira-card p-6 text-center">
          <ErrorIcon />
          <h3 className="text-lg font-semibold text-accent-color mb-2">載入 Jira 資料時發生錯誤</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{error.message || '未知的網路錯誤，請檢查您的 Jira 連線設定或網路狀態。'}</p>
          <button onClick={() => mutate()} className="btn btn-primary">
            重試
          </button>
        </div>
      );
    }

    if (!data || !data.issues || data.issues.length === 0) {
      return (
        <div className="jira-card p-8 text-center">
          <EmptyIcon />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">找不到相關問題</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">目前的 JQL 查詢沒有返回任何結果。</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 break-all">JQL: <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded">{currentPageDetails.jql}</code></p>
        </div>
      );
    }

    // Issues table is rendered if data is available
    return (
      <div className="jira-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {/* Define columns based on available data or configuration */}
                {['Key', 'Summary', 'Status', 'Assignee', 'Priority', 'Updated'].map(header => (
                  <th key={header} className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-left whitespace-nowrap">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {data.issues.map((issue: JiraIssue) => (
                <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link href={`/dashboard/issue/${issue.key}`} className="flex items-center text-primary-color hover:underline">
                      {issue.fields.issuetype?.iconUrl && <img src={issue.fields.issuetype.iconUrl} alt={issue.fields.issuetype.name || 'type'} className="w-4 h-4 mr-1.5 flex-shrink-0" />}
                      {issue.key}
                    </Link>
                  </td>
                  <td className="px-4 py-3 max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg truncate">
                    <Link href={`/dashboard/issue/${issue.key}`} title={issue.fields.summary} className="hover:underline">
                      {issue.fields.summary}
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`status-badge ${getStatusClass(issue.fields.status?.statusCategory?.key, issue.fields.status?.name)}`}>
                      {issue.fields.status?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {issue.fields.assignee ? (
                      <div className="flex items-center">
                        {issue.fields.assignee.avatarUrls?.['24x24'] && <img src={issue.fields.assignee.avatarUrls['24x24']} alt={issue.fields.assignee.displayName} className="w-5 h-5 rounded-full mr-2 flex-shrink-0" />}
                        <span className="truncate">{issue.fields.assignee.displayName}</span>
                      </div>
                    ) : <span className="text-gray-400 dark:text-gray-500">未指派</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {issue.fields.priority ? (
                      <div className="flex items-center">
                        {typeof issue.fields.priority === 'object' && issue.fields.priority.iconUrl && <img src={issue.fields.priority.iconUrl} alt={issue.fields.priority.name || 'priority'} className="w-4 h-4 mr-1.5 flex-shrink-0"/>}
                        <span>{typeof issue.fields.priority === 'object' ? issue.fields.priority.name : String(issue.fields.priority)}</span>
                      </div>
                    ) : <span className="text-gray-400 dark:text-gray-500">-</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{issue.fields.updated ? formatDate(issue.fields.updated) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {data.total > issuesPerPage && (
          <div className="p-4 border-t border-card-border flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              顯示 {startAt + 1} - {Math.min(startAt + data.issues.length, data.total)} / 共 {data.total} 個結果
            </span>
            <div className="space-x-2">
              <button 
                onClick={() => setStartAt(prev => Math.max(0, prev - issuesPerPage))}
                disabled={startAt === 0 || (isLoading && !!data) }
                className="btn btn-ghost py-1.5 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一頁
              </button>
              <button 
                onClick={() => setStartAt(prev => prev + issuesPerPage)}
                disabled={startAt + issuesPerPage >= data.total || (isLoading && !!data)}
                className="btn btn-ghost py-1.5 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一頁
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main return for the page, once a currentPageDetails is confirmed
  return (
    <div className="space-y-6">
      <div>
        <h1 className="content-title">{currentPageDetails.title}</h1>
        {currentPageDetails.description && 
          <p className="content-description -mt-2 max-w-3xl">{currentPageDetails.description}</p>}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="break-all">JQL: <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded text-gray-700 dark:text-gray-200 text-[0.7rem]">{currentPageDetails.jql}</code></span>
          <button 
            onClick={() => mutate()} 
            className="btn btn-ghost py-1 px-2.5 text-xs mt-1 sm:mt-0 flex-shrink-0" 
            disabled={isLoading && !data} // Only disable on initial hard load
          >
            {isLoading && !data ? '載入中...' : '重新整理資料'}
          </button>
        </div>
      </div>
      {renderContent()} 
    </div>
  );
} 