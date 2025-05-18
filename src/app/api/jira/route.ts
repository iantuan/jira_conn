import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from "next-auth/next"; // No longer needed if proxy is public
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // No longer needed
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();
const GLOBAL_JIRA_SETTINGS_ID = "global_jira_settings";

export async function POST(request: NextRequest) {
  // Session check can be enabled if needed for all proxy uses
  // const session = await getServerSession(authOptions);
  // if (!session || !session.user) {
  //   return NextResponse.json({ message: 'Unauthorized: Login required' }, { status: 401 });
  // }

  console.log("(Proxy) Received request to /api/jira");
  try {
    const jiraDbSettings = await prisma.jiraConnectionSetting.findUnique({
      where: { id: GLOBAL_JIRA_SETTINGS_ID },
    });

    if (!jiraDbSettings) {
      console.error("(Proxy Debug) No Jira settings found in DB for ID:", GLOBAL_JIRA_SETTINGS_ID);
      return NextResponse.json({ message: 'Jira connection not configured (DB lookup failed).' }, { status: 503 });
    }
    // console.log("(Proxy Debug) Raw settings from DB:", JSON.stringify(jiraDbSettings));
    console.log("(Proxy Debug) BaseURL from DB:", jiraDbSettings.baseUrl);
    console.log("(Proxy Debug) Email from DB:", jiraDbSettings.email);
    console.log("(Proxy Debug) API Token from DB (exists?):", !!jiraDbSettings.apiToken);

    if (!jiraDbSettings.baseUrl || !jiraDbSettings.email || !jiraDbSettings.apiToken) {
      console.error("(Proxy Debug) Jira settings incomplete in DB:", {baseUrl: jiraDbSettings.baseUrl, email: jiraDbSettings.email, tokenExists: !!jiraDbSettings.apiToken });
      return NextResponse.json({ message: 'Jira connection details (URL, email, or token) are missing in system settings.' }, { status: 503 });
    }

    const clientPayload = await request.json();
    console.log("(Proxy) Received clientPayload:", JSON.stringify(clientPayload, null, 2));

    const {
      pageId,         
      startAt = 0,   
      maxResults = 20,
      targetEndpoint, 
      jiraApiMethod,  
      jiraApiParams,  
      jiraApiBody,
      sortField,
      sortOrder,
      filterType
    } = clientPayload;

    let finalTargetEndpoint: string;
    let finalJiraApiMethod: string;
    let finalJiraApiBody: any = jiraApiBody;
    let finalJiraApiParams: any = jiraApiParams;
    let pageConfig: any = null;

    if (pageId) {
      // Mode 1: JQL Search via PageID (typically for dashboard lists)
      console.log(`(Proxy) Operating in Mode 1: JQL Search for pageId=${pageId}`);
      pageConfig = await prisma.jiraPageConfig.findUnique({
        where: { id: pageId as string },
      });
      if (!pageConfig || !pageConfig.jql) {
        return NextResponse.json({ message: `Page configuration or JQL not found for pageId: ${pageId}` }, { status: 404 });
      }
      
      console.log("(Proxy Debug) Page config:", {
        id: pageConfig.id,
        title: pageConfig.title,
        type: pageConfig.type,
        originalJql: pageConfig.jql
      });

      finalTargetEndpoint = '/rest/api/2/search';
      finalJiraApiMethod = 'POST';
      
      // Build the base JQL query
      let baseJql = pageConfig.jql.trim();
      
      // Remove any existing ORDER BY clause
      const orderByMatch = baseJql.match(/\s+ORDER\s+BY\s+.*$/i);
      let orderByClause = '';
      if (orderByMatch) {
        orderByClause = orderByMatch[0];
        baseJql = baseJql.replace(/\s+ORDER\s+BY\s+.*$/i, '').trim();
      }
      
      // Filter by issue type for Epic or Gantt views
      if (pageConfig.type === 'epic' || pageConfig.type === 'gantt' || filterType === 'epic') {
        // Add Epic filter to the beginning of the JQL to ensure proper pagination
        baseJql = `issuetype = Epic AND (${baseJql})`;
        console.log(`(Proxy Debug) Page type is ${pageConfig.type}, adding Epic filter. Base JQL:`, baseJql);
      }
      
      // Add back the ORDER BY clause if it existed
      if (orderByClause) {
        baseJql = `${baseJql} ${orderByClause}`;
      }
      
      finalJiraApiBody = {
        jql: baseJql,
        startAt: startAt,
        maxResults: maxResults,
        fields: [
          "summary", 
          "status", 
          "assignee", 
          "reporter", 
          "priority", 
          "issuetype", 
          "created", 
          "updated", 
          "project",
          "duedate",          // Standard Jira due date field
          "customfield_10015" // Start date field - may need to be adjusted based on your Jira instance
        ],
        expand: ["renderedFields", "names", "schema"],
        fieldsByKeys: false,
      };

      // Add sorting if specified
      if (sortField) {
        const sortFieldMap: { [key: string]: string } = {
          'key': 'key',
          'summary': 'summary',
          'status': 'status',
          'assignee': 'assignee',
          'priority': 'priority',
          'updated': 'updated'
        };

        const jiraSortField = sortFieldMap[sortField];
        if (jiraSortField) {
          // Remove any existing ORDER BY clause
          let jql = finalJiraApiBody.jql;
          jql = jql.replace(/\s+ORDER\s+BY\s+.*$/i, '');
          
          // Add the new ORDER BY clause
          jql = `${jql} ORDER BY ${jiraSortField} ${sortOrder || 'desc'}`;
          finalJiraApiBody.jql = jql;
          console.log("(Proxy Debug) After adding sort, final JQL:", jql);
        }
      }

      console.log("(Proxy Debug) Final API request body:", JSON.stringify(finalJiraApiBody, null, 2));

      console.log(`(Proxy) JQL for search: ${finalJiraApiBody.jql}`);
      if (sortField) {
        console.log(`(Proxy) Sorting by: ${sortField} ${sortOrder}`);
      }
    } else if (targetEndpoint && jiraApiMethod) {
      // Mode 2: Direct proxy for a given endpoint and method (e.g., get specific issue)
      console.log(`(Proxy) Operating in Mode 2: Direct API call. Endpoint=${targetEndpoint}, Method=${jiraApiMethod}`);
      finalTargetEndpoint = targetEndpoint;
      finalJiraApiMethod = jiraApiMethod;
      if (finalJiraApiMethod === 'GET' && finalJiraApiParams) {
        console.log("(Proxy Debug) GET Params for direct call:", JSON.stringify(finalJiraApiParams));
      }
      // finalJiraApiBody and finalJiraApiParams are used as is from clientPayload
    } else {
      console.error("(Proxy) Invalid payload - did not match any mode:", clientPayload);
      return NextResponse.json({ message: 'Invalid proxy request: requires pageId (for search) or targetEndpoint & jiraApiMethod (for direct calls)' }, { status: 400 });
    }

    const normalizedBaseUrl = jiraDbSettings.baseUrl.endsWith('/') 
        ? jiraDbSettings.baseUrl.slice(0, -1) 
        : jiraDbSettings.baseUrl;
    
    let targetUrl = `${normalizedBaseUrl}${finalTargetEndpoint.startsWith('/') ? finalTargetEndpoint : '/' + finalTargetEndpoint}`;

    if (finalJiraApiMethod === 'GET' && finalJiraApiParams) {
      const queryParams = typeof finalJiraApiParams === 'string' ? finalJiraApiParams : new URLSearchParams(finalJiraApiParams as Record<string, string>).toString();
      if (queryParams) {
        targetUrl += `?${queryParams}`;
      }
    }
    console.log(`(Proxy Debug) Final Target URL to Jira: ${targetUrl}`);

    console.log(`(Proxy) Requesting Jira API: ${finalJiraApiMethod} ${targetUrl}`);

    const credentials = Buffer.from(`${jiraDbSettings.email}:${jiraDbSettings.apiToken}`).toString('base64');
    const headers: HeadersInit = {
      'Authorization': `Basic ${credentials}`,
      'Accept': 'application/json',
    };

    const fetchOptions: RequestInit = {
      method: finalJiraApiMethod,
      headers: headers,
    };

    if ((finalJiraApiMethod === 'POST' || finalJiraApiMethod === 'PUT') && finalJiraApiBody) {
      headers['Content-Type'] = 'application/json';
      fetchOptions.body = JSON.stringify(finalJiraApiBody);
      console.log("(Proxy Debug) Body for POST/PUT:", fetchOptions.body.substring(0,500) + "...");
    } else if (finalJiraApiMethod !== 'GET' && finalJiraApiMethod !== 'DELETE') {
        headers['Content-Type'] = 'application/json';
    }
    
    const jiraApiResponse = await fetch(targetUrl, fetchOptions);
    const responseText = await jiraApiResponse.text();

    if (!jiraApiResponse.ok) {
      console.error(`(Proxy) Jira API error (${jiraApiResponse.status}) for ${finalTargetEndpoint} from ${targetUrl}: ${responseText}`);
      try {
        const errorDetails = JSON.parse(responseText);
        return NextResponse.json(
          { error: `Jira API responded with status ${jiraApiResponse.status}`, details: errorDetails },
          { status: jiraApiResponse.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: `Jira API responded with status ${jiraApiResponse.status}`, details: responseText },
          { status: jiraApiResponse.status }
        );
      }
    }
    
    try {
      const responseData = responseText ? JSON.parse(responseText) : {}; // Handle empty or non-JSON responses gracefully
      console.log("(Proxy Debug) Successful Jira API Response (status ${jiraApiResponse.status}, length ${responseText.length})");
      
      // Filter issues if page type is epic
      if (pageId && pageConfig?.type === 'epic' && responseData.issues) {
        const originalCount = responseData.issues.length;
        responseData.issues = responseData.issues.filter((issue: any) => 
          issue.fields.issuetype.name === 'Epic'
        );
        // Don't modify total here as it affects pagination
        console.log(`(Proxy Debug) Filtered Epic issues: ${originalCount} -> ${responseData.issues.length}`);
      }
      
      if (responseText.length > 0 && responseText.length < 500) { // Log small JSON responses
        console.log("(Proxy Debug) Response data:", JSON.stringify(responseData, null, 2));
      }
      return NextResponse.json(responseData);
    } catch (e) {
      console.error(`(Proxy) Failed to parse Jira response as JSON for ${finalTargetEndpoint}:`, e, "Response Text (first 500 chars):", responseText.substring(0,500));
      // If Jira returns non-JSON (e.g. HTML error page) but status was OK (unlikely for API but possible for misconfig)
      // or if it's a 204 No Content which is valid but JSON.parse fails on empty string.
      if (jiraApiResponse.status === 204 && responseText === '') {
        return NextResponse.json({}, { status: 204 }); // Return empty JSON for No Content
      }
      return NextResponse.json(
        { error: 'Proxy: Failed to parse Jira response, or response was not JSON.', details: responseText.substring(0, 1000) + '...' }, // Truncate long non-JSON responses
        { status: 500 } 
      );
    }

  } catch (error: any) {
    console.error('(Proxy) Jira API Proxy general error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid request body sent to proxy' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Jira API Proxy internal error', message: error.message },
      { status: 500 }
    );
  }
}