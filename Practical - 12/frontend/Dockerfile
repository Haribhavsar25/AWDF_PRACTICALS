# Multi-stage Dockerfile for React Frontend (Vite + React 18)
# Stage 1: Build production bundle
FROM node:18-alpine AS build

WORKDIR /app

# Copy package manifests first for caching
COPY package*.json ./

# Install all dependencies including devDependencies required for Vite build
RUN npm install

# Copy source files and compile production bundle
COPY . .
RUN npm run build

# Stage 2: Serve production preview
FROM node:18-alpine

WORKDIR /app

# Install minimal production tooling
COPY package*.json ./
RUN npm install --omit=dev

# Copy built distribution assets from Stage 1
COPY --from=build /app/dist ./dist

# Expose Vite preview port
EXPOSE 5173

# Run Vite preview listening on all network interfaces inside container
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
