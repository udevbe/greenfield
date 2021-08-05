FROM debian:buster-slim

RUN apt-get update && apt-get install -y \
    gtk-3-examples \
    && rm -rf /var/lib/apt/lists/*

ENV USER=user
RUN adduser --uid 1000 --disabled-password "$USER"

USER "$USER"
ENV HOME="/home/user"
ENV WAYLAND_DISPLAY="wayland-0"
WORKDIR "$HOME"
ENTRYPOINT ["gtk3-demo"]
