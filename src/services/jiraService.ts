import { JiraConfig, JiraIssue, JiraSearchResult } from '@/types/jira';

// This service now acts as a client to our OWN /api/jira proxy endpoint.
export const createJiraService = (config: JiraConfig) => {
  // config (baseUrl, email, apiToken) from the client is NO LONGER directly used for auth here.
  // The proxy /api/jira will fetch the actual credentials from the database.
  // The config might still be used if the proxy needed hints (e.g. if multiple Jira instances were configured),
  // but for a single global config, the proxy handles it all.

  const callProxyApi = async (targetEndpoint: string, method = 'GET', bodyData?: any, queryParams?: any) => {
    console.log(`JiraService: Calling our proxy for ${method} ${targetEndpoint}`);
    
    const proxyPayload: any = {
      targetEndpoint,    // e.g., /rest/api/2/issue/KEY-123 or /rest/api/2/search
      jiraApiMethod: method, // e.g., 'GET' or 'POST'
    };

    if (queryParams) { // For GET, these are URL parameters for the target Jira API
      proxyPayload.jiraApiParams = queryParams;
    }
    if (bodyData) { // For POST/PUT, this is the body for the target Jira API
      proxyPayload.jiraApiBody = bodyData;
    }
        
    const response = await fetch('/api/jira', { // Always call our own proxy
      method: 'POST', // Our proxy endpoint itself is always POST
      headers: {
        'Content-Type': 'application/json',
        // No Authorization header here; the proxy adds it using server-side credentials from DB
      },
      body: JSON.stringify(proxyPayload),
    });
    
    if (!response.ok) {
      let errorDetails = { message: `Proxy request failed with status: ${response.status} ${response.statusText}` };
      try {
        errorDetails = await response.json();
      } catch (e) {
        // Could not parse JSON, stick with the status text
      }
      console.error('Proxy API call failed:', errorDetails);
      throw new Error(errorDetails.message || `Proxy request to ${targetEndpoint} failed.`);
    }
    
    if (response.status === 204) { // Handle No Content responses
      return null; 
    }
    return response.json();
  };

  return {
    getIssue: async (issueKey: string): Promise<JiraIssue> => {
      const endpoint = `/rest/api/2/issue/${issueKey}`;
      const params = { expand: "renderedFields,names,schema,transitions,operations,editmeta,changelog" };
      return callProxyApi(endpoint, 'GET', undefined /* no bodyData */, params /* queryParams */);
    },
    
    // searchIssues in this service is now less relevant if DashboardPage calls /api/jira with pageId.
    // However, if there's a need for direct JQL search via service, it would look like this:
    searchIssues: async (
      jql: string, 
      startAt = 0, 
      maxResults = 20
    ): Promise<JiraSearchResult> => {
      const endpoint = '/rest/api/2/search';
      const jiraSearchPayload = { // This is the body for the *actual* Jira /search API
        jql: jql.trim(),
        startAt: startAt,
        maxResults: maxResults,
        fields: ["summary", "status", "assignee", "reporter", "priority", "issuetype", "created", "updated", "project"],
        expand: ["renderedFields", "names", "schema"]
      };
      // We tell our proxy to POST this body to Jira's search endpoint
      return callProxyApi(endpoint, 'POST', jiraSearchPayload);
    },
    
    testConnection: async () => {
      console.warn("jiraService.testConnection() now calls the proxy for /rest/api/2/myself");
      try {
        const user = await callProxyApi('/rest/api/2/myself', 'GET');
        return {
          success: true,
          user,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'Connection test via proxy failed',
        };
      }
    },
  };
};

// callJiraApi helper: config is now mainly for context if needed, not for direct auth details.
export const callJiraApi = async <T>(
  _config: Pick<JiraConfig, 'baseUrl' | 'email'> | JiraConfig | null, // Config is less critical here now
  apiCall: (jiraService: ReturnType<typeof createJiraService>) => Promise<T>
): Promise<T | null> => {
  // Create a dummy config for createJiraService signature if needed, actual credentials are in DB used by proxy.
  const placeholderConfig: JiraConfig = { baseUrl: '', email: '', apiToken: 'PROXY_HANDLES_THIS', pages: [] };
  try {
    const jiraService = createJiraService(placeholderConfig);
    return await apiCall(jiraService);
  } catch (error) {
    console.error('callJiraApi (through proxy) failed:', error);
    return null;
  }
}; 