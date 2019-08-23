FROM ubuntu:19.04
RUN apt-get update -qq

# Install gstreamer 1.16 from source
RUN apt-get install -qq build-essential git autoconf pkg-config autopoint libtool bison flex libglib2.0-dev gettext libgl-dev libx264-dev libpng-dev

WORKDIR /nvenc
curl -O http://developer.download.nvidia.com/compute/nvenc/v5.0/
WORKDIR /gstreamer
COPY app-endpoint-server/build_gst.sh build_gst.sh
RUN bash build_gst.sh

WORKDIR /app

# Install node.js
RUN apt-get install -qq curl && \
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
  libffi-dev && \
  npm install -g cmake-js

# Add source files
COPY app-endpoint-server app-endpoint-server
COPY protocol protocol

# Enter application directory
WORKDIR /app/app-endpoint-server

# Build source
RUN npm install && \
  npm run prepare

# Start server
CMD npm run start