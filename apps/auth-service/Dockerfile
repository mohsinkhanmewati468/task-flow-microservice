# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (cached layer)
COPY package*.json ./
RUN npm install

COPY . .


# Build only auth-service
RUN npm run build auth-service


# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Expose port (adjust if needed)
EXPOSE 3001

# Run service
CMD ["node", "dist/apps/auth-service/main.js"]