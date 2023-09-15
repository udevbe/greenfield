FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    libopengl0 \
    libglvnd0 \
    libegl1-mesa \
    libnvidia-egl-wayland1 \
    gtk-4-examples \
    && rm -rf /var/lib/apt/lists/*

COPY 10_nvidia.json /usr/share/glvnd/egl_vendor.d/10_nvidia.json

ENV USER=user
RUN useradd --create-home --uid 1000 "$USER"

USER "$USER"
ENV HOME="/home/$USER"
WORKDIR "$HOME"

ENV WAYLAND_DISPLAY="wayland-0"
ENTRYPOINT ["gtk4-demo"]
