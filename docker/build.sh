#!/bin/bash
set -e
set -x

tag_postfix=$(date +%Y%m%d)
tag="docker.io/udevbe/compositor-proxy-cli:${tag_postfix}"

docker build --pull .. -t "${tag}" -f Dockerfile
printf "Build complete %s\n" "${tag}"
