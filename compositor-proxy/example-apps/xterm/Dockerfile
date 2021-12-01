FROM debian:buster-slim

RUN apt-get update && apt-get install -y \
    xterm \
    && rm -rf /var/lib/apt/lists/*

ENV USER=user
RUN useradd --create-home --uid 1000 "$USER"

USER "$USER"
ENV HOME="/home/$USER"
WORKDIR "$HOME"

ENTRYPOINT ["xterm"]
