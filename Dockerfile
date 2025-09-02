# Dockerfile to run the NestJS proofpoint-mock API using pnpm

ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-alpine AS alpine

# Setup pnpm on the alpine base
FROM alpine AS base

# Enable and prepare pnpm via Corepack (bundled with Node.js >=16.13)
RUN corepack enable && corepack prepare pnpm@9 --activate

# Build the project
FROM base AS builder

# Create app directory
WORKDIR /app

# Install dependencies with pnpm; leverage lockfile if present
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prefer-offline --strict-peer-dependencies=false

# Copy source
COPY tsconfig.json ./
COPY src ./src

# Nest runner
FROM base AS runner

WORKDIR /app
COPY --from=builder /app .

# Expose API port
ARG PORT=3000
ENV PORT=${PORT}
ENV NODE_ENV=production
EXPOSE ${PORT}

# Start the application (ts-node is in devDependencies)
CMD ["pnpm", "start"]
