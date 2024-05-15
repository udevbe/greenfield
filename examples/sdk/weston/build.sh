#!/usr/bin/env bash
set -e

source ../../../sdk/sdk_env.sh

CURRENT_SCRIPT=
DIR="."

if [ -n "${BASH_SOURCE-}" ]; then
  CURRENT_SCRIPT="$BASH_SOURCE"
elif [ -n "${ZSH_VERSION-}" ]; then
  CURRENT_SCRIPT="${(%):-%x}"
elif [ -n "${KSH_VERSION-}" ]; then
  CURRENT_SCRIPT=${.sh.file}
fi
DIR=$(dirname "$(readlink -f "$CURRENT_SCRIPT")")


EXTRA_LDFLAGS="-s TOTAL_MEMORY=256MB -sEMULATE_FUNCTION_POINTER_CASTS \
--preload-file $DIR/data@/data --preload-file $DIR/fonts/inter@/usr/share/fonts/opentype/inter --pre-js $DIR/set_env.js"

pipx run meson setup --wipe build/ --cross-file "$_SDK_DIR/toolkit/meson-gf-cross.ini" --cross-file "$_SDK_DIR/toolkit/meson-gf-toolchain.ini" -Dprefix="$_SDK_DIR/sysroot" \
-Dimage-jpeg=false -Dimage-webp=false -Dtools=[] -Ddemo-clients=true -Dsimple-clients=shm \
-Dc_link_args="$EXTRA_LDFLAGS"
ninja -C build/

