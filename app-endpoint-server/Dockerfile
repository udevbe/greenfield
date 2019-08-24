# Context for this build should be root of repo.

FROM ubuntu:19.04
RUN apt-get update -qq

# Install gstreamer 1.16 from source
RUN apt-get install -qq build-essential git autoconf pkg-config autopoint libtool bison flex libglib2.0-dev gettext libgl-dev libx264-dev libpng-dev
COPY ext/Video_Codec_SDK_9.0.20/include/ /usr/local/nvidia/
WORKDIR /gstreamer
COPY ext/build_gst_with_nvenc.sh build_gst_with_nvenc.sh
RUN bash build_gst_with_nvenc.sh

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