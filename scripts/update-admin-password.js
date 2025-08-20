const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function updateAdminPassword() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Updating administrator password...');
    
    // 檢查管理員是否存在
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'administrator' }
    });
    
    if (!existingAdmin) {
      console.log('Administrator user does not exist. Creating new administrator user...');
      // 如果不存在，創建新的管理員用戶
      const hashedPassword = await bcrypt.hash('administrator', 10);
      const admin = await prisma.user.create({
        data: {
          username: 'administrator',
          hashedPassword: hashedPassword,
          role: 'ADMIN',
        },
      });
      console.log(`Created new admin user: ${admin.username} with password "administrator"`);
    } else {
      // 如果存在，更新密碼
      const hashedPassword = await bcrypt.hash('administrator', 10);
      const updatedAdmin = await prisma.user.update({
        where: { username: 'administrator' },
        data: {
          hashedPassword: hashedPassword,
        },
      });
      console.log(`Updated admin user password: ${updatedAdmin.username}`);
      console.log('New password: "administrator"');
    }
    
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 執行密碼更新函數
updateAdminPassword();
