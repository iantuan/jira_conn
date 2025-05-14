# Dockerfile for jira_conn
# Multi-stage build for minimal image size

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXTAUTH_SECRET=your-nextauth-secret-for-docker-build
ENV NEXTAUTH_URL=http://localhost:3000
ENV DATABASE_URL=file:/app/prisma/dev.db

# Enable verbose mode for better debugging
ENV NEXT_DEBUG=1

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app with verbose output and skip type checking
RUN set -x && \
    echo "Starting Next.js build..." && \
    npm run build || \
    (echo "=======================" && \
     echo "Next.js build failed with error above" && \
     echo "Check TypeScript errors carefully" && \
     echo "=======================" && \
     exit 1)

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=file:/app/data/database.db
ENV NEXTAUTH_SECRET=your-nextauth-secret-for-production
ENV NEXTAUTH_URL=http://localhost:3000

# Create directory for the database
RUN mkdir -p /app/data

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy necessary files from build stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/next.config.ts ./

# Copy and set up the entrypoint script
COPY entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

# Expose the port
EXPOSE 3000

# Set the entrypoint
ENTRYPOINT ["/app/entrypoint.sh"] 