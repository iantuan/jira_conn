'use client';

import { useState, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  currentPageIdAtom,
  currentPageAtom, 
  jiraPagesApiAtom 
} from '@/store/jiraStore';
import Link from 'next/link';
import { JiraIssue } from '@/types/jira';
import { formatDistanceToNow } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import React from 'react';

// 定義可排序的欄位
type SortField = 'key' | 'summary' | 'status' | 'assignee' | 'priority' | 'updated';
type SortOrder = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

// Placeholder icons
const LoadingIcon = () => <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-color mx-auto"></div>;
const ErrorIcon = () => <svg className="w-12 h-12 text-accent-color mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
const EmptyIcon = () => <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;

export default function DashboardPage() {
  const searchParamsNav = useSearchParams();
  const pageIdFromUrl = searchParamsNav.get('pageId');
  
  const [currentPageId, setCurrentPageId] = useAtom(currentPageIdAtom);
  const currentPageDetails = useAtomValue(currentPageAtom); 
  const jiraPages = useAtomValue(jiraPagesApiAtom);
  
  const [startAt, setStartAt] = useState(0);
  const issuesPerPage = 20;
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'updated', order: 'desc' });
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set());
  const [epicChildren, setEpicChildren] = useState<Record<string, JiraIssue[]>>({});

  useEffect(() => {
    if (pageIdFromUrl && pageIdFromUrl !== currentPageId) {
      setCurrentPageId(pageIdFromUrl);
      setStartAt(0);
    } else if (!pageIdFromUrl && jiraPages.length > 0 && !currentPageId) {
      // Optionally default to first page if no pageId in URL
      // This logic might be better placed in a wrapper or when the app initializes
      // For now, if no pageId from URL, it will rely on currentPageDetails being null to show selection prompt.
    }
  }, [pageIdFromUrl, currentPageId, setCurrentPageId, jiraPages]);

  // SWR key now includes sort parameters
  const swrKey = currentPageDetails && currentPageDetails.id
    ? [`/api/jira`, currentPageDetails.id, startAt, issuesPerPage, sortConfig.field, sortConfig.order]
    : null;

  const { data, error, isLoading, mutate } = useSWR(swrKey,
    async ([url, pId, sAt, mResults, sortField, sortOrder]: [string, string, number, number, string, string]) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId: pId,
          startAt: sAt,
          maxResults: mResults,
          sortField,
          sortOrder,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        const err = new Error(errorData.message || 'Failed to fetch Jira issues through proxy') as any;
        err.status = response.status;
        throw err;
      }
      return response.json();
    },
    { revalidateOnFocus: true, keepPreviousData: true }
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
    if (statusCategoryKey === 'new' || statusCategoryKey === 'undefined') return 'status-todo';
    if (statusName?.toLowerCase().includes('block')) return 'status-blocked';
    return 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200';
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
    }));
    setStartAt(0); // Reset to first page when sorting changes
  };

  // Function to fetch epic children
  const fetchEpicChildren = async (epicKey: string) => {
    try {
      const response = await fetch('/api/jira', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetEndpoint: '/rest/api/2/search',
          jiraApiMethod: 'POST',
          jiraApiBody: {
            jql: `"Epic Link" = ${epicKey}`,
            fields: ["summary", "status", "assignee", "reporter", "priority", "issuetype", "created", "updated", "project"],
            expand: ["renderedFields", "names", "schema"],
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch epic children');
      }

      const data = await response.json();
      return data.issues || [];
    } catch (error) {
      console.error('Error fetching epic children:', error);
      return [];
    }
  };

  // Function to handle epic expansion
  const handleEpicExpand = async (epicKey: string) => {
    if (expandedEpics.has(epicKey)) {
      setExpandedEpics(prev => {
        const next = new Set(prev);
        next.delete(epicKey);
        return next;
      });
    } else {
      setExpandedEpics(prev => new Set(prev).add(epicKey));
      if (!epicChildren[epicKey]) {
        const children = await fetchEpicChildren(epicKey);
        setEpicChildren(prev => ({ ...prev, [epicKey]: children }));
      }
    }
  };

  // Show loading if jiraPages are loading and no page is selected yet, or if currentPageDetails is missing
  if (jiraPages.length === 0 && isLoading) { // Could use a dedicated isLoadingPages from a SWR hook for jiraPages if available
    return (
      <div className="text-center py-10">
        <LoadingIcon />
        <p className="mt-3 text-gray-600 dark:text-gray-400">Loading page configurations...</p>
      </div>
    );
  }

  if (jiraPages.length === 0) { 
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

  if (!currentPageDetails) {
    return (
      <div className="text-center py-10">
        <EmptyIcon />
        <h2 className="content-title text-xl">請選擇一個查詢</h2>
        <p className="content-description">請從左側側邊欄選擇一個 Jira 查詢頁面來顯示相關問題。</p>
      </div>
    );
  }

  // Now that we have currentPageDetails, proceed to render its content or loading/error states for its data
  const renderContent = () => {
    if (isLoading && !data) { // isLoading for the SWR call for issues of the currentPageDetails
      return (
        <div className="text-center py-20">
          <LoadingIcon />
          <p className="mt-3 text-gray-600 dark:text-gray-400">正在載入問題 for {currentPageDetails.title}...</p>
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
          <p className="text-sm text-gray-500 dark:text-gray-400">目前的 JQL 查詢 ({currentPageDetails.jql}) 沒有返回任何結果。</p>
        </div>
      );
    }
    return (
      <div className="jira-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {currentPageDetails.type === 'epic' && <th className="px-4 py-3 w-8"></th>}
                {['Key', 'Summary', 'Status', 'Assignee', 'Priority', 'Updated'].map(header => (
                  <th key={header} className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-left whitespace-nowrap">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {data.issues.map((issue: JiraIssue) => (
                <React.Fragment key={issue.id}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    {currentPageDetails.type === 'epic' && (
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleEpicExpand(issue.key)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          {expandedEpics.has(issue.key) ? '▼' : '▶'}
                        </button>
                      </td>
                    )}
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
                          {issue.fields.assignee.avatarUrls?.['24x24'] && (
                            <img src={issue.fields.assignee.avatarUrls['24x24']} alt="" className="w-5 h-5 rounded-full mr-1.5" />
                          )}
                          <span>{issue.fields.assignee.displayName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {issue.fields.priority && (
                        <div className="flex items-center">
                          {typeof issue.fields.priority === 'object' && issue.fields.priority.iconUrl && (
                            <img src={issue.fields.priority.iconUrl} alt="" className="w-4 h-4 mr-1" />
                          )}
                          <span>{typeof issue.fields.priority === 'object' ? issue.fields.priority.name : issue.fields.priority}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{issue.fields.updated ? formatDate(issue.fields.updated) : '-'}</td>
                  </tr>
                  {currentPageDetails.type === 'epic' && expandedEpics.has(issue.key) && epicChildren[issue.key]?.map((child: JiraIssue) => (
                    <tr key={child.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors bg-gray-50/50 dark:bg-gray-800/50">
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link href={`/dashboard/issue/${child.key}`} className="flex items-center text-primary-color hover:underline">
                          {child.fields.issuetype?.iconUrl && <img src={child.fields.issuetype.iconUrl} alt={child.fields.issuetype.name || 'type'} className="w-4 h-4 mr-1.5 flex-shrink-0" />}
                          {child.key}
                        </Link>
                      </td>
                      <td className="px-4 py-3 max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg truncate">
                        <Link href={`/dashboard/issue/${child.key}`} title={child.fields.summary} className="hover:underline">
                          {child.fields.summary}
                        </Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`status-badge ${getStatusClass(child.fields.status?.statusCategory?.key, child.fields.status?.name)}`}>
                          {child.fields.status?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {child.fields.assignee ? (
                          <div className="flex items-center">
                            {child.fields.assignee.avatarUrls?.['24x24'] && (
                              <img src={child.fields.assignee.avatarUrls['24x24']} alt="" className="w-5 h-5 rounded-full mr-1.5" />
                            )}
                            <span>{child.fields.assignee.displayName}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {child.fields.priority && (
                          <div className="flex items-center">
                            {typeof child.fields.priority === 'object' && child.fields.priority.iconUrl && (
                              <img src={child.fields.priority.iconUrl} alt="" className="w-4 h-4 mr-1" />
                            )}
                            <span>{typeof child.fields.priority === 'object' ? child.fields.priority.name : child.fields.priority}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{child.fields.updated ? formatDate(child.fields.updated) : '-'}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {data.total > issuesPerPage && (
          <div className="p-4 border-t border-card-border flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              顯示 {startAt + 1} - {Math.min(startAt + data.issues.length, data.total)} / 共 {data.total} 個結果
            </span>
            <div className="space-x-2">
              <button onClick={() => setStartAt(prev => Math.max(0, prev - issuesPerPage))} disabled={startAt === 0 || (isLoading && !!data) } className="btn btn-ghost py-1.5 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                上一頁
              </button>
              <button onClick={() => setStartAt(prev => prev + issuesPerPage)} disabled={startAt + issuesPerPage >= data.total || (isLoading && !!data)} className="btn btn-ghost py-1.5 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                下一頁
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="content-title flex items-center">
          {currentPageDetails.title}
          <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {currentPageDetails.type === 'epic' ? 'Epic' : 'Issue'}
          </span>
        </h1>
        {currentPageDetails.description && 
          <p className="content-description -mt-2 max-w-3xl">{currentPageDetails.description}</p>}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="break-all">JQL: <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded text-gray-700 dark:text-gray-200 text-[0.7rem]">{currentPageDetails.jql}</code></span>
          <button onClick={() => mutate()} className="btn btn-ghost py-1 px-2.5 text-xs mt-1 sm:mt-0 flex-shrink-0" disabled={isLoading && !data}>
            {isLoading && !data ? '載入中...' : '重新整理資料'}
          </button>
        </div>
      </div>
      {currentPageDetails && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{currentPageDetails.title}</h2>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {currentPageDetails.type === 'epic' ? 'Epic' : 'Issue'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="sortField" className="text-sm text-gray-600 dark:text-gray-300">Sort by:</label>
                <select 
                  id="sortField"
                  value={sortConfig.field}
                  onChange={(e) => handleSort(e.target.value as SortField)}
                  className="text-sm border rounded px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  <option value="key">Key</option>
                  <option value="summary">Summary</option>
                  <option value="status">Status</option>
                  <option value="assignee">Assignee</option>
                  <option value="priority">Priority</option>
                  <option value="updated">Updated</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setSortConfig(prev => ({ ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }));
                  setStartAt(0); // Reset to first page when sort order changes
                }}
                className="flex items-center space-x-1 px-3 py-1.5 border rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-sm"
              >
                <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                <span>{sortConfig.order === 'asc' ? 'Ascending' : 'Descending'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {renderContent()} 
    </div>
  );
} 