import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, method, data, auth } = await request.json();
    
    console.log(`API Proxy: ${method} request to ${url}`);
    console.log('Request data:', JSON.stringify(data));
    
    // Encode credentials for Basic Auth
    const credentials = Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
      'Accept': 'application/json'
    };
    
    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: method || 'GET',
      headers: headers,
    };
    
    // Add body only for non-GET requests
    if (method !== 'GET' && data) {
      fetchOptions.body = JSON.stringify(data);
    }
    
    // Make the request to Jira API
    const response = await fetch(url, fetchOptions);
    
    // Get response content
    const responseText = await response.text();
    
    // Check if response is successful
    if (!response.ok) {
      console.error(`Jira API error (${response.status}): ${responseText}`);
      
      // Try to parse JSON error
      let errorDetails = responseText;
      try {
        errorDetails = JSON.parse(responseText);
      } catch (e) {
        // If parsing fails, keep the text as is
      }
      
      return NextResponse.json(
        { 
          error: `Jira API responded with status ${response.status}`, 
          details: responseText,
          request: {
            url,
            method,
            data: JSON.stringify(data)
          }
        },
        { status: response.status }
      );
    }
    
    // Parse response as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Jira response as JSON:', e);
      return NextResponse.json(
        { error: 'Failed to parse Jira response', text: responseText },
        { status: 500 }
      );
    }
    
    if (responseData.issues) {
      console.log(`Successful response from ${url} with ${responseData.issues.length} issues`);
    } else {
      console.log(`Successful response from ${url}`);
    }
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { 
        error: 'API request failed', 
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 