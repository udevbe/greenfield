# syntax=docker/dockerfile:1
FROM node:16-buster-slim

RUN apt-get update && apt-get install -y \
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
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]
RUN yarn global add cmake-js
RUN yarn install

COPY . .
RUN yarn generate
RUN yarn build

ENV NODE_ENV=production
WORKDIR /home/node

RUN usermod -a -G video node
CMD ["setpriv", "--reuid=1000", "--regid=1000", "--init-groups", "node", "/app/dist/index.js"]
