FROM ubuntu:20.04
MAINTAINER Erik De Rijcke <erik.de.rijcke@udev.be>

WORKDIR /app

# Install node.js
RUN apt-get update -qq && \
    apt-get install -qq curl && \
    curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get install -y nodejs

# Install sample applications
RUN DEBIAN_FRONTEND=noninteractive apt-get install -qq \
  gtk-3-examples

# Install build dependencies
RUN apt-get install -qq \
  cmake

# Install app-endpoint-server dependencies
RUN apt-get install -qq \
  libffi-dev \
  libgstreamer1.0-dev \
  libgstreamer-plugins-base1.0-dev \
  gstreamer1.0-plugins-good \
  gstreamer1.0-plugins-ugly && \
  npm install -g cmake-js

# Add source files
COPY app-endpoint-server app-endpoint-server

# Enter application directory
WORKDIR /app/app-endpoint-server
RUN npm install && npm run build

# Start server
CMD npm run start
