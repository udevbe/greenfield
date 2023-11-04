#!/usr/bin/env bash
set -e

if [ -z "$TARGETARCH" ]; then
  printf "TARGETARCH must be set by docker build. Exiting.\n"
  exit 1;
fi

NODE_VERSION="v20.9.0"
NODE_DISTRO=linux-$(if [ "$TARGETARCH" == "amd64" ];then printf "x64"; else printf "%s" "$TARGETARCH"; fi)

printf "building for arch %s\n" "$ARCH"

apt-get update
apt-get install  -y --no-install-recommends  \
    cmake \
    build-essential \
    ninja-build \
    pkg-config \
    libffi-dev \
    libudev-dev \
    libgbm-dev \
    libdrm-dev \
    libegl-dev \
    libopengl-dev \
    libglib2.0-dev \
    libgstreamer1.0-dev \
    libgstreamer-plugins-base1.0-dev \
    libgstreamer-plugins-bad1.0-dev \
    libgraphene-1.0-dev \
    git \
    python3 \
    python3-distutils \
    curl \
    ca-certificates \
    flex \
    bison \
    liborc-0.4-dev-bin \
    pipx
apt-get autoremove -y
apt-get clean
rm -rf /var/lib/apt/lists/*
git clone --depth 1 --branch 1.20 https://gitlab.freedesktop.org/gstreamer/gstreamer.git
cd gstreamer
pipx run meson build \
        --buildtype=release \
        --strip \
        -Dgpl=enabled \
        -Dorc=enabled \
        -Dbase=enabled \
        -Dgood=enabled \
        -Dbad=enabled \
        -Dugly=enabled \
        -Dauto_features=disabled \
        -Dgst-plugins-base:app=enabled \
        -Dgst-plugins-base:gl=enabled \
        -Dgst-plugins-base:gl-graphene=enabled \
        -Dgst-plugins-base:gl_winsys=egl \
        -Dgst-plugins-base:gl_api=opengl \
        -Dgst-plugins-bad:gl=enabled \
        -Dgst-plugins-bad:nvcodec=enabled
ninja -C build
curl https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-"$NODE_DISTRO".tar.xz --output node-$NODE_VERSION-"$NODE_DISTRO".tar.xz \
    && tar xvf node-$NODE_VERSION-"$NODE_DISTRO".tar.xz
export PATH="$PWD/node-$NODE_VERSION-$NODE_DISTRO/bin:$PATH"
corepack enable
yarn install
yarn workspace @gfld/xtsb build
yarn workspace @gfld/compositor-proxy build
yarn workspace @gfld/compositor-proxy-cli build
yarn workspace @gfld/compositor-proxy-cli package