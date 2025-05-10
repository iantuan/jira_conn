import axios from 'axios';
import { JiraConfig, JiraSearchResult } from '@/types/jira';

// Create a Jira API service
export const createJiraService = (config: JiraConfig) => {
  // 檢查並確保配置正確
  if (!config || !config.baseUrl || !config.email || !config.apiToken) {
    console.warn('JiraService: Configuration is incomplete', config);
  }
  
  const { baseUrl = '', email = '', apiToken = '' } = config || {};
  
  // Call API through our proxy
  const callApi = async (endpoint: string, method = 'GET', data = {}) => {
    // Ensure the baseUrl doesn't end with a slash and endpoint starts with one
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    const url = `${normalizedBaseUrl}${normalizedEndpoint}`;
    console.log(`Calling Jira API: ${method} ${url}`);
    
    const response = await fetch('/api/jira', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        method,
        data,
        auth: {
          username: email,
          password: apiToken,
        },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      console.error('API call failed:', errorData);
      throw new Error(`API request failed: ${errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  };

  return {
    // Get issue details by key
    getIssue: async (issueKey: string) => {
      return callApi(`/rest/api/2/issue/${issueKey}?expand=renderedFields,names,schema,transitions,operations,editmeta,changelog`);
    },
    
    // Search for issues using JQL
    searchIssues: async (
      jql: string, 
      startAt = 0, 
      maxResults = 20, 
      fields = "*all"
    ): Promise<JiraSearchResult> => {
      console.log(`Searching issues with JQL: ${jql}`);
      
      // 定義所有需要的欄位
      const requiredFields = [
        "summary",
        "status",
        "assignee",
        "reporter",
        "priority",
        "issuetype",
        "created",
        "updated",
        "description",
        "comment",
        "project",
        "labels",
        "fixVersions",
        "components"
      ];
      
      // Properly format the request according to Jira API documentation
      // See: https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-search/#api-rest-api-2-search-post
      const searchPayload = {
        jql: jql.trim(),
        startAt: startAt,
        maxResults: maxResults,
        fields: requiredFields,
        fieldsByKeys: false,
        expand: ["renderedFields", "names", "schema"]
      };
      
      // Log the exact payload being sent
      console.log('Search payload:', JSON.stringify(searchPayload));
      
      try {
        const result = await callApi('/rest/api/2/search', 'POST', searchPayload);
        // 檢查結果
        if (result && result.issues) {
          console.log(`Received ${result.issues.length} issues, sample:`, 
            result.issues.length > 0 ? 
              { key: result.issues[0].key, fields: Object.keys(result.issues[0].fields || {}) } : 
              "No issues"
          );
        }
        return result;
      } catch (error) {
        console.error('Error searching Jira issues:', error);
        throw error;
      }
    },
    
    // Test connection to Jira
    testConnection: async () => {
      try {
        const user = await callApi('/rest/api/2/myself');
        console.log('Connection test successful:', user);
        return {
          success: true,
          user,
        };
      } catch (error) {
        console.error('Jira connection test failed:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  };
};

// Create a safe function to call Jira API
export const callJiraApi = async <T>(
  config: JiraConfig | null, 
  apiCall: (jiraService: ReturnType<typeof createJiraService>) => Promise<T>
): Promise<T | null> => {
  if (!config || !config.baseUrl || !config.email || !config.apiToken) {
    console.error('Jira configuration is incomplete', config);
    return null;
  }
  
  try {
    const jiraService = createJiraService(config);
    const result = await apiCall(jiraService);
    return result;
  } catch (error) {
    console.error('Jira API call failed:', error);
    return null;
  }
}; 