#!/bin/sh

# Initialize the database if it doesn't exist
if [ ! -f /app/data/database.db ]; then
  echo "Initializing database..."
  npx prisma migrate deploy
  npx prisma db seed
  echo "Database initialized with admin user"
fi

# Start the Next.js app
exec npm start 