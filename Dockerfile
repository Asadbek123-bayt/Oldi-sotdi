# Multi-stage Dockerfile for AVTOBOZOR.UZ
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production server stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
COPY server.js ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "server.js"]
