# Multi-stage build for React frontend
FROM node:18 AS build
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Add missing babel plugin to resolve warnings
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Optional: Custom nginx configuration for SPA routing
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]