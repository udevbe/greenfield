#!/bin/env bash
set -e
touch "$XAUTHORITY"
xauth add "${HOST}":1 . "$(xxd -l 16 -p /dev/urandom)"

BASEDIR=$(dirname "$0")
"$BASEDIR"/compositor-proxy-cli "$@"
