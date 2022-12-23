# Pull Docker Hub base image
FROM node:14-alpine
# Set working directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn* ./

RUN apk update 
RUN apk add git

# Install app dependencies
RUN yarn

# Copy app to container
COPY . .

# Run the "start" script in package.json
CMD ["npm", "run", "start"]
