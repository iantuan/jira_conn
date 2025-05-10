'use client';

import { useEffect, useState } from 'react';
import { useJiraIssue } from '@/hooks/useJira';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';

interface IssuePageProps {
  params: {
    key: string;
  };
}

export default function IssuePage({ params }: IssuePageProps) {
  const { key } = params;
  const { data: issue, error, isLoading } = useJiraIssue(key);
  const [isFullDescriptionShown, setIsFullDescriptionShown] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return format(date, 'PPP');
    } catch (e) {
      return dateString;
    }
  };
  
  // Format time ago
  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return '';
    }
  };
  
  // Render field with label
  const renderField = (label: string, value: React.ReactNode) => (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
      <div>{value || '-'}</div>
    </div>
  );
  
  // Format priority
  const formatPriority = () => {
    if (!issue?.fields.priority) return null;
    
    if (typeof issue.fields.priority === 'object' && issue.fields.priority.name) {
      return issue.fields.priority.name;
    }
    
    return String(issue.fields.priority);
  };
  
  // Get status badge class
  const getStatusClass = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('to do') || statusLower.includes('open') || statusLower.includes('new')) {
      return 'status-todo';
    } else if (statusLower.includes('progress') || statusLower.includes('review')) {
      return 'status-inprogress';
    } else if (statusLower.includes('done') || statusLower.includes('closed') || statusLower.includes('resolved')) {
      return 'status-done';
    } else if (statusLower.includes('block') || statusLower.includes('impediment')) {
      return 'status-blocked';
    }
    return 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="py-4 px-4 mb-4 border-b flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Link href="/dashboard" className="text-blue-600 hover:underline mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
          Issue Details
        </h1>
        
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
      </div>
      
      <div className="px-4 mb-8">
        {showDebug && issue && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg overflow-auto max-h-96 jira-card">
            <h3 className="font-medium mb-2">Debug Info - Issue Details</h3>
            <pre className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
              {JSON.stringify(issue, null, 2)}
            </pre>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">載入中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            <p className="font-semibold">載入錯誤</p>
            <p className="text-sm">{error.message}</p>
          </div>
        ) : issue ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg jira-card overflow-hidden">
            {/* Issue Header */}
            <div className="p-6 border-b bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center mb-2 text-sm">
                {issue.fields.project && (
                  <Link href="/dashboard" className="text-blue-600 hover:underline mr-2">
                    {issue.fields.project.name}
                  </Link>
                )}
                <span className="text-gray-400 mx-1">/</span>
                <div className="font-mono text-gray-600 dark:text-gray-300">{issue.key}</div>
              </div>
              
              <div className="flex items-center">
                {issue.fields.issuetype && (
                  <img 
                    src={issue.fields.issuetype.iconUrl} 
                    alt={issue.fields.issuetype.name} 
                    className="w-5 h-5 mr-2" 
                  />
                )}
                <h1 className="text-2xl font-bold">{issue.fields.summary}</h1>
                
                <div className="ml-auto">
                  <span className={`status-badge ${getStatusClass(issue.fields.status?.name || 'Unknown')}`}>
                    {issue.fields.status?.name || 'Unknown Status'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left Column - Details */}
                <div className="md:col-span-3 space-y-6">
                  {/* Description */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      Description
                    </h2>
                    {issue.fields.description ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <div 
                          className={`${!isFullDescriptionShown && 'max-h-64 overflow-hidden'}`}
                          dangerouslySetInnerHTML={{ 
                            __html: issue.renderedFields?.description || issue.fields.description 
                          }}
                        />
                        {issue.fields.description.length > 500 && (
                          <button
                            onClick={() => setIsFullDescriptionShown(!isFullDescriptionShown)}
                            className="text-blue-600 hover:underline mt-2 flex items-center"
                          >
                            {isFullDescriptionShown ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                收起
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                展開
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No description provided</p>
                    )}
                  </div>
                  
                  {/* Comments */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                      Comments
                    </h2>
                    {issue.fields.comment && issue.fields.comment.comments && issue.fields.comment.comments.length > 0 ? (
                      <div className="space-y-4">
                        {issue.fields.comment.comments.map((comment: any) => (
                          <div key={comment.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                {comment.author.avatarUrls && (
                                  <img 
                                    src={comment.author.avatarUrls['24x24']} 
                                    alt={comment.author.displayName}
                                    className="w-6 h-6 rounded-full mr-2" 
                                  />
                                )}
                                <div className="font-medium">{comment.author.displayName}</div>
                              </div>
                              <div className="text-sm text-gray-500">{formatTimeAgo(comment.created)}</div>
                            </div>
                            <div className="prose dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ 
                              __html: comment.body 
                            }} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No comments yet</p>
                    )}
                  </div>
                </div>
                
                {/* Right Column - Metadata */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 h-fit">
                  {/* People */}
                  <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">People</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 w-24">Assignee:</span>
                      {issue.fields.assignee ? (
                        <div className="flex items-center">
                          {issue.fields.assignee.avatarUrls && (
                            <img 
                              src={issue.fields.assignee.avatarUrls['24x24']} 
                              alt={issue.fields.assignee.displayName}
                              className="w-5 h-5 rounded-full mr-2" 
                            />
                          )}
                          <span>{issue.fields.assignee.displayName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">未分配</span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 w-24">Reporter:</span>
                      {issue.fields.reporter ? (
                        <div className="flex items-center">
                          {issue.fields.reporter.avatarUrls && (
                            <img 
                              src={issue.fields.reporter.avatarUrls['24x24']} 
                              alt={issue.fields.reporter.displayName}
                              className="w-5 h-5 rounded-full mr-2" 
                            />
                          )}
                          <span>{issue.fields.reporter.displayName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Dates */}
                  <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Dates</h2>
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Created:</div>
                      <div>
                        {formatDate(issue.fields.created)}
                        <div className="text-sm text-gray-500">{formatTimeAgo(issue.fields.created)}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Updated:</div>
                      <div>
                        {formatDate(issue.fields.updated)}
                        <div className="text-sm text-gray-500">{formatTimeAgo(issue.fields.updated)}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 w-24">Type:</span>
                      <div className="flex items-center">
                        {issue.fields.issuetype && (
                          <img 
                            src={issue.fields.issuetype.iconUrl} 
                            alt={issue.fields.issuetype.name} 
                            className="w-4 h-4 mr-2" 
                          />
                        )}
                        <span>{issue.fields.issuetype ? issue.fields.issuetype.name : '-'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 w-24">Priority:</span>
                      <span>{formatPriority() || '-'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 w-24">Project:</span>
                      <span>{issue.fields.project ? issue.fields.project.name : '-'}</span>
                    </div>
                    
                    {issue.fields.labels && issue.fields.labels.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Labels:</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {issue.fields.labels.map((label: string) => (
                            <span key={label} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 text-yellow-800 p-6 rounded-lg text-center">
            <p className="text-lg font-medium">Issue not found</p>
            <p className="mt-2">The issue with key {key} could not be found.</p>
            <div className="mt-4">
              <Link 
                href="/dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-block"
              >
                返回 Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 