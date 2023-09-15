#!/usr/bin/env bash
set -e

source ../../websdk_env.sh

EXTRA_LDFLAGS="-s TOTAL_MEMORY=256MB -sEMULATE_FUNCTION_POINTER_CASTS -s PTHREAD_POOL_SIZE=10 -s USE_PTHREADS=1 -s ASYNCIFY \
--preload-file $_SDK_DIR/examples/weston/data@/data --preload-file $_SDK_DIR/examples/weston/fonts/inter@/usr/share/fonts/opentype/inter \
--pre-js $_SDK_DIR/examples/weston/set_env.js"

pipx run meson setup build/ --cross-file "../../toolkit/meson-gf-cross.ini" --cross-file "../../toolkit/meson-gf-toolchain.ini" -Dprefix="${_SDK_DIR}/sysroot" \
-Dimage-jpeg=false -Dimage-webp=false -Dtools=[] -Ddemo-clients=true -Dsimple-clients=[] \
-Dc_link_args="$EXTRA_LDFLAGS"
ninja -C build/

