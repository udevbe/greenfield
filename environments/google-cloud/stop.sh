#!/usr/bin/env bash

main() {
    docker run --rm \
        -v /var/run/docker.sock:/var/run/docker.sock \
        -v "$PWD/../..:$PWD/../.." \
        -w="$PWD/../.." \
        docker/compose:1.24.1 -f "$PWD/docker-compose.yml" down
}

main