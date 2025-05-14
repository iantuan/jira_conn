import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@/generated/prisma";

// For POST (Admin only parts)
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();
const GLOBAL_JIRA_SETTINGS_ID = "global_jira_settings";

// Get Jira Connection Settings - Now public
export async function GET(req: NextRequest) {
  // No session check, connection settings (excluding token) are public
  try {
    let settings = await prisma.jiraConnectionSetting.findUnique({
      where: { id: GLOBAL_JIRA_SETTINGS_ID },
    });

    if (!settings) {
      // Return minimal info if not configured, avoid creating one on GET for unauth user
      return NextResponse.json({ 
          baseUrl: null,
          email: null,
          hasApiToken: false 
      }, { status: 200 });
    }
    
    return NextResponse.json({ 
        baseUrl: settings.baseUrl,
        email: settings.email,
        hasApiToken: !!settings.apiToken 
     }, { status: 200 });

  } catch (error) {
    console.error("Get Jira Connection Settings error:", error);
    return NextResponse.json({ message: 'Failed to retrieve Jira connection settings' }, { status: 500 });
  }
}

// Update Jira Connection Settings (Admin only - session check remains)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { baseUrl, email, apiToken } = await req.json();

    if (baseUrl === undefined || email === undefined || apiToken === undefined) {
      return NextResponse.json({ message: 'Missing required fields: baseUrl, email, apiToken' }, { status: 400 });
    }
    
    // Basic URL validation (can be more sophisticated)
    if (baseUrl && !baseUrl.startsWith('https://')) {
        return NextResponse.json({ message: 'Base URL must start with https://' }, { status: 400 });
    }
    if (baseUrl && baseUrl.endsWith('/')) {
        return NextResponse.json({ message: 'Base URL should not end with a slash' }, { status: 400 });
    }

    const updatedSettings = await prisma.jiraConnectionSetting.upsert({
      where: { id: GLOBAL_JIRA_SETTINGS_ID },
      update: {
        baseUrl,
        email,
        apiToken, // Again, consider encryption here
      },
      create: {
        id: GLOBAL_JIRA_SETTINGS_ID,
        baseUrl,
        email,
        apiToken,
      },
    });

    // Do not return the apiToken in the response
    return NextResponse.json({ 
        message: 'Jira connection settings updated successfully',
        settings: {
            baseUrl: updatedSettings.baseUrl,
            email: updatedSettings.email,
            hasApiToken: !!updatedSettings.apiToken
        }
    }, { status: 200 });

  } catch (error) {
    console.error("Update Jira Connection Settings error:", error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to update Jira connection settings' }, { status: 500 });
  }
} 