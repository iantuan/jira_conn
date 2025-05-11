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

  try {
    const jiraDbSettings = await prisma.jiraConnectionSetting.findUnique({
      where: { id: GLOBAL_JIRA_SETTINGS_ID },
    });

    if (!jiraDbSettings || !jiraDbSettings.baseUrl || !jiraDbSettings.email || !jiraDbSettings.apiToken) {
      return NextResponse.json({ message: 'Jira connection not configured in system settings.' }, { status: 503 });
    }

    const clientPayload = await request.json();
    const {
      pageId,         // For JQL page based searches
      startAt = 0,   
      maxResults = 20,
      targetEndpoint, // For direct Jira API calls (e.g., get specific issue)
      jiraApiMethod,  // Actual HTTP method for the target Jira API
      jiraApiParams,  // Query params for GET requests to target Jira API
      jiraApiBody     // Body for POST/PUT requests to target Jira API
    } = clientPayload;

    let finalTargetEndpoint: string;
    let finalJiraApiMethod: string;
    let finalJiraApiBody: any = jiraApiBody;
    let finalJiraApiParams: any = jiraApiParams;

    if (pageId) {
      // Mode 1: Fetch JQL from DB using pageId and perform a search
      const pageConfig = await prisma.jiraPageConfig.findUnique({
        where: { id: pageId as string },
      });
      if (!pageConfig || !pageConfig.jql) {
        return NextResponse.json({ message: `Page configuration or JQL not found for pageId: ${pageId}` }, { status: 404 });
      }
      finalTargetEndpoint = '/rest/api/2/search';
      finalJiraApiMethod = 'POST'; // Jira search is POST
      finalJiraApiBody = {
        jql: pageConfig.jql.trim(),
        startAt: startAt,
        maxResults: maxResults,
        fields: ["summary", "status", "assignee", "reporter", "priority", "issuetype", "created", "updated", "project"],
        expand: ["renderedFields", "names", "schema"],
        fieldsByKeys: false,
      };
      console.log(`(Proxy) Mode: JQL Search via PageID (${pageId}). JQL: ${pageConfig.jql}`);
    } else if (targetEndpoint && jiraApiMethod) {
      // Mode 2: Direct proxy for a given endpoint and method
      finalTargetEndpoint = targetEndpoint;
      finalJiraApiMethod = jiraApiMethod;
      // finalJiraApiBody and finalJiraApiParams are already set from clientPayload
      console.log(`(Proxy) Mode: Direct API call. Endpoint: ${finalTargetEndpoint}, Method: ${finalJiraApiMethod}`);
    } else {
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
    } else if (finalJiraApiMethod !== 'GET' && finalJiraApiMethod !== 'DELETE') {
        headers['Content-Type'] = 'application/json'; // For methods like PATCH that might not have a body initially but need Content-Type
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
      const responseData = responseText ? JSON.parse(responseText) : {};
      return NextResponse.json(responseData);
    } catch (e) {
      console.error(`(Proxy) Failed to parse Jira response as JSON for ${finalTargetEndpoint}:`, e, "Response Text:", responseText);
      return NextResponse.json(
        { error: 'Proxy: Failed to parse Jira response', details: responseText },
        { status: jiraApiResponse.status === 204 ? 204 : 500 } 
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