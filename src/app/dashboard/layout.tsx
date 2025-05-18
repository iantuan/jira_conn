'use client';

import { useNavVisible } from '@/hooks/useLocalStorage';
import { SidebarCollapseIcon, SidebarExpandIcon } from '@/components/Icons';

// Shared styles for dashboard pages, could be moved to a global stylesheet if preferred
import './dashboard-styles.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [navVisible, setNavVisible] = useNavVisible();

  return (
    <div className="dashboard-layout">
      <style jsx global>{`
        /* Gantt Chart Styles */
        .gantt-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          overflow: auto;
        }

        .gantt-header {
          display: flex;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .gantt-header-left {
          flex-shrink: 0;
        }

        .gantt-header-right {
          flex-grow: 1;
        }

        .gantt-body {
          display: flex;
          flex-direction: column;
        }

        .gantt-row {
          height: 40px;
        }

        .gantt-bar {
          background-color: #2563eb;
          z-index: 5;
        }
      `}</style>
      
      <div className="flex items-center p-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 bg-gray-100 dark:bg-gray-900">
        <button 
          onClick={() => setNavVisible(!navVisible)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
          aria-label={navVisible ? "隱藏側邊欄" : "顯示側邊欄"}
        >
          {navVisible ? <SidebarCollapseIcon /> : <SidebarExpandIcon />}
        </button>
      </div>
      <div className="dashboard-content p-4 md:p-6 overflow-auto">
        {children}
      </div>
    </div>
  );
} 