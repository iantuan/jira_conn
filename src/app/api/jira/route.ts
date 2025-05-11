import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from "next-auth/next"; // No longer needed if proxy is public
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // No longer needed
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();
const GLOBAL_JIRA_SETTINGS_ID = "global_jira_settings";

export async function POST(request: NextRequest) {
  // Session check removed to allow anonymous access to the proxy.
  // WARNING: This means ANYONE who can hit this endpoint can query your Jira instance
  // using the globally configured credentials.
  // Consider the security implications carefully.

  try {
    const jiraDbSettings = await prisma.jiraConnectionSetting.findUnique({
      where: { id: GLOBAL_JIRA_SETTINGS_ID },
    });

    if (!jiraDbSettings || !jiraDbSettings.baseUrl || !jiraDbSettings.email || !jiraDbSettings.apiToken) {
      return NextResponse.json({ message: 'Jira connection not configured in the system settings.' }, { status: 503 });
    }

    const { jql, startAt, maxResults, fields, expand } = await request.json();
    
    const normalizedBaseUrl = jiraDbSettings.baseUrl.endsWith('/') ? jiraDbSettings.baseUrl.slice(0, -1) : jiraDbSettings.baseUrl;
    const endpoint = '/rest/api/2/search';
    const targetUrl = `${normalizedBaseUrl}${endpoint}`;

    console.log(`(Public Proxy) Proxying Jira API: POST ${targetUrl}`);

    const credentials = Buffer.from(`${jiraDbSettings.email}:${jiraDbSettings.apiToken}`).toString('base64');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
      'Accept': 'application/json'
    };
    
    const searchPayload = {
      jql: jql?.trim() || '',
      startAt: startAt || 0,
      maxResults: maxResults || 20,
      fields: fields || ["summary", "status", "assignee", "reporter", "priority", "issuetype", "created", "updated", "project"],
      expand: expand || ["renderedFields", "names", "schema"],
      fieldsByKeys: false,
    };

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(searchPayload),
    };
    
    // console.log('(Public Proxy) sending to Jira:', JSON.stringify(searchPayload, null, 2));

    const jiraApiResponse = await fetch(targetUrl, fetchOptions);
    const responseText = await jiraApiResponse.text();

    if (!jiraApiResponse.ok) {
      console.error(`(Public Proxy) Jira API error (${jiraApiResponse.status}) from ${targetUrl}: ${responseText}`);
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
      const responseData = JSON.parse(responseText);
      // console.log(`(Public Proxy) successful response from ${targetUrl}`);
      return NextResponse.json(responseData);
    } catch (e) {
      console.error('(Public Proxy) Failed to parse Jira response as JSON:', e, "Response Text:", responseText);
      return NextResponse.json(
        { error: 'Proxy: Failed to parse Jira response', details: responseText },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('(Public Proxy) Jira API Proxy general error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid request body sent to proxy' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Jira API Proxy internal error', message: error.message },
      { status: 500 }
    );
  }
} 