# Minimal Dockerfile to run the NestJS proofpoint-mock API using pnpm
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Enable and prepare pnpm via Corepack (bundled with Node.js >=16.13)
RUN corepack enable && corepack prepare pnpm@9 --activate

# Install dependencies with pnpm; leverage lockfile if present
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prefer-offline --strict-peer-dependencies=false

# Copy source
COPY tsconfig.json ./
COPY src ./src

# Expose API port
ARG PORT=3000
ENV PORT=${PORT}
#ENV NODE_ENV=production
EXPOSE ${PORT}

# Start the application (ts-node is in devDependencies)
CMD ["pnpm", "start"]
