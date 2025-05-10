'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { jiraConfigAtom } from '@/store/jiraStore';
import { useTestJiraConnection } from '@/hooks/useJira';
import Link from 'next/link';
import { JiraPage } from '@/types/jira';
import { v4 as uuidv4 } from 'uuid';
import JQLHelp from './jql-help';

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
    setConfig(prev => ({
      ...prev,
      pages: prev.pages.filter(p => p.id !== id)
    }));
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
    setShowJQLHelp(true); // 自動顯示 JQL 幫助
  };

  // Edit existing page
  const handleEditPage = (page: JiraPage) => {
    setEditingPage({ ...page });
    setIsAddingPage(false);
  };

  // Apply JQL example
  const applyJQLExample = (jql: string) => {
    if (editingPage) {
      setEditingPage({...editingPage, jql});
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Configuration</h1>
        <Link 
          href="/" 
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
        >
          Back to Home
        </Link>
      </div>

      {/* Jira Connection Settings */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Jira Connection</h2>
        
        <form onSubmit={handleConnectionSubmit} className="space-y-4">
          <div>
            <label htmlFor="baseUrl" className="block mb-1 font-medium">
              Jira Base URL
            </label>
            <input
              type="url"
              id="baseUrl"
              value={config.baseUrl}
              onChange={(e) => updateConnection('baseUrl', e.target.value)}
              placeholder="https://your-domain.atlassian.net"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <p className="text-sm text-gray-500 mt-1">
              請確保 URL 格式為 <code>https://your-domain.atlassian.net</code>（不要在結尾添加斜杠）
            </p>
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={config.email}
              onChange={(e) => updateConnection('email', e.target.value)}
              placeholder="your.email@example.com"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label htmlFor="apiToken" className="block mb-1 font-medium">
              API Token
            </label>
            <div className="flex">
              <input
                type={showApiToken ? "text" : "password"}
                id="apiToken"
                value={config.apiToken}
                onChange={(e) => updateConnection('apiToken', e.target.value)}
                placeholder="Your Jira API token"
                className="w-full p-2 border rounded-l dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowApiToken(!showApiToken)}
                className="bg-gray-200 px-3 border border-l-0 rounded-r"
              >
                {showApiToken ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              <a 
                href="https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                How to create an API token
              </a>
            </p>
          </div>
          
          <div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
            
            {connectionTest && (
              <div className={`mt-2 p-2 rounded ${connectionTest.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {connectionTest.success 
                  ? `Connected successfully as ${connectionTest.user?.displayName}`
                  : `Connection failed: ${connectionTest.error}`
                }
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Pages Configuration */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Dashboard Pages</h2>
          <button
            onClick={handleAddPage}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
          >
            Add Page
          </button>
        </div>
        
        {/* Pages List */}
        {config.pages.length === 0 ? (
          <p className="text-gray-500 italic">No pages configured. Add your first page to get started.</p>
        ) : (
          <div className="space-y-4">
            {config.pages.map((page) => (
              <div key={page.id} className="border rounded p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{page.title}</h3>
                  {page.description && <p className="text-sm text-gray-500">{page.description}</p>}
                  <p className="text-xs font-mono bg-gray-100 dark:bg-gray-700 p-1 mt-1 rounded">{page.jql}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPage(page)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePage(page.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Page Edit Modal */}
        {editingPage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">
                {isAddingPage ? 'Add New Page' : 'Edit Page'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block mb-1 font-medium">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block mb-1 font-medium">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={editingPage.description || ''}
                    onChange={(e) => setEditingPage({...editingPage, description: e.target.value})}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="jql" className="block font-medium">
                      JQL Query
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowJQLHelp(!showJQLHelp)}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                    >
                      {showJQLHelp ? 'Hide Examples' : 'Show Examples'}
                    </button>
                  </div>
                  <textarea
                    id="jql"
                    value={editingPage.jql}
                    onChange={(e) => setEditingPage({...editingPage, jql: e.target.value})}
                    rows={3}
                    className="w-full p-2 border rounded font-mono text-sm dark:bg-gray-700 dark:border-gray-600"
                    placeholder='project = "MyProject" AND status = "In Progress"'
                  />
                  {showJQLHelp && <JQLHelp />}
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={() => {
                      setEditingPage(null);
                      setIsAddingPage(false);
                      setShowJQLHelp(false);
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => savePage(editingPage)}
                    disabled={!editingPage.title || !editingPage.jql}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Link to Dashboard */}
      {config.pages.length > 0 && (
        <div className="mt-8 text-center">
          <Link 
            href="/dashboard" 
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg text-lg"
          >
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
} 