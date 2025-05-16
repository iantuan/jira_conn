# Dockerfile for jira_conn

# Multi-stage build for minimal image size

# Stage 1: Base image with Alpine Node.js
FROM node:20-alpine AS base
WORKDIR /app

# Stage 2: Install all dependencies and generate Prisma Client
FROM base AS deps
COPY package*.json ./
# Copy the Prisma schema from the source directory.
# Path is relative to the build context root.
COPY src/generated/prisma/schema.prisma ./src/generated/prisma/schema.prisma
RUN npm ci
# Generate Prisma client. Schema path is relative to /app.
# Output is defined in schema.prisma as ../../../node_modules/.prisma/client,
# which resolves to /app/node_modules/.prisma/client from /app/src/generated/prisma/schema.prisma.
RUN npx prisma generate --schema=./src/generated/prisma/schema.prisma

# Stage 3: Build the Next.js application
FROM base AS builder
# Copy package.json for build scripts
COPY package*.json ./

# Ensure no pre-existing node_modules in this stage before copying
RUN rm -rf ./node_modules

# Copy the node_modules (including the Alpine-generated Prisma client) from 'deps' stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application source code (respects .dockerignore)
COPY . .

# AGGRESSIVE CLEANUP of any potential rogue Prisma client before build
RUN rm -rf ./src/generated/prisma/node_modules # If schema output was ever different
RUN rm -rf ./node_modules/.prisma/client/* # Clear out the client dir just before generate, to be sure

# Re-generate the client INSIDE THE BUILDER STAGE using the copied node_modules and local schema.
# This ensures the client used by `npm run build` is fresh and built in this exact context.
RUN npx prisma generate --schema=./src/generated/prisma/schema.prisma

# Add this env var to help with debugging
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node

# Run the build. This should use the Prisma client from the copied node_modules.
# Force production build to ensure proper asset optimization
ENV NODE_ENV=production
RUN npm run build

# Debug: check what's in the .next directory
RUN ls -la .next || echo ".next directory not found"
RUN ls -la .next/standalone || echo ".next/standalone directory not found"

# Verify the standalone output has the required files
RUN ls -la .next/standalone/node_modules/.prisma/client || echo "Prisma client not found in standalone output"

# Stage 4: Final production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=file:/app/data/database.db
# Ensure NEXTAUTH_SECRET is securely set in your actual environment, not hardcoded in plaintext for production.
ENV NEXTAUTH_SECRET="your-strong-secret-key-here"
ENV NEXTAUTH_URL="http://localhost:3000"
# NEXT_DEBUG is typically for development, consider removing for production if not needed.
ENV NEXT_DEBUG=1
# NEXT_SHARP_PATH specifies the location for Sharp, used by Next.js Image Optimization.
ENV NEXT_SHARP_PATH=/app/node_modules/sharp
# NEXT_EXPERIMENTAL_REACT_OVERLAY is a development tool.
ENV NEXT_EXPERIMENTAL_REACT_OVERLAY=1
# Help Prisma find the query engine
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node

RUN mkdir -p /app/data

# Copy necessary files for production runtime
COPY --from=builder /app/package*.json ./

# CRITICAL: Copy the entire node_modules from 'deps' stage.
COPY --from=deps /app/node_modules ./node_modules

# Copy all files from .next (not just standalone) to ensure all assets are included
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

# For standalone mode support
# Copy the standalone build output to the application root
RUN if [ -d "./.next/standalone" ]; then \
    echo "Copying standalone files to root"; \
    cp -r ./.next/standalone/* ./; \
    fi

# Debug: Check what files ended up where
RUN echo "Checking server.js in different locations"
RUN ls -la /app/server.js || echo "No server.js in /app"
RUN ls -la /app/.next/standalone/server.js || echo "No server.js in .next/standalone"

# Force regenerate Prisma client in the runtime environment
RUN npx prisma generate --schema=/app/src/generated/prisma/schema.prisma

# Copy the Prisma engine files to the standalone directory structure
RUN mkdir -p ./.next/standalone/node_modules/.prisma/client/
RUN cp -r /app/node_modules/.prisma/client/* ./.next/standalone/node_modules/.prisma/client/

RUN chmod +x ./entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
