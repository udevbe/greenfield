#!/usr/bin/env bash
set -e

ARCH=$(uname -m)

mkdir -p /usr/share/glvnd/egl_vendor.d
mv "$PWD"/10_nvidia.json /usr/share/glvnd/egl_vendor.d/10_nvidia.json
mkdir -p "/usr/lib/$ARCH-linux-gnu/gstreamer-1.0/"
mv "$PWD"/libgstnvcodec.so "/usr/lib/$ARCH-linux-gnu/gstreamer-1.0/libgstnvcodec.so"

sed -i'' -e 's/main$/main contrib non-free/g' /etc/apt/sources.list.d/debian.sources
apt-get update && apt-get install -y --no-install-recommends \
    libffi8 \
    libudev1 \
    libgbm1 \
    libgraphene-1.0-0 \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-gl \
    libosmesa6 \
    libdrm2 \
    libopengl0 \
    libglvnd0 \
    libglx0 \
    libglapi-mesa \
    libegl1-mesa \
    libglx-mesa0 \
    libnvidia-egl-wayland1 \
    libnvidia-egl-gbm1 \
    xwayland \
    xauth \
    xxd \
    inotify-tools
apt-get autoremove -y
apt-get clean
mkdir -p /var/run/compositor-proxy-cli && chown 1000:1000 /var/run/compositor-proxy-cli && touch /var/run/compositor-proxy-cli/starting
chown -R 1000:1000 /app
