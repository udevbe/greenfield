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


EXTRA_LDFLAGS="-g -sTOTAL_MEMORY=256MB --preload-file $DIR/fonts/inter@/usr/share/fonts/opentype/inter"

meson setup --wipe build/ --cross-file "$_SDK_DIR/toolkit/meson-gf-cross.ini" --cross-file "$_SDK_DIR/toolkit/meson-gf-toolchain.ini" -Dprefix="$_SDK_DIR/sysroot" \
-Dbuild-examples=true -Ddemos=false -Dc_link_args="$EXTRA_LDFLAGS"
ninja -C build/ -j10



