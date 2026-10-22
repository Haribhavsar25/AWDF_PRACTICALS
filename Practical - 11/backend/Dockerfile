# Backend Dockerfile for Node.js Express REST API
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start Express server
CMD ["node", "server.js"]
