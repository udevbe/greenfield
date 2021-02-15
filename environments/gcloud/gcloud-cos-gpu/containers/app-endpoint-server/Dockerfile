# Context for this build should be root of repo because of reasons.
FROM nvidia/cudagl:11.2.0-devel-ubuntu20.04
MAINTAINER Erik De Rijcke <erik.de.rijcke@udev.be>

ENV NVIDIA_VISIBLE_DEVICES=all
ENV NVIDIA_DRIVER_CAPABILITIES=all
ENV GST_GL_WINDOW=egl-device

ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update -qq && \
    apt-get install -qq -y \
        libdrm-dev \
        build-essential \
        python3 \
        python3-pip \
        python3-setuptools \
        python3-wheel \
        ninja-build \
        bison \
        git \
        flex \
        libglib2.0-dev \
        gettext \
        libx264-dev \
        libpng-dev \
        curl \
        cmake \
        libffi-dev \
     && curl -sL https://deb.nodesource.com/setup_12.x | bash - \
     && apt-get install -qq -y \
        nodejs \
        gtk-3-examples \
        kwrite \
     && rm -rf /var/lib/apt/lists/*
RUN cd /root && pip3 install meson && cd /

WORKDIR /gstreamer

# setup gstreamer install script & environment
COPY environments/gcloud/gcloud-cos-gpu/containers/app-endpoint-server/build_gst_with_nvenc.sh build_gst_with_nvenc.sh
#ENV LD_LIBRARY_PATH $LD_LIBRARY_PATH:"/usr/local/lib/:/usr/local/nvidia/lib64/"

# Install gstreamer master from source
RUN bash build_gst_with_nvenc.sh

WORKDIR /app
COPY app-endpoint-server app-endpoint-server

# Enter application directory
WORKDIR /app/app-endpoint-server
# Install app-endpoint-server dependencies
RUN npm install -g cmake-js yarn
# Build source
RUN yarn install && \
  yarn generate && \
  yarn build

# Start server
CMD npm run start
