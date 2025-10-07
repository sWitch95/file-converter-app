FROM node:18-alpine

# Install LibreOffice for document conversion
RUN apk add --no-cache \
    libreoffice \
    ttf-dejavu \
    fontconfig

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create directories for file storage
RUN mkdir -p /tmp/uploads /tmp/outputs

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Start the server
CMD ["node", "index.js"]
