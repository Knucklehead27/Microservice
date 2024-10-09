# Specify the base image
FROM node:20.9.0

# Create app directory inside the image
WORKDIR /usr/src/app

# Install nodemon globally
RUN npm install -g nodemon

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

RUN npm install

# Bundle app source inside Docker image
COPY . .

# app binds to port 7070 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 7070

# Define the command to run your app
CMD [ "nodemon" ]
