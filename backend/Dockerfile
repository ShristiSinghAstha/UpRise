# ==========================================
# Phase 1: Base & Dependencies
# ==========================================
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ==========================================
# Phase 2: Development Environment
# ==========================================
FROM base AS development
RUN npm install --prefer-offline --retry=3
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

# ==========================================
# Phase 3: Production Release
# ==========================================
FROM base AS production
# Only install production dependencies for a lighter image size
RUN npm install --only=production --prefer-offline --retry=3
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
