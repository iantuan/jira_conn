#!/bin/sh

# Initialize the database if it doesn't exist
if [ ! -f /app/data/database.db ]; then
  echo "Initializing database..."
  
  # Use Prisma db push to create the schema directly (doesn't require migration files)
  echo "Creating database schema with Prisma db push..."
  npx prisma db push --schema=/app/src/generated/prisma/schema.prisma --accept-data-loss
  
  # Create the administrator user directly using Node.js
  echo "Creating administrator user..."
  node -e '
    const { PrismaClient } = require("@prisma/client");
    const bcrypt = require("bcryptjs");
    
    async function createAdminUser() {
      const prisma = new PrismaClient();
      try {
        const hashedPassword = await bcrypt.hash("administrator", 10);
        const admin = await prisma.user.create({
          data: {
            username: "administrator",
            hashedPassword: hashedPassword,
            role: "ADMIN",
          },
        });
        console.log(`Created admin user: ${admin.username}`);
      } catch (error) {
        console.error("Error creating admin user:", error);
      } finally {
        await prisma.$disconnect();
      }
    }
    
    createAdminUser();
  '
  
  echo "Database initialized with administrator account."
fi

# Start the Next.js app using standalone mode
echo "Starting Next.js in standalone mode..."
# Configure the PORT environment variable
export PORT=3000
# Start the Next.js app with the correct path to public folder
# NODE_OPTIONS to increase memory limit if needed
export NODE_OPTIONS="--max_old_space_size=4096"

# Check where server.js is located and run it
if [ -f "/app/server.js" ]; then
  echo "Running server.js from /app"
  cd /app && exec node server.js
elif [ -f "/app/.next/standalone/server.js" ]; then
  echo "Running server.js from /app/.next/standalone"
  cd /app/.next/standalone && exec node server.js
else
  echo "ERROR: Cannot find server.js. Listing files in /app:"
  ls -la /app
  echo "Listing files in /app/.next (if exists):"
  ls -la /app/.next || echo "/app/.next does not exist"
  echo "Trying to run server.js anyway from /app"
  cd /app && exec node server.js
fi 