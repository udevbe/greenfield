#!/usr/bin/env bash
set -e

EMSDK_VERSION="3.1.68"
git -C emsdk pull || git clone https://github.com/emscripten-core/emsdk.git emsdk
pushd 'emsdk'
    ./emsdk install ${EMSDK_VERSION}
    ./emsdk activate ${EMSDK_VERSION}
popd

_SDK_DIR=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")
export _SDK_DIR

cat > "$_SDK_DIR/sysrootlibs/emscripten-toolchain.ini" <<- EOF
[constants]
toolchain = '$_SDK_DIR/emsdk/upstream/emscripten'

[properties]
sys_root = '$_SDK_DIR/sysroot'
pkg_config_libdir = '$_SDK_DIR/sysroot'

[built-in options]
pkg_config_path = '$_SDK_DIR/sysroot/lib/pkgconfig:$_SDK_DIR/sysroot/share/pkgconfig'
prefix = '$_SDK_DIR/sysroot'
EOF

cat > "$_SDK_DIR/toolkit/meson-gf-toolchain.ini" <<- EOF
[constants]
greenfield_sdk = '$_SDK_DIR'
EOF

./sysrootlibs/expat/build.sh
./sysrootlibs/libffi/build.sh
./sysrootlibs/wayland/build.sh
./sysrootlibs/wayland-protocols/build.sh
./sysrootlibs/pixman/build.sh
./sysrootlibs/zlib/build.sh
./sysrootlibs/png/build.sh
./sysrootlibs/xml2/build.sh
./sysrootlibs/xkeyboard-config/build.sh
./sysrootlibs/xkbcommon/build.sh
./sysrootlibs/icu/build.sh
./sysrootlibs/harfbuzz/build_nofreetype_nocairo_noglib.sh
./sysrootlibs/freetype/build.sh
./sysrootlibs/harfbuzz/build_freetype_nocairo_noglib.sh
./sysrootlibs/fontconfig/build.sh
./sysrootlibs/pcre2/build.sh
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
./sysrootlibs/graphene/build.sh
./sysrootlibs/sass/build.sh
./sysrootlibs/sassc/build.sh
./sysrootlibs/uapi-stub/build.sh
./sysrootlibs/gtk4/build.sh
