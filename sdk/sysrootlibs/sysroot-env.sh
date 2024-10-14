SYSROOT="$_SDK_DIR/sysroot"
export CHOST="wasm32-unknown-linux" # wasm32-unknown-emscripten

export PKG_CONFIG_PATH=
export PKG_CONFIG_LIBDIR=${SYSROOT}/lib/pkgconfig:${SYSROOT}/share/pkgconfig
export PKG_CONFIG_SYSROOT_DIR=${SYSROOT}
