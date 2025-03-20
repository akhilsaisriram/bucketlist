
# FROM node:22-alpine AS build

# # Set the working directory
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the source code
# COPY . .

# RUN npm run build
# # # Expose the port the React development server listens on
# # EXPOSE 3000

# # # Start the React app
# # CMD ["npm", "start"]

# FROM nginx:alpine

# COPY --from=build /usr/src/app/build /usr/share/nginx/html

# EXPOSE 80
# CMD [ "nginx" , "-g" , "daemon off;"]

# Build Stage
# FROM node:22-alpine AS build

# # Set working directory
# WORKDIR /usr/src/app

# # Copy package files and install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy the rest of the app's source code
# COPY . .

# ENV REACT_APP_BASE_URL=http://localhost:8000

# # Build the React app
# RUN npm run build

# # Production Stage
# FROM nginx:alpine

# # Copy build files to Nginx web server directory
# COPY --from=build /usr/src/app/build /usr/share/nginx/html

# # Custom Nginx configuration to handle React routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port 80 for the web server
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]
# Build Stage
FROM node:22-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the React app
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy build files to Nginx web server directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script for dynamic env variables
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 80 for the web server
EXPOSE 80

# Run entrypoint script before starting Nginx
CMD ["/docker-entrypoint.sh"]
