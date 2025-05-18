'use client';

import { useState, useEffect, Suspense, Component } from 'react';
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

// 甘特圖的時間相關函數
const calculateTimeDifference = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
};

const formatGanttDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// ErrorBoundary component
class ErrorBoundary extends Component<{children: React.ReactNode, fallback?: React.ReactNode}> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error caught by error boundary:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-500 rounded-lg bg-red-50 text-red-700 my-4">
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-sm">Please try refreshing the page</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
          >
            Refresh
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// 使用 SearchParams 的組件，包裹在 Suspense 中
function DashboardContent() {
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
  const [columnWidth, setColumnWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  // 用於在組件掛載後設置滾動位置的引用 (moved from renderGanttChart)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const headerScrollRef = React.useRef<HTMLDivElement>(null);
  const bodyScrollRef = React.useRef<HTMLDivElement>(null);
  const ganttHeaderLeftRef = React.useRef<HTMLDivElement>(null);
  const ganttBodyLeftRef = React.useRef<HTMLDivElement>(null);
  const resizerRef = React.useRef<HTMLDivElement>(null);
  
  // Calculate today position for Gantt chart
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
          maxResults: currentPageDetails?.type === 'gantt' ? 100 : mResults, // Increase limit for Gantt view
          sortField,
          sortOrder,
          filterType: currentPageDetails?.type === 'gantt' ? 'epic' : undefined, // Add Epic filter for Gantt view
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

  // 設置初始滾動位置到今天的日期 (moved from renderGanttChart)
  useEffect(() => {
    // Only execute if we have data and are viewing a gantt chart
    if (data?.issues && data.issues.length > 0 && currentPageDetails?.type === 'gantt') {
      // Need to calculate these values here based on data
      let minDate = new Date();
      let maxDate = new Date();
      
      // Find date range from issues
      data.issues.forEach((issue: JiraIssue) => {
        const start = getStartDate(issue);
        const end = getDueDate(issue);
        
        if (start < minDate) minDate = start;
        if (end > maxDate) maxDate = end;
      });
      
      // 在時間範圍的開始和結束各添加一個月的緩衝
      minDate = new Date(minDate.getFullYear(), minDate.getMonth() - 1, minDate.getDate());
      
      // Calculate today's position
      const dayWidth = 13;
      const todayOffset = Math.max(0, Math.ceil((today.getTime() - minDate.getTime()) / (1000 * 3600 * 24)));
      const todayPosition = todayOffset * dayWidth;
      
      // Set scroll position to center today's date
      if (bodyScrollRef.current) {
        const halfViewportWidth = bodyScrollRef.current.clientWidth / 2;
        bodyScrollRef.current.scrollLeft = todayPosition - halfViewportWidth;
      }
      
      if (headerScrollRef.current) {
        const halfViewportWidth = headerScrollRef.current.clientWidth / 2;
        headerScrollRef.current.scrollLeft = todayPosition - halfViewportWidth;
      }
    }
  }, [data, currentPageDetails]);
  
  // Synchronize scrolling between header and body
  useEffect(() => {
    const headerEl = headerScrollRef.current;
    const bodyEl = bodyScrollRef.current;
    
    if (!headerEl || !bodyEl) return;
    
    // Initial sync
    const initialScroll = bodyEl.scrollLeft;
    headerEl.scrollLeft = initialScroll;
    
    const syncHeaderScroll = () => {
      if (headerEl) {
        headerEl.scrollLeft = bodyEl.scrollLeft;
      }
    };
    
    const syncBodyScroll = () => {
      if (bodyEl) {
        bodyEl.scrollLeft = headerEl.scrollLeft;
      }
    };
    
    bodyEl.addEventListener('scroll', syncHeaderScroll);
    headerEl.addEventListener('scroll', syncBodyScroll);
    
    return () => {
      bodyEl.removeEventListener('scroll', syncHeaderScroll);
      headerEl.removeEventListener('scroll', syncBodyScroll);
    };
  }, [data, currentPageDetails]); // Re-run when data or page type changes

  // Helper functions for date handling (moved from renderGanttChart)
  const parseJiraDate = (dateString: string | null | undefined): Date | null => {
    if (!dateString) return null;
    
    // 嘗試解析日期
    try {
      const date = new Date(dateString);
      // 檢查是否為有效日期
      if (isNaN(date.getTime())) return null;
      return date;
    } catch (e) {
      console.warn("Error parsing date:", dateString, e);
      return null;
    }
  };
  
  // 獲取 Jira 日期字段，優先使用標準字段和自定義字段
  const getStartDate = (issue: JiraIssue): Date => {
    // 嘗試各種可能的開始日期字段
    const customStartDate = parseJiraDate(issue.fields.customfield_10015); // 自定義開始日期字段
    const startDate = parseJiraDate(issue.fields.startDate); // 可能的其他字段名
    const createdDate = parseJiraDate(issue.fields.created);
    
    // 返回第一個有效的日期，或當前日期作為后備
    return customStartDate || startDate || createdDate || new Date();
  };
  
  const getDueDate = (issue: JiraIssue): Date => {
    // 嘗試各種可能的結束日期字段
    const dueDate = parseJiraDate(issue.fields.duedate); // Jira 標準到期日字段（注意小寫）
    const endDate = parseJiraDate(issue.fields.endDate); // 可能的其他字段名
    const updatedDate = parseJiraDate(issue.fields.updated);
    
    // 如果沒有到期日，則使用開始日期加 7 天
    if (!dueDate && !endDate && !updatedDate) {
      const start = getStartDate(issue);
      return new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
    
    // 返回第一個有效的日期
    return dueDate || endDate || updatedDate || new Date();
  };

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
            fields: [
              "summary", 
              "status", 
              "assignee", 
              "reporter", 
              "priority", 
              "issuetype", 
              "created", 
              "updated", 
              "project",
              "duedate",          // Standard Jira due date field
              "customfield_10015" // Start date field
            ],
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

  // Handle column resize
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection during resize
    setIsResizing(true);
    
    // Track initial mouse position and column width
    const startX = e.clientX;
    const startWidth = columnWidth;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate how far the mouse has moved
      const delta = e.clientX - startX;
      // Apply the movement to the starting width (constrain to min 200px)
      const newWidth = Math.max(200, startWidth + delta);
      setColumnWidth(newWidth);
      
      // Apply the width to relevant elements
      if (ganttHeaderLeftRef.current) {
        ganttHeaderLeftRef.current.style.width = `${newWidth}px`;
      }
      if (ganttBodyLeftRef.current) {
        ganttBodyLeftRef.current.style.width = `${newWidth}px`;
      }
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 渲染甘特圖視圖
  const renderGanttChart = () => {
    if (!data || !data.issues || data.issues.length === 0 || !currentPageDetails) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400">
          <EmptyIcon />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">找不到相關問題</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">目前的 JQL 查詢沒有返回任何結果。</p>
        </div>
      );
    }

    // 使用 API 傳回的所有 Epic 項目 (現在已在 API 端過濾)
    const epicIssues = data.issues;

    // 如果沒有Epic，顯示提示訊息 (冗餘檢查，因為現在 API 已過濾)
    if (epicIssues.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400">
          <EmptyIcon />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">找不到Epic問題</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">目前的 JQL 查詢 ({currentPageDetails.jql}) 沒有返回任何Epic類型的問題。</p>
        </div>
      );
    }

    try {
      // 找出所有日期的最小值和最大值，以確定甘特圖的時間範圍
      let minDate = new Date();
      let maxDate = new Date();
      
      // 先設置初始值
      epicIssues.forEach((issue: JiraIssue) => {
        const start = getStartDate(issue);
        const end = getDueDate(issue);
        
        if (start < minDate) minDate = start;
        if (end > maxDate) maxDate = end;
      });

      // 確保有合理的時間跨度（至少28天）
      if (maxDate.getTime() - minDate.getTime() < 28 * 24 * 60 * 60 * 1000) {
        maxDate = new Date(minDate.getTime() + 28 * 24 * 60 * 60 * 1000);
      }

      // 確保圖表包含今天的日期
      if (today < minDate) {
        minDate = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
      }
      if (today > maxDate) {
        maxDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
      }

      // 在時間範圍的開始和結束各添加一個月的緩衝
      minDate = new Date(minDate.getFullYear(), minDate.getMonth() - 1, minDate.getDate());
      maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, maxDate.getDate());

      // 計算總天數
      const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24));
      
      // 日期寬度值 - 縮小每天的寬度 (原來是30px)
      const dayWidth = 13; // 縮小為原來的2/3 (20px * 2/3 ≈ 13px)
      
      // 計算今天日期在甘特圖中的位置（用於設置滾動位置和今日線標記）
      const todayOffset = Math.max(0, Math.ceil((today.getTime() - minDate.getTime()) / (1000 * 3600 * 24)));
      const todayPosition = todayOffset * dayWidth;
      
      // 生成月份標題
      const months: {month: string, days: number}[] = [];
      let currentDate = new Date(minDate);
      while (currentDate < maxDate) {
        const monthName = currentDate.toLocaleString('default', { month: 'short' });
        const year = currentDate.getFullYear();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const remainingDays = Math.min(
          daysInMonth - currentDate.getDate() + 1,
          Math.ceil((maxDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24))
        );
        
        months.push({
          month: `${monthName} ${year}`,
          days: remainingDays
        });
        
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      }

      // 改進的日期格式化函數
      const formatGanttDateDisplay = (date: Date): string => {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`;
      };

      // 準備所有行數據，包括 Epics 和子任務
      const rowsData: Array<{
        issue: JiraIssue;
        isChild: boolean;
        parentKey?: string;
        startPosition: number;
        endPosition: number;
        startDisplay: string;
        endDisplay: string;
      }> = [];

      // 先添加所有 Epic
      epicIssues.forEach((issue: JiraIssue) => {
        const start = getStartDate(issue);
        const end = getDueDate(issue);
        
        const offsetDays = Math.max(0, Math.ceil((start.getTime() - minDate.getTime()) / (1000 * 3600 * 24)));
        const durationDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
        
        rowsData.push({
          issue,
          isChild: false,
          startPosition: offsetDays * dayWidth,
          endPosition: durationDays * dayWidth,
          startDisplay: formatGanttDateDisplay(start),
          endDisplay: formatGanttDateDisplay(end)
        });
        
        // 如果 Epic 已展開，添加其子任務
        if (expandedEpics.has(issue.key) && epicChildren[issue.key]) {
          epicChildren[issue.key].forEach((child: JiraIssue) => {
            const childStart = getStartDate(child);
            const childEnd = getDueDate(child);
            
            const childOffsetDays = Math.max(0, Math.ceil((childStart.getTime() - minDate.getTime()) / (1000 * 3600 * 24)));
            const childDurationDays = Math.max(1, Math.ceil((childEnd.getTime() - childStart.getTime()) / (1000 * 3600 * 24)));
            
            rowsData.push({
              issue: child,
              isChild: true,
              parentKey: issue.key,
              startPosition: childOffsetDays * dayWidth,
              endPosition: childDurationDays * dayWidth,
              startDisplay: formatGanttDateDisplay(childStart),
              endDisplay: formatGanttDateDisplay(childEnd)
            });
          });
        }
      });

      return (
        <ErrorBoundary fallback={
          <div className="p-4 border border-yellow-500 rounded-lg bg-yellow-50 text-yellow-700 my-4">
            <h3 className="text-lg font-semibold mb-2">甘特圖渲染出錯</h3>
            <p className="text-sm">顯示甘特圖時遇到問題，請刷新頁面或選擇不同的視圖模式</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700"
            >
              重新整理
            </button>
          </div>
        }>
          <div className="jira-card overflow-hidden">
            <div className="gantt-table-container">
              {/* Header */}
              <div className="gantt-table-header">
                <div 
                  className="gantt-header-left"
                  ref={ganttHeaderLeftRef}
                  style={{ width: `${columnWidth}px` }}
                >
                  問題
                  <div 
                    className={`gantt-resizer ${isResizing ? 'resizing' : ''}`}
                    onMouseDown={handleMouseDown}
                    ref={resizerRef}
                  ></div>
                </div>
                <div className="gantt-timeline-header" ref={headerScrollRef}>
                  <div style={{ width: `${totalDays * dayWidth}px`, position: 'relative' }}>
                    {months.map((monthData, idx) => (
                      <div 
                        key={idx} 
                        className="gantt-month"
                        style={{ width: `${monthData.days * dayWidth}px`, position: 'absolute', left: idx > 0 ? 
                          months.slice(0, idx).reduce((acc, m) => acc + m.days * dayWidth, 0) : 0 }}
                      >
                        {monthData.month}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Body with rows */}
              <div className="gantt-table-body">
                {/* Left fixed column */}
                <div 
                  className="gantt-body-left"
                  ref={ganttBodyLeftRef}
                  style={{ width: `${columnWidth}px`, position: 'relative' }}
                >
                  {/* 增加全高度的調整線，延伸至表格底部 */}
                  <div 
                    className={`gantt-table-resizer ${isResizing ? 'resizing' : ''}`}
                    onMouseDown={handleMouseDown}
                  ></div>
                  
                  {rowsData.map((row, idx) => (
                    <div 
                      key={`${row.issue.id}-left-${idx}`} 
                      className={`gantt-row-left ${row.isChild ? 'gantt-child-row' : ''}`}
                    >
                      {!row.isChild && (
                        <button
                          onClick={() => handleEpicExpand(row.issue.key)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mr-2"
                        >
                          {expandedEpics.has(row.issue.key) ? '▼' : '▶'}
                        </button>
                      )}
                      <Link 
                        href={`/dashboard/issue/${row.issue.key}`} 
                        className="hover:underline text-primary-color flex items-center gap-1 mr-2 flex-shrink-0"
                      >
                        {row.issue.fields.issuetype?.iconUrl && 
                          <img src={row.issue.fields.issuetype.iconUrl} alt="" className="w-4 h-4" />
                        }
                        <span>{row.issue.key}</span>
                      </Link>
                      <span className="truncate">{row.issue.fields.summary}</span>
                    </div>
                  ))}
                </div>
                
                {/* Right scrollable timeline */}
                <div className="gantt-body-right-wrapper" ref={bodyScrollRef}>
                  {/* Today marker that spans all rows */}
                  <div className="today-marker" style={{ left: `${todayPosition}px` }}></div>
                  
                  {/* Timeline rows */}
                  <div style={{ width: `${totalDays * dayWidth}px` }}>
                    {rowsData.map((row, idx) => (
                      <div 
                        key={`${row.issue.id}-right-${idx}`} 
                        className={`gantt-row ${row.isChild ? 'gantt-child-row' : ''}`}
                      >
                        <div className="gantt-row-right">
                          <div 
                            className="gantt-bar"
                            style={{
                              left: `${row.startPosition}px`,
                              width: `${row.endPosition}px`,
                              backgroundColor: getStatusColor(row.issue.fields.status?.statusCategory?.key, row.issue.fields.status?.name)
                            }}
                          >
                            {row.startDisplay} - {row.endDisplay}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pagination controls */}
            {data.total > issuesPerPage && (
              <div className="p-4 border-t border-card-border flex flex-col sm:flex-row justify-between items-center gap-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  顯示 {startAt + 1} - {Math.min(startAt + data.issues.length, data.total)} / 共 {data.total} 個 Epic
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
        </ErrorBoundary>
      );
    } catch (error) {
      console.error("Error in renderGanttChart:", error);
      return (
        <div className="p-4 border border-red-500 rounded-lg bg-red-50 text-red-700 my-4">
          <h3 className="text-lg font-semibold mb-2">處理甘特圖數據出錯</h3>
          <p className="text-sm">處理甘特圖數據時發生錯誤，請刷新頁面或稍後再試</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
          >
            重新整理
          </button>
        </div>
      );
    }
  };

  // 根據狀態獲取顏色（用於甘特圖）
  const getStatusColor = (statusCategoryKey?: string, statusName?: string) => {
    if (statusCategoryKey === 'done') return '#61bd4f';
    if (statusCategoryKey === 'inprogress') return '#4388cb';
    if (statusName?.toLowerCase().includes('block') || statusName?.toLowerCase().includes('停用')) return '#e25b4b';
    return '#f9c74f';
  };

  // 更新 renderContent 函數
  const renderContent = () => {
    if (isLoading && !data) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <LoadingIcon />
          <p className="mt-3 text-gray-600 dark:text-gray-300">載入資料中...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center text-red-500">
          <ErrorIcon />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">載入失敗</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">無法連線至 Jira 或取得資料。請檢查連線設定或重試。</p>
        </div>
      );
    }

    if (!data || !data.issues || data.issues.length === 0 || !currentPageDetails) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400">
          <EmptyIcon />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">找不到相關問題</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">目前沒有返回任何結果。</p>
        </div>
      );
    }
    
    // 根據頁面類型渲染不同視圖
    if (currentPageDetails.type === 'gantt') {
      return renderGanttChart();
    }
    
    // 原有的問題列表視圖
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
      {currentPageDetails && (
        <div>
          <h1 className="content-title flex items-center">
            {currentPageDetails.title}
            <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {currentPageDetails.type === 'epic' ? 'Epic' : 
               currentPageDetails.type === 'gantt' ? '甘特圖' : 'Issue'}
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
      )}
      {currentPageDetails && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{currentPageDetails.title}</h2>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {currentPageDetails.type === 'epic' ? 'Epic' : 
                  currentPageDetails.type === 'gantt' ? '甘特圖' : 'Issue'}
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

// 主要 dashboard 頁面組件
export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="text-center py-10"><LoadingIcon /><p className="mt-3">載入中...</p></div>}>
        <DashboardContent />
      </Suspense>
    </ErrorBoundary>
  );
} 