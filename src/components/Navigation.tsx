'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { currentPageIdAtom, jiraPagesApiAtom } from '@/store/jiraStore';
import { useJiraPageConfigs } from '@/hooks/useConfig';
import { useEffect } from 'react';

// Placeholder icons (replace with actual SVG components or a library like Heroicons)
const DashboardIcon = () => <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const SettingsIcon = () => <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const PageIcon = () => <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" /><path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>;

export function Navigation() {
  const pathname = usePathname();
  const [currentPageId, setCurrentPageId] = useAtom(currentPageIdAtom);
  
  // Use SWR hook to fetch page configurations
  const { pages: jiraApiPages, isLoadingPages, isErrorPages } = useJiraPageConfigs();
  const [_, setJiraPagesApiAtom] = useAtom(jiraPagesApiAtom); // To sync with global atom if needed

  // Sync SWR data to Jotai atom (optional, depending on how other components access this data)
  useEffect(() => {
    if (jiraApiPages) {
      setJiraPagesApiAtom(jiraApiPages);
    }
  }, [jiraApiPages, setJiraPagesApiAtom]);

  const handlePageLinkClick = (pageId: string) => {
    setCurrentPageId(pageId);
    // Potentially reset dashboard-specific states like pagination, filters here
  };
  
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
      
      {isLoadingPages && (
        <div className="sidebar-section-title pt-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
        </div>
      )}

      {!isLoadingPages && !isErrorPages && jiraApiPages && jiraApiPages.length > 0 && (
        <div className="sidebar-section-title pt-3">
          自訂查詢
        </div>
      )}
      
      {!isLoadingPages && !isErrorPages && jiraApiPages?.map(page => (
        <Link 
          key={page.id}
          href={`/dashboard?pageId=${page.id}`}
          className={`sidebar-item ${currentPageId === page.id ? 'active' : ''}`}
          onClick={() => handlePageLinkClick(page.id)}
        >
          <PageIcon />
          <span className="truncate" title={page.title}>{page.title}</span>
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