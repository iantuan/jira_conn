'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAtom } from 'jotai';
import { jiraConfigAtom, jiraConnectionApiAtom, jiraPagesApiAtom } from '@/store/jiraStore';
import { useJiraConnectionSettings, useJiraPageConfigs, JiraConnectionClientResponse } from '@/hooks/useConfig';
import { useTestJiraConnection } from '@/hooks/useJira';
import Link from 'next/link';
import { JiraPage } from '@/types/jira';
import { JiraPageConfig } from '@/generated/prisma';
import { v4 as uuidv4 } from 'uuid';
import JQLHelp from './jql-help';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Placeholder icons
const ConnectIcon = () => <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 2.586a2 2 0 00-2.828 0L6.172 6.172a4 4 0 00-1.172 2.828V14a2 2 0 002 2h5a2 2 0 002-2V9a4 4 0 00-1.172-2.828L12.586 2.586zM9 12a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const LockIcon = () => <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>;

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"], // path of error
});

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

// Schema for Jira Connection Form
const JiraConnectionFormSchema = z.object({
  baseUrl: z.string().url("Invalid URL format").refine(val => val.startsWith("https://"), { message: "URL must start with https://" }).refine(val => !val.endsWith('/'), { message: "URL should not end with a slash"}),
  email: z.string().email("Invalid email address"),
  apiToken: z.string().min(1, "API Token is required"), // Validate presence, actual token not shown
});
type JiraConnectionFormValues = z.infer<typeof JiraConnectionFormSchema>;

// Schema for Page Config Form
const PageConfigFormSchema = z.object({
  id: z.string().optional(), // থাকবে যখন এডিট করা হবে
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  jql: z.string().min(1, "JQL query is required"),
  type: z.enum(['issue', 'epic']).default('issue'),
});
type PageConfigFormValues = z.infer<typeof PageConfigFormSchema>;

