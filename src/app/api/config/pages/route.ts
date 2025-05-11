import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from "next-auth/next"; // No longer needed for GET if public
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // No longer needed for GET
import { PrismaClient } from "@/generated/prisma";
import { z } from 'zod';

// For POST (Admin only parts)
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Zod schema for page creation/update validation
const pageConfigSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  jql: z.string().min(1, "JQL query is required"),
  // columns, sortBy, sortOrder can be added if needed for backend storage
});

// GET all Jira Page Configs - Now public
export async function GET(req: NextRequest) {
  // No session check, pages are public to all visitors
  try {
    const pages = await prisma.jiraPageConfig.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(pages, { status: 200 });
  } catch (error) {
    console.error("Get Jira Page Configs error:", error);
    return NextResponse.json({ message: 'Failed to retrieve page configurations' }, { status: 500 });
  }
}

// POST a new Jira Page Config (Admin only - session check remains)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = pageConfigSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: "Invalid input", errors: validation.error.format() }, { status: 400 });
    }

    const { title, description, jql } = validation.data;

    const newPage = await prisma.jiraPageConfig.create({
      data: {
        title,
        description,
        jql,
        // ownerId: session.user.id, // If making pages user-specific in future
      },
    });
    return NextResponse.json(newPage, { status: 201 });

  } catch (error) {
    console.error("Create Jira Page Config error:", error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create page configuration' }, { status: 500 });
  }
} 