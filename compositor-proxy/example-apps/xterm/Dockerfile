FROM debian:buster-slim

RUN apt-get update && apt-get install -y \
    xterm \
    && rm -rf /var/lib/apt/lists/*

ENV USER=user
RUN adduser --uid 1000 --disabled-password "$USER"

USER "$USER"
ENV HOME="/home/user"
WORKDIR "$HOME"
ENTRYPOINT ["xterm"]
