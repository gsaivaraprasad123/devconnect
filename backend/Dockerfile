FROM node:18-alpine

# Install libc6-compat for Prisma binary compatibility
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the project
COPY . .

# Generate Prisma client inside container for Linux runtime
RUN npx prisma generate

# Expose app port
EXPOSE 3000

# Run in dev mode (you can change to "start" for production)
CMD ["npm", "run", "dev"]
