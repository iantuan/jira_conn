import useSWR from 'swr';
import { JiraConnectionSetting, JiraPageConfig } from '@/generated/prisma'; // Or from @/types if you have specific client types

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: res.statusText }));
    const error = new Error(errorData.message || 'An error occurred while fetching the data.') as any;
    error.status = res.status;
    throw error;
  }
  return res.json();
};

// Hook for Jira Connection Settings
export interface JiraConnectionClientResponse {
    baseUrl: string | null;
    email: string | null;
    hasApiToken: boolean;
}

export function useJiraConnectionSettings() {
  const { data, error, mutate, isLoading } = useSWR<JiraConnectionClientResponse>('/api/config/jira-connection', fetcher);
  return {
    settings: data,
    isLoading,
    isError: error,
    mutateConnectionSettings: mutate,
  };
}

// Hook for Jira Page Configs
export function useJiraPageConfigs() {
  const { data, error, mutate, isLoading } = useSWR<JiraPageConfig[]>('/api/config/pages', fetcher);
  return {
    pages: data,
    isLoadingPages: isLoading,
    isErrorPages: error,
    mutatePageConfigs: mutate,
  };
} 