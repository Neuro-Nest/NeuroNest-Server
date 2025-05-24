# Use official Node.js image with necessary tools
FROM node:22.1.0

# Set working directory
WORKDIR /app

# Copy dependency and config files first to optimize caching
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies using pnpm
RUN corepack enable && pnpm install

# Copy the rest of the application files
COPY . .

# Conditionally generate Prisma client if schema exists
RUN [ -f "./prisma/schema.prisma" ] && npx prisma generate || echo "Skipping prisma generate"

# Build the project
RUN pnpm run build

# Expose application port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
