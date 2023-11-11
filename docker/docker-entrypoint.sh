#!/bin/env sh
set -e
touch "$XAUTHORITY"
xauth add "${HOST}":1 . "$(xxd -l 16 -p /dev/urandom)"
. ./compositor-proxy-cli "$@"