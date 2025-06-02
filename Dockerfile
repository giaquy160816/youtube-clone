# ---------- Stage 1: Builder ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY env.local ./.env
RUN npm ci

COPY . .
RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env

EXPOSE 3000
CMD ["npm", "start"]
