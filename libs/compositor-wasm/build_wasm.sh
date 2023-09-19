#!/usr/bin/env bash
set -e

_SDK_DIR=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")
export _SDK_DIR

EMSDK_VERSION="3.1.46"
git -C emsdk pull || git clone https://github.com/emscripten-core/emsdk.git emsdk
pushd 'emsdk'
    ./emsdk install ${EMSDK_VERSION}
    ./emsdk activate ${EMSDK_VERSION}
    source ./emsdk_env.sh
popd

printf '%s\n' "[constants]" "toolchain = '$_SDK_DIR/emsdk/upstream/emscripten'" > "$_SDK_DIR/emscripten-toolchain.ini"

./pixman/build.sh
./xkbcommon/build.sh
