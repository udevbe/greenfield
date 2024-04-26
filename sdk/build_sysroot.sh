#!/usr/bin/env bash
set -e

EMSDK_VERSION="3.1.55"
git -C emsdk pull || git clone https://github.com/emscripten-core/emsdk.git emsdk
pushd 'emsdk'
    ./emsdk install ${EMSDK_VERSION}
    ./emsdk activate ${EMSDK_VERSION}
popd

_SDK_DIR=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")
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
./sysrootlibs/harfbuzz/build_nofreetype_nocairo_noglib.sh
./sysrootlibs/freetype/build.sh
./sysrootlibs/harfbuzz/build_freetype_nocairo_noglib.sh
./sysrootlibs/fontconfig/build.sh
./sysrootlibs/glib/build.sh
./sysrootlibs/jpeg/build.sh
./sysrootlibs/cairo/build.sh
./sysrootlibs/harfbuzz/build.sh
./sysrootlibs/upoll/build.sh
./sysrootlibs/cygepoll/build.sh
./sysrootlibs/fribidi/build.sh
./sysrootlibs/tiff4/build.sh
./sysrootlibs/pango/build.sh
./sysrootlibs/gdk-pixbuf/build.sh
./sysrootlibs/egl-stub/build.sh
./sysrootlibs/glesv2-stub/build.sh
./sysrootlibs/epoxy-emscripten/build.sh
./sysrootlibs/gtk4/build.sh

