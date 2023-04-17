# syntax=docker/dockerfile:1
FROM debian:bookworm-20230411-slim as BUILD

RUN apt-get update && apt-get install  -y --no-install-recommends  \
    nodejs \
    npm \
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

# build gstreamer from source
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

WORKDIR /app
RUN npm install --global yarn
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install
COPY . .
RUN yarn generate
RUN yarn build
RUN yarn package

FROM debian:bookworm-20230411-slim
RUN sed -i'' -e 's/main$/main contrib non-free/g' /etc/apt/sources.list.d/debian.sources
RUN apt-get update && apt-get install -y --no-install-recommends \
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
    libnode108 \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=BUILD /gstreamer/build/subprojects/gst-plugins-bad/sys/nvcodec/libgstnvcodec.so /usr/lib/x86_64-linux-gnu/gstreamer-1.0/libgstnvcodec.so
COPY 10_nvidia.json /usr/share/glvnd/egl_vendor.d/10_nvidia.json

WORKDIR /app
COPY --from=BUILD /app/package/ .
COPY docker-entrypoint.sh .

RUN mkdir -p /var/run/compositor-proxy && chown 1000:1000 /var/run/compositor-proxy && touch /var/run/compositor-proxy/starting
COPY wait-until-ready.sh /app

RUN groupadd --gid 1000 user && useradd --uid 1000 --gid user --shell /bin/bash --create-home user
RUN chown -R 1000:1000 /app
USER 1000
ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]
