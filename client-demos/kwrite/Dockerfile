FROM debian:unstable

RUN apt-get update && apt-get install -y \
    kwrite \
    && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["kwrite"]
