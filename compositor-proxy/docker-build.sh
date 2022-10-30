#!/bin/bash
set -e
set -x

#tag_postfix=$(date +%Y%m%d%H%M)
tag_postfix=202209132025
tag="docker.io/udevbe/compositor-proxy:${tag_postfix}"

docker build --pull . -t "${tag}"
#docker push "${tag}"

printf "Build and pushed %s" "${tag}"
