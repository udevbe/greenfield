#!/usr/bin/env bash
set -e
source websdk_env.sh

EMSDK_VERSION="3.1.45"
git -C emsdk pull || git clone https://github.com/emscripten-core/emsdk.git emsdk
pushd 'emsdk'
    ./emsdk install ${EMSDK_VERSION}
    ./emsdk activate ${EMSDK_VERSION}
    source ./emsdk_env.sh
popd

printf '%s\n' "[constants]" "toolchain = '$_SDK_DIR/emsdk/upstream/emscripten'" > "$_SDK_DIR/sysrootlibs/emscripten-toolchain.ini"
printf '%s\n' "[constants]" "greenfield_sdk = '$_SDK_DIR'" > "$_SDK_DIR/toolkit/meson-gf-toolchain.ini"

./sysrootlibs/expat/build.sh
./sysrootlibs/libffi/build.sh
./sysrootlibs/wayland/build.sh
./sysrootlibs/wayland-protocols/build.sh
./sysrootlibs/pixman/build.sh
./sysrootlibs/zlib/build.sh
./sysrootlibs/png/build.sh
./sysrootlibs/xml2/build.sh
./sysrootlibs/xkbcommon/build.sh
./sysrootlibs/icu/build.sh
./sysrootlibs/harfbuzz/build_nofreetype_nocairo.sh
./sysrootlibs/freetype/build.sh
./sysrootlibs/harfbuzz/build_freetype_nocairo.sh
./sysrootlibs/harfbuzz/build.sh
./sysrootlibs/fontconfig/build.sh
./sysrootlibs/cairo/build.sh
./sysrootlibs/harfbuzz/build.sh
./sysrootlibs/upoll/build.sh
./sysrootlibs/cygepoll/build.sh
./sysrootlibs/glib/build.sh
./sysrootlibs/fribidi/build.sh
./sysrootlibs/pango/build.sh

