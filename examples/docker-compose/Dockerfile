FROM udevbe/compositor-proxy-cli:20231106

RUN apt-get update && apt-get install -y \
    mesa-utils \
    gtk-3-examples \
    gtk-4-examples \
    xterm \
    && rm -rf /var/lib/apt/lists/*
