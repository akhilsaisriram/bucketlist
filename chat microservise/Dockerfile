# Step 1: Use official Node.js image as the base image
FROM node:22.12.0-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Step 4: Install the dependencies (npm install)
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Expose the port the app runs on (5000 in your case)
EXPOSE 8080

# Step 7: Start the Node.js server (make sure it's set in package.json)
CMD ["npm", "run", "server"]
