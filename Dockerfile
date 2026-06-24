FROM node:20-slim

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN rm -f package-lock.json && npm install

# Copy all source files
COPY . .

# Build frontend (Vite) + bundle server (esbuild) → dist/server.cjs
RUN npm run build

# Expose the port your Express server listens on
EXPOSE 3000

# Start the compiled server
CMD ["node", "dist/server.cjs"]