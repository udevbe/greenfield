# syntax=docker/dockerfile:1
FROM debian:bookworm-20240904-slim AS build
ARG TARGETARCH

WORKDIR /app

COPY ["package.json", "yarn.lock", ".yarnrc.yml", "./"]
COPY [".yarn/", "./.yarn/"]

COPY ["libs/compositor-proxy-generator/package.json", "./libs/compositor-proxy-generator/package.json"]

COPY ["libs/xtsb/package.json", "./libs/xtsb/package.json"]
COPY ["libs/xtsb/tsconfig.json", "libs/xtsb/tsconfig.node.json", "./libs/xtsb/"]
COPY ["libs/xtsb/src/", "./libs/xtsb/src/"]

COPY ["packages/compositor-proxy/package.json", "./packages/compositor-proxy/package.json"]
COPY ["packages/compositor-proxy/tsconfig.json", "packages/compositor-proxy/CMakeLists.txt", "./packages/compositor-proxy/"]
COPY ["packages/compositor-proxy/native/", "./packages/compositor-proxy/native/"]
COPY ["packages/compositor-proxy/src/", "./packages/compositor-proxy/src/"]

COPY ["packages/compositor-proxy-cli/package.json", "./packages/compositor-proxy-cli/package.json"]
COPY ["packages/compositor-proxy-cli/tsconfig.json", "./packages/compositor-proxy-cli/tsconfig.json"]
COPY ["packages/compositor-proxy-cli/src/", "./packages/compositor-proxy-cli/src/"]

COPY ["docker/compositor-proxy-cli-build.sh", "./compositor-proxy-cli-build.sh"]
RUN ./compositor-proxy-cli-build.sh

FROM debian:bookworm-20240904-slim

WORKDIR /app

COPY --from=build ["/app/gstreamer/build/subprojects/gst-plugins-bad/sys/nvcodec/libgstnvcodec.so", "./libgstnvcodec.so"]
COPY --from=build ["/app/packages/compositor-proxy-cli/package/*", "./"]
COPY ["docker/docker-entrypoint.sh", "./docker-entrypoint.sh"]
COPY ["packages/compositor-proxy-cli/wait-until-ready.sh", "./wait-until-ready.sh"]
COPY ["docker/10_nvidia.json", "./10_nvidia.json"]

COPY ["docker/compositor-proxy-cli-install.sh", "./compositor-proxy-cli-install.sh"]
RUN ./compositor-proxy-cli-install.sh && rm compositor-proxy-cli-install.sh

RUN groupadd --gid 1000 user && useradd --uid 1000 --gid user --shell /bin/bash --create-home user
ENV HOME=/home/user
WORKDIR "$HOME"

ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]
