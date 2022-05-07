# syntax=docker/dockerfile:1
FROM node:16-buster-slim as BUILD

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    libffi-dev \
    libgstreamer1.0-dev \
    libgstreamer-plugins-base1.0-dev \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-ugly \
    libosmesa6 \
    libegl1-mesa \
    libgbm1 \
    libwayland-egl1-mesa \
    libwayland-server0 \
    xwayland \
    xauth \
    xxd \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]
RUN yarn global add cmake-js
RUN yarn install

COPY . .
RUN yarn generate
RUN yarn build

FROM node:16-buster-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    libffi6 \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-gl \
    libosmesa6 \
    libegl1-mesa \
    libgbm1 \
    libwayland-egl1-mesa \
    xwayland \
    xauth \
    xxd \
    inotify-tools \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=BUILD /app/package.json .
COPY --from=BUILD /app/yarn.lock .
COPY --from=BUILD /app/dist .
COPY --from=BUILD /app/docker-entrypoint.sh .
RUN yarn install --production --ignore-optional
COPY --from=BUILD /app/node_modules/westfield-proxy /app/node_modules/westfield-proxy
COPY --from=BUILD /app/node_modules/epoll /app/node_modules/epoll
COPY --from=BUILD /app/node_modules/bindings /app/node_modules/bindings
COPY --from=BUILD /app/node_modules/file-uri-to-path /app/node_modules/file-uri-to-path

ENV NODE_ENV=production
WORKDIR /home/node

RUN usermod -a -G video node
RUN mkdir -p /var/run/compositor-proxy && chown 1000:1000 /var/run/compositor-proxy && touch /var/run/compositor-proxy/starting
COPY wait-until-ready.sh /app
CMD ["setpriv", "--reuid=1000", "--regid=1000", "--init-groups", "sh", "/app/docker-entrypoint.sh"]
