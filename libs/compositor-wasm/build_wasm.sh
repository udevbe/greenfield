#!/usr/bin/env bash
set -e

PACKAGE_DIR=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")
export PACKAGE_DIR

EMSDK_VERSION="3.1.68"
git -C emsdk pull || git clone https://github.com/emscripten-core/emsdk.git emsdk
pushd 'emsdk'
    ./emsdk install ${EMSDK_VERSION}
    ./emsdk activate ${EMSDK_VERSION}
    source ./emsdk_env.sh
popd

printf '%s\n' "[constants]" "toolchain = '$PACKAGE_DIR/emsdk/upstream/emscripten'" > "$PACKAGE_DIR/emscripten-toolchain.ini"

./xkbcommon/build.sh
./pixman/build.sh
