const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking for existing administrator user...');
    
    // 檢查管理員是否已存在
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'administrator' }
    });
    
    if (existingAdmin) {
      console.log('Administrator user already exists.');
      return;
    }
    
    // 創建管理員用戶
    console.log('Creating administrator user...');
    const hashedPassword = await bcrypt.hash('administrator', 10);
    const admin = await prisma.user.create({
      data: {
        username: 'administrator',
        hashedPassword: hashedPassword,
        role: 'ADMIN',
      },
    });
    
    console.log(`Created admin user: ${admin.username}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 執行創建管理員的函數
createAdminUser(); 