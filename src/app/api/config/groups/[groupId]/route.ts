import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@/generated/prisma";
import { z } from 'zod';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Zod schema for group update validation
const groupConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  order: z.number().optional()
});

// GET a specific Jira Page Group by ID
export async function GET(req: NextRequest, { params }: { params: { groupId: string } }) {
  try {
    const groupId = params.groupId;
    
    const group = await prisma.jiraPageGroup.findUnique({
      where: { id: groupId },
      include: {
        pages: true
      }
    });
    
    if (!group) {
      return NextResponse.json({ message: 'Group not found' }, { status: 404 });
    }
    
    return NextResponse.json(group, { status: 200 });
  } catch (error) {
    console.error("Get Jira Page Group error:", error);
    return NextResponse.json({ message: 'Failed to retrieve page group' }, { status: 500 });
  }
}

// PUT: Update a page group (Admin only)
export async function PUT(req: NextRequest, { params }: { params: { groupId: string } }) {
  // Admin authorization check
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const groupId = params.groupId;
    const body = await req.json();
    
    // Validate input
    const validation = groupConfigSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }
    
    // Check if the group exists
    const existingGroup = await prisma.jiraPageGroup.findUnique({
      where: { id: groupId }
    });
    
    if (!existingGroup) {
      return NextResponse.json({ message: 'Group not found' }, { status: 404 });
    }
    
    // Update the group
    const updatedGroup = await prisma.jiraPageGroup.update({
      where: { id: groupId },
      data: {
        name: body.name,
        description: body.description,
        order: body.order !== undefined ? body.order : existingGroup.order
      }
    });
    
    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error) {
    console.error("Update Jira Page Group error:", error);
    return NextResponse.json({ message: 'Failed to update page group' }, { status: 500 });
  }
}

// DELETE: Delete a page group (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { groupId: string } }) {
  // Admin authorization check
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const groupId = params.groupId;
    
    // Check if the group exists
    const existingGroup = await prisma.jiraPageGroup.findUnique({
      where: { id: groupId }
    });
    
    if (!existingGroup) {
      return NextResponse.json({ message: 'Group not found' }, { status: 404 });
    }
    
    // Remove the group association from any pages
    await prisma.jiraPageConfig.updateMany({
      where: { groupId },
      data: { groupId: null }
    });
    
    // Delete the group
    await prisma.jiraPageGroup.delete({
      where: { id: groupId }
    });
    
    return NextResponse.json({ message: 'Group deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Delete Jira Page Group error:", error);
    return NextResponse.json({ message: 'Failed to delete page group' }, { status: 500 });
  }
} 