export default function ConfigPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // SWR hooks for data fetching
  const { settings: jiraApiSettings, isLoading: isLoadingConnection, mutateConnectionSettings, isError: connectionError } = useJiraConnectionSettings();
  const { pages: jiraApiPages, isLoadingPages, mutatePageConfigs, isErrorPages } = useJiraPageConfigs();

  // Jotai atoms to sync with API data for other components to use (transitional)
  const [_, setJiraConfigAtom] = useAtom(jiraConfigAtom); // Write-only for syncing
  const [__, setJiraConnectionApiAtom] = useAtom(jiraConnectionApiAtom);
  const [___, setJiraPagesApiAtom] = useAtom(jiraPagesApiAtom);

  // Local form states
  const [showApiToken, setShowApiToken] = useState(false);
  const [editingPage, setEditingPage] = useState<PageConfigFormValues | null>(null);
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [showJQLHelp, setShowJQLHelp] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { data: testConnectionResult, isLoading: isTestingConnection, mutate: testJiraApiConnection } = useTestJiraConnection(); // This hook might need to be adapted or its functionality integrated directly

  // React Hook Form for Jira Connection
  const {
    register: registerJiraConnection,
    handleSubmit: handleSubmitJiraConnection,
    reset: resetJiraConnectionForm,
    formState: { errors: jiraConnectionErrors, isSubmitting: isSubmittingJiraConnection },
    setValue: setJiraConnectionValue,
  } = useForm<JiraConnectionFormValues>({
    resolver: zodResolver(JiraConnectionFormSchema),
    defaultValues: { baseUrl: '', email: '', apiToken: '' }
  });

  // React Hook Form for Password Change
  const {
    register: registerPasswordChange,
    handleSubmit: handleSubmitPasswordChange,
    formState: { errors: passwordChangeErrors, isSubmitting: isSubmittingPasswordChange },
    reset: resetPasswordForm,
  } = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
  });
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // React Hook Form for Page Config Modal
  const {
    register: registerPageConfig,
    handleSubmit: handleSubmitPageConfig,
    reset: resetPageConfigForm,
    formState: { errors: pageConfigErrors, isSubmitting: isSubmittingPageConfig },
    setValue: setPageConfigValue,
    watch: watchPageConfig,
  } = useForm<PageConfigFormValues>({
    resolver: zodResolver(PageConfigFormSchema),
    defaultValues: {
      title: '',
      description: '',
      jql: '',
      type: 'issue'
    }
  });

  // Effect to populate forms and Jotai atoms when data loads from SWR
  useEffect(() => {
    if (jiraApiSettings) {
      resetJiraConnectionForm({
        baseUrl: jiraApiSettings.baseUrl || '',
        email: jiraApiSettings.email || '',
        apiToken: jiraApiSettings.hasApiToken ? '********' : '' // Mask token
      });
      setJiraConnectionApiAtom(jiraApiSettings);
      // Sync with the main jiraConfigAtom (transitional)
      setJiraConfigAtom(prev => ({ ...prev, baseUrl: jiraApiSettings.baseUrl || '', email: jiraApiSettings.email || '', apiToken: jiraApiSettings.hasApiToken ? 'TOKEN_SET' : '' }));
    }
  }, [jiraApiSettings, resetJiraConnectionForm, setJiraConnectionApiAtom, setJiraConfigAtom]);

  useEffect(() => {
    if (jiraApiPages) {
      setJiraPagesApiAtom(jiraApiPages);
      // Sync with the main jiraConfigAtom (transitional)
      const clientPages: JiraPage[] = jiraApiPages.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description || '',
        jql: p.jql,
        type: p.type as 'issue' | 'epic',
        columns: p.columns,
        sortBy: p.sortBy,
        sortOrder: p.sortOrder,
        ownerId: p.ownerId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }));
      setJiraConfigAtom(prev => ({ ...prev, pages: clientPages }));
    }
  }, [jiraApiPages, setJiraPagesApiAtom, setJiraConfigAtom]);

  // Auth redirection
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/config');
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') router.push('/');
  }, [session, status, router]);

  // Handler for Jira Connection Form Submit
  const onSaveJiraConnection: SubmitHandler<JiraConnectionFormValues> = async (data) => {
    if (session?.user?.role !== 'ADMIN') return;
    setGeneralError(null);
    try {
      const response = await fetch('/api/config/jira-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to save settings');
      mutateConnectionSettings(); // Revalidate SWR data
      alert('Jira connection settings saved!');
    } catch (error: any) {
      setGeneralError(error.message || 'Could not save Jira settings.');
    }
  };
  
  // Test Connection Handler (example, actual test logic is in useTestJiraConnection hook which might need adjustment)
  const handleTestConnection = async () => {
    if (session?.user?.role !== 'ADMIN') return;
    // This needs to use current form values or saved values for the test
    // The useTestJiraConnection hook likely uses the Jotai atom, which should be up-to-date if forms are synced.
    // Or, pass config directly to a modified testConnection function.
    const currentConfig = {
        baseUrl: jiraApiSettings?.baseUrl || '',
        email: jiraApiSettings?.email || '',
        apiToken: 'dummy-token-for-test-if-not-sending-real-one' // Test hook needs to handle this
    }
    // TODO: Adapt useTestJiraConnection or call a dedicated API route for testing
    // For now, just log or show a placeholder message
    console.log("Testing connection with:", currentConfig);
    alert("Connection test functionality needs to be integrated with API-based settings.");
    // testJiraApiConnection(); // This would use the Jotai atom state by default
  };

  // Handler for Password Change Form Submit
  const onChangePassword: SubmitHandler<PasswordChangeFormValues> = async (data) => {
    if (session?.user?.role !== 'ADMIN') return;
    setIsChangingPassword(true);
    setPasswordChangeMessage(null);
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to change password');
      setPasswordChangeMessage({ type: 'success', text: result.message || 'Password changed successfully!' });
      resetPasswordForm();
    } catch (error: any) {
      setPasswordChangeMessage({ type: 'error', text: error.message || 'An unknown error occurred.' });
    }
    setIsChangingPassword(false);
  };
  const [isChangingPassword, setIsChangingPassword] = useState(false); // ensure this is defined if used

  // Handlers for Page Config Modal
  const handleAddPageClick = () => {
    if (session?.user?.role !== 'ADMIN') return;
    setIsAddingPage(true);
    setEditingPage({ title: '', jql: '', description: '', type: 'issue' }); // Reset form for new page
    resetPageConfigForm({ title: '', jql: '', description: '', type: 'issue' });
    setShowJQLHelp(false);
  };

  const handleEditPageClick = (page: JiraPageConfig) => {
    if (session?.user?.role !== 'ADMIN') return;
    setIsAddingPage(false);
    setEditingPage({
      id: page.id,
      title: page.title,
      jql: page.jql,
      description: page.description || '',
      type: page.type as 'issue' | 'epic'
    });
    resetPageConfigForm({
      id: page.id,
      title: page.title,
      jql: page.jql,
      description: page.description || '',
      type: page.type as 'issue' | 'epic'
    });
    setShowJQLHelp(false);
  };

  const onSavePageConfig: SubmitHandler<PageConfigFormValues> = async (data) => {
    if (session?.user?.role !== 'ADMIN') return;
    setGeneralError(null);
    const url = isAddingPage ? '/api/config/pages' : `/api/config/pages/${editingPage?.id}`;
    const method = isAddingPage ? 'POST' : 'PUT';
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to save page');
      mutatePageConfigs(); // Revalidate SWR data for pages
      setEditingPage(null);
      setIsAddingPage(false);
      alert(isAddingPage ? 'Page added!' : 'Page updated!');
    } catch (error: any) {
      setGeneralError(error.message || 'Could not save page configuration.');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (session?.user?.role !== 'ADMIN') return;
    if (window.confirm("您確定要刪除此頁面嗎？")) {
      setGeneralError(null);
      try {
        const response = await fetch(`/api/config/pages/${pageId}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to delete page');
        mutatePageConfigs();
        alert('Page deleted!');
      } catch (error: any) {
        setGeneralError(error.message || 'Could not delete page.');
      }
    }
  };

  // Loading/Unauthorized states (already implemented in previous step)
  if (status === 'loading' || isLoadingConnection || isLoadingPages && !jiraApiSettings && !jiraApiPages) {
    return <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div><p className="mt-4 text-gray-600 dark:text-gray-300">正在載入設定...</p></div>;
  }
  if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'ADMIN')) {
    return <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-center p-6"><LockIcon /><h1 className="content-title text-xl mt-2">存取被拒絕</h1><p className="content-description max-w-md">您沒有權限訪問此頁面。請以管理員身份登入，或聯繫您的系統管理員。</p>{status === 'unauthenticated' && (<button onClick={() => router.push('/login?callbackUrl=/config')} className="btn btn-primary">前往登入</button>)}{status === 'authenticated' && session?.user?.role !== 'ADMIN' && (<Link href="/" className="btn btn-primary">返回首頁</Link>)}</div>;
  }
  
  // Main Admin Content
  return (
    <div className="space-y-8">
      <h1 className="content-title">系統設定</h1>
      <p className="content-description">管理您的 Jira 連線設定並客製化您的儀表板查詢頁面。</p>
      {generalError && <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm">{generalError}</div>}

      {/* Jira Connection Settings */}
      <section className="jira-card">
        <div className="p-5 border-b border-card-border">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Jira 連線設定</h2>
        </div>
        <form onSubmit={handleSubmitJiraConnection(onSaveJiraConnection)} className="p-5 space-y-5">
          <div>
            <label htmlFor="conn-baseUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jira 基礎 URL</label>
            <input id="conn-baseUrl" type="url" {...registerJiraConnection("baseUrl")} placeholder="https://your-domain.atlassian.net" className="w-full p-2.5 input-field" />
            {jiraConnectionErrors.baseUrl && <p className="form-error">{jiraConnectionErrors.baseUrl.message}</p>}
            <p className="input-hint">請確保 URL 格式為 <code>https://your-domain.atlassian.net</code>。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="conn-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">電子郵件地址</label>
              <input id="conn-email" type="email" {...registerJiraConnection("email")} placeholder="your.email@example.com" className="w-full p-2.5 input-field" />
              {jiraConnectionErrors.email && <p className="form-error">{jiraConnectionErrors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="conn-apiToken" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Token</label>
              <div className="flex">
                <input id="conn-apiToken" type={showApiToken ? "text" : "password"} {...registerJiraConnection("apiToken")} placeholder={jiraApiSettings?.hasApiToken ? 'Token已設定' : '您的 Jira API Token'} className="w-full p-2.5 input-field rounded-r-none" />
                <button type="button" onClick={() => setShowApiToken(!showApiToken)} className="px-3 py-2.5 bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500">{showApiToken ? '隱藏' : '顯示'}</button>
              </div>
              {jiraConnectionErrors.apiToken && <p className="form-error">{jiraConnectionErrors.apiToken.message}</p>}
              <p className="input-hint"><a href="https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/" target="_blank" rel="noopener noreferrer" className="text-primary-color hover:underline">如何建立 API Token</a></p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <button type="submit" className="btn btn-primary" disabled={isSubmittingJiraConnection}><ConnectIcon />{isSubmittingJiraConnection ? '儲存中...' : '儲存連線設定'}</button>
            {/* Test connection button can be added here if useTestJiraConnection is adapted for API values */}
             <button type="button" onClick={handleTestConnection} className="btn btn-ghost" disabled={isTestingConnection}>{isTestingConnection ? '測試中...' : '測試目前連線'}</button>
          </div>
           {testConnectionResult && (
              <div className={`text-sm p-2 rounded-md mt-2 ${testConnectionResult.success ? 'bg-secondary-light text-secondary-dark' : 'bg-red-100 text-red-700'}`}>
                測試結果: {testConnectionResult.success 
                  ? `成功 (${testConnectionResult.user?.displayName})`
                  : `失敗: ${testConnectionResult.error}`
                }
              </div>
            )}
        </form>
      </section>

      {/* Change Password Section ... (existing JSX, ensure it uses its own form state like isSubmittingPasswordChange) */}
      <section className="jira-card">
          <div className="p-5 border-b border-card-border">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">修改管理員密碼</h2>
          </div>
          <form onSubmit={handleSubmitPasswordChange(onChangePassword)} className="p-5 space-y-5">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">目前密碼</label>
              <input type="password" id="currentPassword" {...registerPasswordChange("currentPassword")} className="w-full p-2.5 input-field" />
              {passwordChangeErrors.currentPassword && <p className="form-error">{passwordChangeErrors.currentPassword.message}</p>}
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">新密碼</label>
              <input type="password" id="newPassword" {...registerPasswordChange("newPassword")} className="w-full p-2.5 input-field" />
              {passwordChangeErrors.newPassword && <p className="form-error">{passwordChangeErrors.newPassword.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">確認新密碼</label>
              <input type="password" id="confirmPassword" {...registerPasswordChange("confirmPassword")} className="w-full p-2.5 input-field" />
              {passwordChangeErrors.confirmPassword && <p className="form-error">{passwordChangeErrors.confirmPassword.message}</p>}
            </div>
            <div className="flex items-center justify-between pt-2">
              <button type="submit" className="btn btn-primary" disabled={isSubmittingPasswordChange || isChangingPassword}>{isSubmittingPasswordChange || isChangingPassword ? '儲存中...' : '更新密碼'}</button>
              {passwordChangeMessage && (
                <div className={`text-sm p-2 rounded-md ${passwordChangeMessage.type === 'success' ? 'bg-secondary-light text-secondary-dark' : 'bg-red-100 text-red-700'}`}>
                  {passwordChangeMessage.text}
                </div>
              )}
            </div>
          </form>
        </section>

      {/* Pages Configuration */}
      <section className="jira-card">
        <div className="p-5 border-b border-card-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">查詢頁面設定</h2>
          <button onClick={handleAddPageClick} className="btn btn-secondary"><PlusIcon />新增頁面</button>
        </div>
        <div className="p-5">
          {(!jiraApiPages || jiraApiPages.length === 0) && !isLoadingPages ? (
            <p className="text-gray-500 dark:text-gray-400 italic py-4 text-center">尚未設定任何查詢頁面。點擊「新增頁面」開始。</p>
          ) : isLoadingPages ? (
             <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-color mx-auto"></div><p className="mt-2 text-sm text-gray-500">載入頁面...</p></div>
          ) : (
            <div className="space-y-4">
              {jiraApiPages?.map((page) => (
                <div key={page.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{page.title}</h3>
                    {page.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{page.description}</p>}
                    <p className="text-xs font-mono bg-gray-100 dark:bg-gray-700 p-1.5 mt-1.5 rounded-md inline-block break-all">{page.jql}</p>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 mt-2 sm:mt-0">
                    <button onClick={() => handleEditPageClick(page)} className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 text-primary-color" aria-label="Edit page"><EditIcon /></button>
                    <button onClick={() => handleDeletePage(page.id)} className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-accent-color" aria-label="Delete page"><DeleteIcon /></button>
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
          <form onSubmit={handleSubmitPageConfig(onSavePageConfig)} className="bg-card-bg p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col jira-card">
            <h3 className="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-100">
              {isAddingPage ? '新增查詢頁面' : '編輯查詢頁面'}
            </h3>
            <div className="space-y-5 overflow-y-auto pr-2 flex-grow">
              <div>
                <label htmlFor="page-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">標題</label>
                <input id="page-title" type="text" {...registerPageConfig("title")} className="w-full p-2.5 input-field" />
                {pageConfigErrors.title && <p className="form-error">{pageConfigErrors.title.message}</p>}
              </div>
              <div>
                <label htmlFor="page-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">描述 (選填)</label>
                <input id="page-description" type="text" {...registerPageConfig("description")} className="w-full p-2.5 input-field" />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  頁面類型
                </label>
                <select
                  id="type"
                  {...registerPageConfig("type")}
                  className="form-select w-full"
                >
                  <option value="issue">一般問題列表</option>
                  <option value="epic">Epic 與子任務</option>
                </select>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {watchPageConfig("type") === 'epic' ? '選擇此類型將顯示 Epic 及其子任務，並支持展開/收起功能。' : '選擇此類型將顯示一般的問題列表。'}
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="page-jql" className="block text-sm font-medium text-gray-700 dark:text-gray-300">JQL 查詢語句</label>
                  <button type="button" onClick={() => setShowJQLHelp(!showJQLHelp)} className="text-xs btn btn-ghost py-1 px-2">{showJQLHelp ? '隱藏範例' : '顯示範例'}</button>
                </div>
                <textarea id="page-jql" {...registerPageConfig("jql")} rows={4} className="w-full p-2.5 input-field font-mono text-sm" placeholder='project = "MyProject" AND status = "In Progress" ORDER BY created DESC' />
                {pageConfigErrors.jql && <p className="form-error">{pageConfigErrors.jql.message}</p>}
                {showJQLHelp && <div className="mt-2"><JQLHelp /></div>} {/* JQLHelp might need styling updates */}
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-5 mt-auto border-t border-card-border">
              <button type="button" onClick={() => { setEditingPage(null); setIsAddingPage(false); setShowJQLHelp(false); }} className="btn btn-ghost">取消</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmittingPageConfig}>{isSubmittingPageConfig ? '儲存中...' : '儲存頁面'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 