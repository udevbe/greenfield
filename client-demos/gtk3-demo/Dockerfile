FROM debian:unstable

RUN apt-get update && apt-get install -y \
    gtk-3-examples \
    && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["gtk3-demo"]
