const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Create a new PrismaClient instance
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Initializing database...');
    
    // Ensure prisma/db directory exists
    const dbDir = path.join(process.cwd(), 'prisma', 'db');
    if (!fs.existsSync(dbDir)) {
      console.log('Creating prisma/db directory...');
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Run Prisma generate command
    try {
      console.log('Generating Prisma client...');
      execSync('npx prisma generate --schema=src/generated/prisma/schema.prisma', { 
        stdio: ['ignore', process.stdout, process.stderr] 
      });
    } catch (error) {
      console.error('Error generating Prisma client');
      throw error;
    }

    // Run Prisma db push command
    try {
      console.log('Pushing database schema...');
      execSync('npx prisma db push --schema=src/generated/prisma/schema.prisma', { 
        stdio: ['ignore', process.stdout, process.stderr] 
      });
      console.log('Database schema created successfully!');
    } catch (error) {
      console.error('Error pushing database schema');
      throw error;
    }

    // Create admin user
    try {
      console.log('Creating administrator user...');
      execSync('node scripts/create-admin.js', { 
        stdio: ['ignore', process.stdout, process.stderr] 
      });
    } catch (error) {
      console.error('Error creating admin user');
      throw error;
    }

    // Create sample data if none exists
    await createSampleData();

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function createSampleData() {
  // Check if any pages exist
  const pageCount = await prisma.jiraPageConfig.count();
  
  if (pageCount === 0) {
    console.log('Creating sample page data...');
    
    try {
      // Create a sample group
      const group = await prisma.jiraPageGroup.create({
        data: {
          name: '示範組',
          description: '示範用的分組'
        }
      });
      
      // Create sample pages
      await prisma.jiraPageConfig.create({
        data: {
          title: '所有待辦事項',
          description: '顯示所有未完成的任務',
          jql: 'status != Done',
          type: 'issue'
        }
      });
      
      await prisma.jiraPageConfig.create({
        data: {
          title: '我的任務',
          description: '分配給我的任務',
          jql: 'assignee = currentUser() AND status != Done',
          type: 'issue'
        }
      });
      
      await prisma.jiraPageConfig.create({
        data: {
          title: '專案進度',
          description: '使用甘特圖檢視專案進度',
          jql: 'project = CUR',
          type: 'gantt',
          groupId: group.id
        }
      });
      
      console.log('Sample page data created successfully!');
    } catch (error) {
      console.error('Error creating sample data:', error);
      throw error;
    }
  } else {
    console.log('Sample data already exists, skipping creation.');
  }
}

// Run the main function
main(); 