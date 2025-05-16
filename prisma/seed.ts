import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'administrator' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('administrator', 10);
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        username: 'administrator',
        hashedPassword,
        role: UserRole.ADMIN,
      },
    });
    
    console.log(`Created admin user: ${admin.username}`);
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 