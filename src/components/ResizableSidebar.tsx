'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navigation } from './Navigation';

// 默認側邊欄寬度
const DEFAULT_SIDEBAR_WIDTH = 240;
const SIDEBAR_WIDTH_KEY = 'sidebar-width';

export default function ResizableSidebar() {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  // 初始化側邊欄寬度
  useEffect(() => {
    const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    if (savedWidth) {
      const parsedWidth = parseInt(savedWidth);
      setSidebarWidth(parsedWidth);
    }
  }, []);

  // 處理調整大小
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startWidth = sidebarWidth;
    let newWidth = startWidth;
    
    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      newWidth = Math.max(180, Math.min(500, startWidth + delta));
      setSidebarWidth(newWidth);
      
      if (sidebarRef.current) {
        sidebarRef.current.style.width = `${newWidth}px`;
      }
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // 保存寬度設置
      localStorage.setItem(SIDEBAR_WIDTH_KEY, newWidth.toString());
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <aside 
      className={`app-sidebar ${isResizing ? 'resizing' : ''}`}
      ref={sidebarRef}
      style={{ width: `${sidebarWidth}px` }}
    >
      <div className="flex-grow overflow-y-auto overflow-x-hidden">
        <Navigation />
      </div>
      <div 
        className={`app-sidebar-resizer ${isResizing ? 'resizing' : ''}`} 
        onMouseDown={handleMouseDown}
      ></div>
    </aside>
  );
} 