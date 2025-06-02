# ---------- Stage 1: Builder ----------
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (frozen lockfile)
RUN npm ci

# Copy entire source
COPY . .

# Build Next.js project
RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /app

# Only copy necessary files for production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start Next.js app in production mode
CMD ["npm", "start"]
    