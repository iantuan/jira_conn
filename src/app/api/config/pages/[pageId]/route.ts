import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma";
import { z } from 'zod';

const prisma = new PrismaClient();

// Zod schema for page update validation (similar to creation, but all fields optional for PATCH like behavior)
const pageConfigUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional().nullable(), // Allow null to clear description
  jql: z.string().min(1, "JQL query is required").optional(),
  type: z.enum(['issue', 'epic']).optional(),
  groupId: z.string().nullable().optional(),
  // columns, sortBy, sortOrder can be added if needed for backend storage
});

// PUT (Update) a specific Jira Page Config (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: { pageId: string } }
) {
  const session = await getServerSession(authOptions);
  const { pageId } = params;

  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!pageId) {
    return NextResponse.json({ message: 'Page ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const validation = pageConfigUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: "Invalid input", errors: validation.error.format() }, { status: 400 });
    }

    const existingPage = await prisma.jiraPageConfig.findUnique({
      where: { id: pageId },
    });

    if (!existingPage) {
      return NextResponse.json({ message: 'Page configuration not found' }, { status: 404 });
    }

    const updatedPage = await prisma.jiraPageConfig.update({
      where: { id: pageId },
      data: validation.data,
    });

    return NextResponse.json(updatedPage, { status: 200 });

  } catch (error) {
    console.error(`Update Jira Page Config (ID: ${pageId}) error:`, error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to update page configuration' }, { status: 500 });
  }
}

// DELETE a specific Jira Page Config (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { pageId: string } }
) {
  const session = await getServerSession(authOptions);
  const { pageId } = params;

  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!pageId) {
    return NextResponse.json({ message: 'Page ID is required' }, { status: 400 });
  }

  try {
    const existingPage = await prisma.jiraPageConfig.findUnique({
      where: { id: pageId },
    });

    if (!existingPage) {
      return NextResponse.json({ message: 'Page configuration not found' }, { status: 404 });
    }

    await prisma.jiraPageConfig.delete({
      where: { id: pageId },
    });

    return NextResponse.json({ message: 'Page configuration deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error(`Delete Jira Page Config (ID: ${pageId}) error:`, error);
    return NextResponse.json({ message: 'Failed to delete page configuration' }, { status: 500 });
  }
} 