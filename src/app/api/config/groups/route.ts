import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@/generated/prisma";
import { z } from 'zod';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Zod schema for group creation/update validation
const groupConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  order: z.number().optional()
});

// GET all Jira Page Groups
export async function GET(req: NextRequest) {
  try {
    const groups = await prisma.jiraPageGroup.findMany({
      orderBy: { order: 'asc' },
      include: {
        pages: true
      }
    });
    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error("Get Jira Page Groups error:", error);
    return NextResponse.json({ message: 'Failed to retrieve page group configurations' }, { status: 500 });
  }
}

// POST: Create new page group (Admin only)
export async function POST(req: NextRequest) {
  // Admin authorization check
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validation = groupConfigSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }
    
    // If order is not provided, set it to the highest existing order + 1
    if (!body.order) {
      const highestOrderGroup = await prisma.jiraPageGroup.findFirst({
        orderBy: { order: 'desc' }
      });
      body.order = highestOrderGroup ? highestOrderGroup.order + 1 : 0;
    }
    
    // Create the new group
    const newGroup = await prisma.jiraPageGroup.create({
      data: {
        name: body.name,
        description: body.description,
        order: body.order
      }
    });
    
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error("Create Jira Page Group error:", error);
    return NextResponse.json({ message: 'Failed to create page group' }, { status: 500 });
  }
} 