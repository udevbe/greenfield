#!/bin/bash
set -e
set -x

tag_postfix=$(date +%Y%m%d)
tag="docker.io/udevbe/compositor-proxy:${tag_postfix}"

docker build --pull . -t "${tag}"
docker push "${tag}"

printf "Build and pushed %s" "${tag}"
