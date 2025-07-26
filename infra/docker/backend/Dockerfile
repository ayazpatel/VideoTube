# Backend Production Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S videotube -u 1001 && \
    mkdir -p public/temp && \
    chown -R videotube:nodejs public/temp

USER videotube

EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "start"]
