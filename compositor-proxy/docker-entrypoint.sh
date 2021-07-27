#!/bin/env sh

touch "$XAUTHORITY"
xauth add "${HOST}":0 . "$(xxd -l 16 -p /dev/urandom)"
node /app/dist/index.js
