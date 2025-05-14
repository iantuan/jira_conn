'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { currentPageIdAtom, jiraPagesApiAtom, jiraPageGroupsApiAtom } from '@/store/jiraStore';
import { useJiraPageConfigs, useJiraPageGroups } from '@/hooks/useConfig';
import { useEffect, useState } from 'react';
import { JiraPageConfig } from '@/generated/prisma';

// Placeholder icons (replace with actual SVG components or a library like Heroicons)
const DashboardIcon = () => <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const SettingsIcon = () => <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const PageIcon = () => <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" /><path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>;
const GroupIcon = () => <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>;
const CollapseIcon = () => <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const ExpandIcon = () => <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;

export function Navigation() {
  const pathname = usePathname();
  const [currentPageId, setCurrentPageId] = useAtom(currentPageIdAtom);
  
  // Use SWR hooks to fetch page configurations and groups
  const { pages: jiraApiPages, isLoadingPages, isErrorPages } = useJiraPageConfigs();
  const { groups: jiraApiGroups, isLoading: isLoadingGroups, isError: isErrorGroups } = useJiraPageGroups();
  
  const [_, setJiraPagesApiAtom] = useAtom(jiraPagesApiAtom);
  const [__, setJiraPageGroupsApiAtom] = useAtom(jiraPageGroupsApiAtom);
  
  // State to track expanded/collapsed groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Sync SWR data to Jotai atoms
  useEffect(() => {
    if (jiraApiPages) {
      setJiraPagesApiAtom(jiraApiPages);
    }
  }, [jiraApiPages, setJiraPagesApiAtom]);
  
  useEffect(() => {
    if (jiraApiGroups) {
      setJiraPageGroupsApiAtom(jiraApiGroups);
      
      // Initialize all groups as expanded by default
      const initialExpandState: Record<string, boolean> = {};
      jiraApiGroups.forEach(group => {
        initialExpandState[group.id] = true;
      });
      setExpandedGroups(prev => ({...prev, ...initialExpandState}));
    }
  }, [jiraApiGroups, setJiraPageGroupsApiAtom]);

  const handlePageLinkClick = (pageId: string) => {
    setCurrentPageId(pageId);
  };
  
  const toggleGroupExpand = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };
  
  // Organize pages by their groups
  const ungroupedPages = jiraApiPages?.filter(page => !page.groupId) || [];
  const groupedPagesMap: Record<string, JiraPageConfig[]> = {};
  
  jiraApiPages?.forEach(page => {
    if (page.groupId) {
      if (!groupedPagesMap[page.groupId]) {
        groupedPagesMap[page.groupId] = [];
      }
      groupedPagesMap[page.groupId].push(page);
    }
  });
  
  return (
    <nav className="sidebar-menu">
      <Link href="/" className={`sidebar-item ${pathname === '/' ? 'active' : ''}`}>
        <DashboardIcon />
        <span>儀表板</span>
      </Link>
      <Link href="/config" className={`sidebar-item ${pathname === '/config' ? 'active' : ''}`}>
        <SettingsIcon />
        <span>系統設定</span>
      </Link>
      
      {(isLoadingPages || isLoadingGroups) && (
        <div className="sidebar-section-title pt-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
        </div>
      )}

      {!isLoadingPages && !isErrorPages && jiraApiPages && jiraApiPages.length > 0 && (
        <div className="sidebar-section-title pt-3">
          自訂查詢
        </div>
      )}
      
      {/* Render groups with their pages */}
      {!isLoadingGroups && !isErrorGroups && jiraApiGroups?.map(group => (
        <div key={group.id} className="mb-2">
          <button 
            className="sidebar-group-header flex items-center justify-between w-full px-3 py-1.5 text-sm font-medium text-left text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            onClick={() => toggleGroupExpand(group.id)}
          >
            <div className="flex items-center">
              <GroupIcon />
              <span>{group.name}</span>
            </div>
            <span className="text-gray-500">
              {expandedGroups[group.id] ? <CollapseIcon /> : <ExpandIcon />}
            </span>
          </button>
          
          {expandedGroups[group.id] && groupedPagesMap[group.id]?.map(page => (
            <Link 
              key={page.id}
              href={`/dashboard?pageId=${page.id}`}
              className={`sidebar-item sidebar-item-child ${currentPageId === page.id ? 'active' : ''}`}
              onClick={() => handlePageLinkClick(page.id)}
            >
              <PageIcon />
              <span className="truncate" title={page.title}>{page.title}</span>
              <span className="ml-1 text-xs opacity-60">
                {page.type === 'epic' ? 'Epic' : 'Issue'}
              </span>
            </Link>
          ))}
          
          {expandedGroups[group.id] && (!groupedPagesMap[group.id] || groupedPagesMap[group.id].length === 0) && (
            <div className="pl-8 pr-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 italic">
              無頁面
            </div>
          )}
        </div>
      ))}
      
      {/* Render ungrouped pages */}
      {!isLoadingPages && !isErrorPages && ungroupedPages.map(page => (
        <Link 
          key={page.id}
          href={`/dashboard?pageId=${page.id}`}
          className={`sidebar-item ${currentPageId === page.id ? 'active' : ''}`}
          onClick={() => handlePageLinkClick(page.id)}
        >
          <PageIcon />
          <span className="truncate" title={page.title}>{page.title}</span>
          <span className="ml-1 text-xs opacity-60">
            {page.type === 'epic' ? 'Epic' : 'Issue'}
          </span>
        </Link>
      ))}

      {isErrorPages && (
         <div className="sidebar-section-title pt-3 text-accent-color">
          無法載入頁面
        </div>
      )}
    </nav>
  );
} 