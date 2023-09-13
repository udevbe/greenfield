#!/bin/env sh
LD_PRELOAD="./libwayland-server.so.0 ./libwestfield.so ./libproxy-encoding.so" ./compositor-proxy "$@"