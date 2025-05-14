'use client';

import { useEffect, useState } from 'react';
import { useJiraIssue } from '@/hooks/useJira';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { useParams } from 'next/navigation';

// 定義可排序的欄位
type SortField = 'created' | 'updated' | 'priority' | 'status' | 'summary';
type SortOrder = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

const ErrorIcon = () => <svg className="w-12 h-12 text-accent-color mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
const EmptyIcon = () => <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;

export default function IssuePage() {
  const params = useParams();
  const key = params.key as string;
  
  const { data: issue, error, isLoading } = useJiraIssue(key);
  const [isFullDescriptionShown, setIsFullDescriptionShown] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'updated', order: 'desc' });
  
  useEffect(() => {
    if (issue) {
      console.log("IssuePage: Raw issue data received:", JSON.stringify(issue, null, 2));
    }
    if (error) {
      console.error("IssuePage: Error loading issue:", JSON.stringify(error, null, 2));
    }
  }, [issue, error]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try { return format(new Date(dateString), 'PPP'); } catch (e) { return dateString; }
  };
  
  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    try { return formatDistanceToNow(new Date(dateString), { addSuffix: true }); } catch (e) { return ''; }
  };
  
  const formatPriority = () => {
    if (!issue || !issue.fields || !issue.fields.priority) return null;
    if (typeof issue.fields.priority === 'object' && issue.fields.priority.name) {
      return issue.fields.priority.name;
    }
    return String(issue.fields.priority);
  };
  
  const getStatusClass = (statusName?: string) => {
    if (!statusName) return 'bg-gray-100 text-gray-800';
    const statusLower = statusName.toLowerCase();
    if (statusLower.includes('to do') || statusLower.includes('open') || statusLower.includes('new')) return 'status-todo';
    if (statusLower.includes('progress') || statusLower.includes('review')) return 'status-inprogress';
    if (statusLower.includes('done') || statusLower.includes('closed') || statusLower.includes('resolved')) return 'status-done';
    if (statusLower.includes('block') || statusLower.includes('impediment')) return 'status-blocked';
    return 'bg-gray-100 text-gray-800';
  };
  
  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.order === 'asc' ? '↑' : '↓';
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortComments = (comments: any[]) => {
    return [...comments].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      
      if (sortConfig.field === 'created' || sortConfig.field === 'updated') {
        const aDate = new Date(aValue || a.created).getTime();
        const bDate = new Date(bValue || b.created).getTime();
        return sortConfig.order === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.order === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  };

  if (isLoading && !issue) { 
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading issue data for {key}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <div className="jira-card bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-6 rounded-lg text-center">
          <ErrorIcon />
          <p className="font-semibold text-lg">Error Loading Issue</p>
          <p className="text-sm mt-1 mb-3">{error.message || "An unknown error occurred while fetching the issue."}</p>
          <Link href="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (!issue || !issue.fields) { 
    return (
       <div className="px-4 py-8">
        <div className="jira-card bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 p-6 rounded-lg text-center">
          <EmptyIcon />
          <p className="text-lg font-medium">Issue Data Incomplete or Not Found</p>
          <p className="mt-2 text-sm">The issue with key <strong>{key}</strong> could not be found, or its data is incomplete. You may not have permission to view it, or it might not exist.</p>
          <div className="mt-4">
            <Link href="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const { fields, renderedFields } = issue;
  
  const sortedComments = fields.comment?.comments 
    ? sortComments(fields.comment.comments)
    : [];

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="py-4 px-4 mb-4 border-b flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Link href="/dashboard" className="text-primary-color hover:underline mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          </Link>
          Issue Details {key && <span className="font-mono text-xl ml-2 text-gray-500 dark:text-gray-400">({key})</span>}
        </h1>
        <button onClick={() => setShowDebug(!showDebug)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Toggle Debug Info">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
        </button>
      </div>
      
      <div className="px-4 mb-8">
        {showDebug && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg overflow-auto max-h-96 jira-card">
            <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-200">Debug Info - Issue Details</h3>
            <pre className="text-xs bg-gray-50 dark:bg-gray-700 p-3 rounded-md ">{JSON.stringify(issue, null, 2)}</pre>
          </div>
        )}
        
        <div className="bg-card-bg rounded-lg jira-card overflow-hidden">
          {/* Issue Header */}
          <div className="p-6 border-b bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center mb-2 text-sm">
              {fields.project && (
                <Link href="/dashboard" className="text-primary-color hover:underline mr-2">{fields.project.name}</Link>
              )}
              {fields.project && <span className="text-gray-400 mx-1">/</span>}
              <div className="font-mono text-gray-600 dark:text-gray-300">{issue.key}</div>
            </div>
            
            <div className="flex items-center">
              {fields.issuetype && <img src={fields.issuetype.iconUrl} alt={fields.issuetype.name} className="w-5 h-5 mr-2" />}
              <h1 className="text-2xl font-bold">{fields.summary}</h1>
              
              <div className="ml-auto">
                <span className={`status-badge ${getStatusClass(fields.status?.name)}`}>
                  {fields.status?.name || 'Unknown Status'}
                </span>
              </div>
            </div>
            
            {fields.issuetype && fields.issuetype.name && (
              <div className="mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {fields.issuetype.name === 'Epic' ? 'Epic' : 'Issue'}
                </span>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-8">
              {/* Left Column - Details */}
              <div className="md:col-span-3 space-y-6">
                {/* Description */}
                <div className="jira-card p-4">
                  <h2 className="text-xl font-semibold mb-3 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>Description</h2>
                  {fields.description && (
                    <div className="prose dark:prose-invert max-w-none">
                      <div className={`${!isFullDescriptionShown && fields.description.length > 500 ? 'max-h-64 overflow-hidden' : ''}`} dangerouslySetInnerHTML={{ __html: renderedFields?.description || fields.description }} />
                      {fields.description.length > 500 && (
                        <button onClick={() => setIsFullDescriptionShown(!isFullDescriptionShown)} className="text-blue-600 hover:underline mt-2 flex items-center">
                          {isFullDescriptionShown ? (<><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>收起</>) : (<><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>展開</>)}
                        </button>
                      )}
                    </div>
                  )}
                  {!fields.description && <p className="text-gray-500 italic jira-card p-4">No description provided.</p>}
                </div>
                
                {/* Comments */}
                <div className="jira-card p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                      Comments {fields.comment && fields.comment.total ? `(${fields.comment.total})` : (sortedComments.length > 0 ? `(${sortedComments.length})` : '(0)')}
                    </h2>
                  </div>
                  
                  {fields.comment && fields.comment.comments && fields.comment.comments.length > 0 && (
                    <div className="space-y-4">
                      {sortedComments.map((comment: any) => (
                        <div key={comment.id} className="p-3 border rounded-md bg-gray-50 dark:bg-gray-700/50">
                          <div className="flex justify-between items-start mb-1.5">
                            <div className="flex items-center">
                              {comment.author?.avatarUrls?.['24x24'] && <img src={comment.author.avatarUrls['24x24']} alt={comment.author.displayName} className="w-6 h-6 rounded-full mr-2" />}
                              <div className="font-medium text-sm">{comment.author?.displayName || 'Unknown User'}</div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(comment.updated || comment.created)}
                            </div>
                          </div>
                          <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: comment.body }} />
                        </div>
                      ))}
                    </div>
                  )}
                  {fields.comment && fields.comment.comments && fields.comment.comments.length === 0 && <p className="text-gray-500 italic jira-card p-4">No comments yet</p>}
                </div>
              </div>
              
              {/* Right Column - Metadata */}
              <div className="md:col-span-1 space-y-6">
                <div className="jira-card p-4">
                  <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">People</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start"><span className="text-gray-500 dark:text-gray-400 w-20 shrink-0">Assignee:</span>{fields.assignee ? <div className="flex items-center"><img src={fields.assignee.avatarUrls?.['24x24']} alt="" className="w-5 h-5 rounded-full mr-1.5" /><span>{fields.assignee.displayName}</span></div> : <span className="text-gray-400 italic">Unassigned</span>}</div>
                    <div className="flex items-start"><span className="text-gray-500 dark:text-gray-400 w-20 shrink-0">Reporter:</span>{fields.reporter ? <div className="flex items-center"><img src={fields.reporter.avatarUrls?.['24x24']} alt="" className="w-5 h-5 rounded-full mr-1.5" /><span>{fields.reporter.displayName}</span></div> : '-'}</div>
                  </div>
                </div>
                <div className="jira-card p-4">
                  <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Dates</h2>
                  <div className="space-y-3 text-sm">
                    <div><div className="text-xs text-gray-500 dark:text-gray-400">Created:</div><div>{formatDate(fields.created)} <span className="text-gray-400">({formatTimeAgo(fields.created)})</span></div></div>
                    <div><div className="text-xs text-gray-500 dark:text-gray-400">Updated:</div><div>{formatDate(fields.updated)} <span className="text-gray-400">({formatTimeAgo(fields.updated)})</span></div></div>
                  </div>
                </div>
                <div className="jira-card p-4">
                  <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Details</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start"><span className="text-gray-500 dark:text-gray-400 w-20 shrink-0">Type:</span><div className="flex items-center">{fields.issuetype && <img src={fields.issuetype.iconUrl} alt="" className="w-4 h-4 mr-1.5" />}<span>{fields.issuetype?.name || '-'}</span></div></div>
                    <div className="flex items-start"><span className="text-gray-500 dark:text-gray-400 w-20 shrink-0">Priority:</span><span>{formatPriority() || '-'}</span></div>
                    <div className="flex items-start"><span className="text-gray-500 dark:text-gray-400 w-20 shrink-0">Project:</span><span>{fields.project?.name || '-'}</span></div>
                    {fields.labels && fields.labels.length > 0 && 
                      <div className="flex items-start"><span className="text-gray-500 dark:text-gray-400 w-20 shrink-0">Labels:</span><div className="flex flex-wrap gap-1">{fields.labels.map((label: string) => (<span key={label} className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">{label}</span>))}</div></div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 