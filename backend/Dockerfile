# Stage 1: Build & Dependencies
FROM node:22-alpine AS build

# Enable pnpm
ENV COREPACK_DEFAULT_TO_LATEST=0
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Copying package files first leverages Docker layer caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm config set ignore-builds false
RUN pnpm install --frozen-lockfile

# Copy source files and build
COPY . .
RUN pnpm run build

# Stage 2: Final Production Image
FROM node:22-alpine

# Set environment to production for Express optimizations
ENV NODE_ENV=production

# Enable pnpm
ENV COREPACK_DEFAULT_TO_LATEST=0
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

WORKDIR /usr/src/app

# Copy files adn dist folder from build stage
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/pnpm-lock.yaml ./
COPY --from=build /usr/src/app/dist ./dist

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

# Security: Run as a non-root user
USER node

# Expose the port your Express app listens on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]