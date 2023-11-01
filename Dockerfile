# syntax=docker/dockerfile:1
FROM debian:bookworm-20231009-slim as BUILD

RUN apt-get update && apt-get install  -y --no-install-recommends  \
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
    pipx \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN git clone --depth 1 --branch 1.20 https://gitlab.freedesktop.org/gstreamer/gstreamer.git
RUN  cd /gstreamer \
     && pipx run meson build \
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
      -Dgst-plugins-bad:nvcodec=enabled \
    && ninja -C build

ENV NODE_VERSION="v20.9.0"
ENV NODE_DISTRO="linux-x64"
RUN curl https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-$NODE_DISTRO.tar.xz --output node-$NODE_VERSION-$NODE_DISTRO.tar.xz
RUN tar xvf node-$NODE_VERSION-$NODE_DISTRO.tar.xz
ENV PATH="/node-$NODE_VERSION-$NODE_DISTRO/bin:$PATH"
RUN corepack enable

WORKDIR /app
COPY ["package.json", "yarn.lock", ".yarnrc.yml", "./"]
COPY [".yarn/", "./.yarn/"]
COPY ["libs/xtsb/package.json", "./libs/xtsb/package.json"]
COPY ["libs/compositor-proxy-generator/package.json", "./libs/compositor-proxy-generator/package.json"]
COPY ["packages/compositor-proxy/package.json", "./packages/compositor-proxy/package.json"]
COPY ["packages/compositor-proxy-cli/package.json", "./packages/compositor-proxy-cli/package.json"]
RUN yarn install

COPY ["libs/xtsb/protocol", "libs/xtsb/tsconfig.json", "libs/xtsb/tsconfig.node.json", "./libs/xtsb/"]
COPY ["libs/xtsb/src/", "./libs/xtsb/src/"]
RUN yarn workspace @gfld/xtsb build

COPY ["packages/compositor-proxy/tsconfig.json", "packages/compositor-proxy/CMakeLists.txt", "./packages/compositor-proxy/"]
COPY ["packages/compositor-proxy/native/", "./packages/compositor-proxy/native/"]
COPY ["packages/compositor-proxy/src/", "./packages/compositor-proxy/src/"]
RUN yarn workspace @gfld/compositor-proxy build

COPY ["packages/compositor-proxy-cli/tsconfig.json", "./packages/compositor-proxy-cli/"]
COPY ["packages/compositor-proxy-cli/src/", "./packages/compositor-proxy-cli/src/"]
RUN yarn workspace @gfld/compositor-proxy-cli build
RUN yarn workspace @gfld/compositor-proxy-cli package

FROM debian:bookworm-20231030-slim

COPY --from=BUILD /gstreamer/build/subprojects/gst-plugins-bad/sys/nvcodec/libgstnvcodec.so /usr/lib/x86_64-linux-gnu/gstreamer-1.0/libgstnvcodec.so
COPY 10_nvidia.json /usr/share/glvnd/egl_vendor.d/10_nvidia.json
WORKDIR /app
COPY --from=BUILD /app/packages/compositor-proxy-cli/package/* .
COPY docker-entrypoint.sh .
COPY packages/compositor-proxy-cli/wait-until-ready.sh .

RUN sed -i'' -e 's/main$/main contrib non-free/g' /etc/apt/sources.list.d/debian.sources \
    && apt-get update && apt-get install -y --no-install-recommends \
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
        libdrm-intel1 \
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
        inotify-tools \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /var/run/compositor-proxy-cli && chown 1000:1000 /var/run/compositor-proxy-cli && touch /var/run/compositor-proxy-cli/starting \
    && groupadd --gid 1000 user && useradd --uid 1000 --gid user --shell /bin/bash --create-home user \
    && chown -R 1000:1000 /app

USER 1000
ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]
