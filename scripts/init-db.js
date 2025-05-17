const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 確保prisma/db目錄存在
const dbDir = path.join(process.cwd(), 'prisma', 'db');
if (!fs.existsSync(dbDir)) {
  console.log('Creating prisma/db directory...');
  fs.mkdirSync(dbDir, { recursive: true });
}

// 運行Prisma命令生成客戶端和推送數據庫結構
console.log('Initializing database...');
exec('npx prisma generate --schema=src/generated/prisma/schema.prisma', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating Prisma client: ${error.message}`);
    return;
  }
  
  console.log(stdout);
  
  // 推送數據庫結構
  exec('npx prisma db push --schema=src/generated/prisma/schema.prisma', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error pushing database schema: ${error.message}`);
      return;
    }
    
    console.log(stdout);
    console.log('Database schema created successfully!');
    
    // 創建管理員用戶
    console.log('Creating administrator user...');
    exec('node scripts/create-admin.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating admin user: ${error.message}`);
        return;
      }
      
      console.log(stdout);
      console.log('Database initialization completed successfully!');
    });
  });
}); 