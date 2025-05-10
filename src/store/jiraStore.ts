import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { JiraConfig, JiraPage } from '@/types/jira';

// 確保在伺服器端初始化時不會嘗試訪問 localStorage
const isBrowser = typeof window !== 'undefined';

// Default empty configuration
const defaultConfig: JiraConfig = {
  baseUrl: '',
  email: '',
  apiToken: '',
  pages: []
};

// 嘗試從 localStorage 加載現有配置
const getInitialConfig = (): JiraConfig => {
  if (!isBrowser) return defaultConfig;
  
  try {
    const savedConfig = localStorage.getItem('jiraConfig');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      console.log('Loaded config from localStorage:', parsedConfig);
      // 確保所有必要的字段都存在
      return {
        baseUrl: parsedConfig.baseUrl || '',
        email: parsedConfig.email || '',
        apiToken: parsedConfig.apiToken || '',
        pages: Array.isArray(parsedConfig.pages) ? parsedConfig.pages : []
      };
    }
  } catch (error) {
    console.error('Error loading Jira config from localStorage:', error);
  }
  
  return defaultConfig;
};

// Store the Jira configuration in localStorage
export const jiraConfigAtom = atomWithStorage<JiraConfig>('jiraConfig', getInitialConfig());

// Current selected page
export const currentPageIdAtom = atomWithStorage<string | null>('currentPageId', null);

// Derived atom for the current page
export const currentPageAtom = atom((get) => {
  const config = get(jiraConfigAtom);
  const currentPageId = get(currentPageIdAtom);
  
  if (!currentPageId || !config.pages.length) return null;
  
  return config.pages.find(page => page.id === currentPageId) || null;
});

// Current search parameters
export const searchParamsAtom = atom<{
  startAt: number;
  maxResults: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}>({
  startAt: 0,
  maxResults: 20
}); 