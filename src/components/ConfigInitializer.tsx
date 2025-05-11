'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { jiraConfigAtom, jiraConnectionApiAtom, jiraPagesApiAtom } from '@/store/jiraStore';
import { useJiraConnectionSettings, useJiraPageConfigs } from '@/hooks/useConfig';
import { JiraPage } from '@/types/jira';

export default function ConfigInitializer() {
  const { settings: jiraApiSettings, isLoading: isLoadingConnection } = useJiraConnectionSettings();
  const { pages: jiraApiPages, isLoadingPages } = useJiraPageConfigs();

  const [, setJiraConfigAtom] = useAtom(jiraConfigAtom);
  const [, setJiraConnectionApiAtom] = useAtom(jiraConnectionApiAtom);
  const [, setJiraPagesApiAtom] = useAtom(jiraPagesApiAtom);

  useEffect(() => {
    if (jiraApiSettings && !isLoadingConnection) {
      setJiraConnectionApiAtom(jiraApiSettings);
      // Sync with the main jiraConfigAtom for baseUrl, email, and token presence
      setJiraConfigAtom(prev => ({
        ...prev,
        baseUrl: jiraApiSettings.baseUrl || '',
        email: jiraApiSettings.email || '',
        // apiToken is not directly stored from this public fetch; 
        // The hasApiToken flag is used by config page, actual token handled by proxy.
        // For client-side operations that might *need* an indication if a token *should* exist,
        // we can set it to a placeholder if hasApiToken is true.
        apiToken: jiraApiSettings.hasApiToken ? 'TOKEN_IS_SET_ON_SERVER' : '',
      }));
    }
  }, [jiraApiSettings, isLoadingConnection, setJiraConnectionApiAtom, setJiraConfigAtom]);

  useEffect(() => {
    if (jiraApiPages && !isLoadingPages) {
      setJiraPagesApiAtom(jiraApiPages);
      // Sync with the main jiraConfigAtom for pages
      const clientPages: JiraPage[] = jiraApiPages.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description || '',
        jql: p.jql,
        // Ensure other fields from JiraPage type are handled if necessary
        columns: p.columns ? JSON.parse(p.columns) : undefined, // Assuming columns are stored as JSON string
        sortBy: p.sortBy || undefined,
        sortOrder: p.sortOrder as ('ASC' | 'DESC' | undefined) || undefined,
      }));
      setJiraConfigAtom(prev => ({ ...prev, pages: clientPages }));
    }
  }, [jiraApiPages, isLoadingPages, setJiraPagesApiAtom, setJiraConfigAtom]);

  return null; // This component does not render anything itself
} 