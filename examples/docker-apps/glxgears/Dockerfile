FROM debian:bookworm-20231030-slim
RUN sed -i'' -e 's/main$/main contrib non-free/g' /etc/apt/sources.list.d/debian.sources
RUN apt-get update && apt-get install -y \
    libopengl0 \
    libglvnd0 \
    libglx0 \
    libglapi-mesa \
    libegl1-mesa \
    libglx-mesa0 \
    libnvidia-egl-wayland1 \
    libnvidia-egl-gbm1 \
    mesa-utils \
    mesa-utils-bin \
    && rm -rf /var/lib/apt/lists/*

ENV USER=user
RUN useradd --create-home --uid 1000 "$USER"

USER "$USER"
ENV HOME="/home/$USER"
WORKDIR "$HOME"

ENTRYPOINT ["glxgears"]
