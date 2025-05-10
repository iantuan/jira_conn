'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { jiraConfigAtom } from '@/store/jiraStore';
import { useTestJiraConnection } from '@/hooks/useJira';
import Link from 'next/link';
import { JiraPage } from '@/types/jira';
import { v4 as uuidv4 } from 'uuid';
import JQLHelp from './jql-help';

// Placeholder icons
const ConnectIcon = () => <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 2.586a2 2 0 00-2.828 0L6.172 6.172a4 4 0 00-1.172 2.828V14a2 2 0 002 2h5a2 2 0 002-2V9a4 4 0 00-1.172-2.828L12.586 2.586zM9 12a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;

export default function ConfigPage() {
  const [config, setConfig] = useAtom(jiraConfigAtom);
  const [showApiToken, setShowApiToken] = useState(false);
  const [editingPage, setEditingPage] = useState<JiraPage | null>(null);
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [showJQLHelp, setShowJQLHelp] = useState(false);
  
  const { data: connectionTest, isLoading, mutate: testConnection } = useTestJiraConnection();

  // Handle connection form submission
  const handleConnectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    testConnection();
  };

  // Update connection settings
  const updateConnection = (field: 'baseUrl' | 'email' | 'apiToken', value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  // Add or update a page
  const savePage = (page: JiraPage) => {
    if (isAddingPage) {
      // Add new page with UUID
      const newPage = { ...page, id: uuidv4() };
      setConfig(prev => ({
        ...prev,
        pages: [...prev.pages, newPage]
      }));
      setIsAddingPage(false);
    } else if (editingPage) {
      // Update existing page
      setConfig(prev => ({
        ...prev,
        pages: prev.pages.map(p => p.id === page.id ? page : p)
      }));
    }
    setEditingPage(null);
    setShowJQLHelp(false);
  };

  // Delete a page
  const deletePage = (id: string) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      setConfig(prev => ({
        ...prev,
        pages: prev.pages.filter(p => p.id !== id)
      }));
    }
  };

  // Initialize new page form
  const handleAddPage = () => {
    setEditingPage({
      id: '',
      title: '',
      description: '',
      jql: '',
      columns: [],
      sortBy: '',
      sortOrder: 'DESC'
    });
    setIsAddingPage(true);
    setShowJQLHelp(false);
  };

  // Edit existing page
  const handleEditPage = (page: JiraPage) => {
    setEditingPage({ ...page });
    setIsAddingPage(false);
    setShowJQLHelp(false);
  };

  // Apply JQL example
  const applyJQLExample = (jql: string) => {
    if (editingPage) {
      setEditingPage({...editingPage, jql});
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="content-title">系統設定</h1>
      <p className="content-description">管理您的 Jira 連線設定並客製化您的儀表板查詢頁面。</p>

      {/* Jira Connection Settings */}
      <section className="jira-card">
        <div className="p-5 border-b border-card-border">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Jira 連線設定</h2>
        </div>
        <form onSubmit={handleConnectionSubmit} className="p-5 space-y-5">
          <div>
            <label htmlFor="baseUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jira 基礎 URL
            </label>
            <input
              type="url"
              id="baseUrl"
              value={config.baseUrl}
              onChange={(e) => updateConnection('baseUrl', e.target.value)}
              placeholder="https://your-domain.atlassian.net"
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-color focus:border-primary-color dark:bg-gray-700 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              請確保 URL 格式為 <code>https://your-domain.atlassian.net</code>（不要在結尾添加斜杠）。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                電子郵件地址
              </label>
              <input
                type="email"
                id="email"
                value={config.email}
                onChange={(e) => updateConnection('email', e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-color focus:border-primary-color dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="apiToken" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Token
              </label>
              <div className="flex">
                <input
                  type={showApiToken ? "text" : "password"}
                  id="apiToken"
                  value={config.apiToken}
                  onChange={(e) => updateConnection('apiToken', e.target.value)}
                  placeholder="您的 Jira API Token"
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:ring-primary-color focus:border-primary-color dark:bg-gray-700 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowApiToken(!showApiToken)}
                  className="px-3 py-2.5 bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  {showApiToken ? '隱藏' : '顯示'}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                <a 
                  href="https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-color hover:underline"
                >
                  如何建立 API Token
                </a>
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              <ConnectIcon />
              {isLoading ? '測試中...' : '測試並儲存連線'}
            </button>
            {connectionTest && (
              <div className={`text-sm p-2 rounded-md ${connectionTest.success ? 'bg-secondary-light text-secondary-dark' : 'bg-red-100 text-red-700'}`}>
                {connectionTest.success 
                  ? `連線成功！ (${connectionTest.user?.displayName})`
                  : `連線失敗: ${connectionTest.error}`
                }
              </div>
            )}
          </div>
        </form>
      </section>

      {/* Pages Configuration */}
      <section className="jira-card">
        <div className="p-5 border-b border-card-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">查詢頁面設定</h2>
          <button
            onClick={handleAddPage}
            className="btn btn-secondary"
          >
            <PlusIcon />
            新增頁面
          </button>
        </div>
        
        <div className="p-5">
          {config.pages.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic py-4 text-center">尚未設定任何查詢頁面。點擊「新增頁面」開始。</p>
          ) : (
            <div className="space-y-4">
              {config.pages.map((page) => (
                <div key={page.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{page.title}</h3>
                    {page.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{page.description}</p>}
                    <p className="text-xs font-mono bg-gray-100 dark:bg-gray-700 p-1.5 mt-1.5 rounded-md inline-block break-all">{page.jql}</p>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleEditPage(page)}
                      className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 text-primary-color"
                      aria-label="Edit page"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => deletePage(page.id)}
                      className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-accent-color"
                      aria-label="Delete page"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
          
      {/* Page Edit Modal */}      
      {editingPage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-card-bg p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col jira-card">
            <h3 className="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-100">
              {isAddingPage ? '新增查詢頁面' : '編輯查詢頁面'}
            </h3>
            
            <div className="space-y-5 overflow-y-auto pr-2 flex-grow">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  標題
                </label>
                <input
                  type="text"
                  id="title"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-color focus:border-primary-color dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  描述 (選填)
                </label>
                <input
                  type="text"
                  id="description"
                  value={editingPage.description || ''}
                  onChange={(e) => setEditingPage({...editingPage, description: e.target.value})}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-color focus:border-primary-color dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="jql" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    JQL 查詢語句
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowJQLHelp(!showJQLHelp)}
                    className="text-xs btn btn-ghost py-1 px-2"
                  >
                    {showJQLHelp ? '隱藏範例' : '顯示範例'}
                  </button>
                </div>
                <textarea
                  id="jql"
                  value={editingPage.jql}
                  onChange={(e) => setEditingPage({...editingPage, jql: e.target.value})}
                  rows={4}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-sm shadow-sm focus:ring-primary-color focus:border-primary-color dark:bg-gray-700 dark:text-gray-100"
                  placeholder='project = "MyProject" AND status = "In Progress" ORDER BY created DESC'
                />
                {showJQLHelp && <div className="mt-2"><JQLHelp /></div>}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-5 mt-auto border-t border-card-border">
              <button
                type="button"
                onClick={() => { setEditingPage(null); setIsAddingPage(false); setShowJQLHelp(false); }}
                className="btn btn-ghost"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => savePage(editingPage)}
                disabled={!editingPage.title || !editingPage.jql}
                className="btn btn-primary"
              >
                儲存頁面
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 