import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path as needed
import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Current password and new password are required' }, { status: 400 });
    }
    
    if (newPassword.length < 8) {
      return NextResponse.json({ message: 'New password must be at least 8 characters long' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isCurrentPasswordValid = bcrypt.compareSync(currentPassword, user.hashedPassword);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ message: 'Invalid current password' }, { status: 400 });
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { hashedPassword: hashedNewPassword },
    });

    return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });

  } catch (error) {
    console.error("Change password error:", error);
    if (error instanceof SyntaxError) { // Handle cases where req.json() fails
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
} 