import useSWR from 'swr';
import { useAtomValue } from 'jotai';
import { jiraConfigAtom, currentPageAtom, searchParamsAtom } from '@/store/jiraStore';
import { callJiraApi, createJiraService } from '@/services/jiraService';
import { JiraIssue, JiraSearchResult } from '@/types/jira';

// 確保 JQL 查詢格式正確
const formatJQL = (jql: string): string => {
  if (!jql || typeof jql !== 'string') return '';
  
  // 修剪空白
  let formattedJql = jql.trim();
  
  // 檢查引號是否配對
  const doubleQuotes = (formattedJql.match(/"/g) || []).length;
  const singleQuotes = (formattedJql.match(/'/g) || []).length;
  
  if (doubleQuotes % 2 !== 0) {
    console.warn('JQL 可能有未配對的雙引號: ', formattedJql);
  }
  
  if (singleQuotes % 2 !== 0) {
    console.warn('JQL 可能有未配對的單引號: ', formattedJql);
  }
  
  // 檢查常見的 JQL 語法問題
  if (!formattedJql.includes('=') && !formattedJql.includes('!=') && 
      !formattedJql.includes('>') && !formattedJql.includes('<') &&
      !formattedJql.includes('IN') && !formattedJql.includes('NOT IN') &&
      !formattedJql.includes('~') && !formattedJql.includes('IS') &&
      !formattedJql.includes('WAS')) {
    console.warn('JQL 可能缺少有效的操作符，應該使用 =, !=, >, <, IN, IS 等');
  }
  
  // 記錄最終查詢
  console.log('格式化後的 JQL 查詢: ', formattedJql);
  
  return formattedJql;
};

// 基本 JQL 語法驗證
const validateJQL = (jql: string): { valid: boolean; message?: string } => {
  if (!jql || jql.trim() === '') {
    return { valid: false, message: 'JQL 查詢不能為空' };
  }
  
  // 檢查引號是否配對
  const doubleQuotes = (jql.match(/"/g) || []).length;
  const singleQuotes = (jql.match(/'/g) || []).length;
  
  if (doubleQuotes % 2 !== 0) {
    return { valid: false, message: '雙引號配對不正確' };
  }
  
  if (singleQuotes % 2 !== 0) {
    return { valid: false, message: '單引號配對不正確' };
  }
  
  return { valid: true };
};

// Custom hook for testing Jira connection
export const useTestJiraConnection = () => {
  const config = useAtomValue(jiraConfigAtom);
  
  return useSWR(
    config.baseUrl && config.email && config.apiToken ? 'jira-connection-test' : null,
    async () => {
      if (!config.baseUrl || !config.email || !config.apiToken) {
        throw new Error('Jira configuration is incomplete');
      }
      
      try {
        const jiraService = createJiraService(config);
        return jiraService.testConnection();
      } catch (error) {
        console.error('Connection test error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
};

// Custom hook for fetching Jira issues
export const useJiraIssues = () => {
  const config = useAtomValue(jiraConfigAtom);
  const currentPage = useAtomValue(currentPageAtom);
  const searchParams = useAtomValue(searchParamsAtom);
  
  const { startAt, maxResults } = searchParams;
  
  // 建立 SWR 緩存鍵
  const cacheKey = currentPage 
    ? ['jira-issues', currentPage.id, startAt, maxResults, currentPage.jql] 
    : null;
  
  return useSWR<JiraSearchResult | null>(
    cacheKey,
    async () => {
      if (!config || !currentPage) {
        console.log('無法執行查詢: 缺少配置或當前頁面');
        return null;
      }
      
      if (!currentPage.jql) {
        console.log('無法執行查詢: JQL 為空');
        return null;
      }
      
      // 驗證 JQL 語法
      const validation = validateJQL(currentPage.jql);
      if (!validation.valid) {
        console.error(`JQL 驗證失敗: ${validation.message}`);
        throw new Error(`JQL 語法錯誤: ${validation.message}`);
      }
      
      console.log('執行 Jira 查詢:', { 
        pageId: currentPage.id, 
        title: currentPage.title,
        jql: currentPage.jql,
        startAt,
        maxResults
      });
      
      try {
        // 確保 JQL 格式正確
        const formattedJQL = formatJQL(currentPage.jql);
        
        const result = await callJiraApi(config, (jiraService) => 
          jiraService.searchIssues(
            formattedJQL,
            startAt,
            maxResults
          )
        );
        
        // 記錄查詢結果
        console.log('Jira 查詢結果:', {
          issuesCount: result?.issues?.length || 0,
          total: result?.total || 0,
          hasError: !result
        });
        
        // Ensure we return a valid data structure even if API returns unexpected format
        if (!result) {
          return {
            issues: [],
            total: 0,
            maxResults: maxResults,
            startAt: startAt
          };
        }
        
        return {
          issues: Array.isArray(result.issues) ? result.issues : [],
          total: typeof result.total === 'number' ? result.total : 0,
          maxResults: typeof result.maxResults === 'number' ? result.maxResults : maxResults,
          startAt: typeof result.startAt === 'number' ? result.startAt : startAt
        };
      } catch (error) {
        console.error('Error fetching Jira issues:', error);
        throw error;
      }
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 10000 // 10 秒內不重複請求
    }
  );
};

// Custom hook for fetching a single Jira issue
export const useJiraIssue = (issueKey: string | null) => {
  const config = useAtomValue(jiraConfigAtom);
  
  return useSWR<JiraIssue | null>(
    issueKey ? ['jira-issue', issueKey] : null,
    async () => {
      if (!config || !issueKey) return null;
      
      try {
        console.log(`Fetching issue: ${issueKey}`);
        return await callJiraApi(config, (jiraService) => 
          jiraService.getIssue(issueKey)
        );
      } catch (error) {
        console.error(`Error fetching issue ${issueKey}:`, error);
        throw error;
      }
    },
    {
      revalidateOnFocus: false
    }
  );
}; 