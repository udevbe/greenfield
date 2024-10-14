BUILD_SYSROOT="$_SDK_DIR/build-sysroot"
export CHOST="wasm32-unknown-linux" # wasm32-unknown-emscripten

export PKG_CONFIG_PATH=
export PKG_CONFIG_LIBDIR=${BUILD_SYSROOT}/lib/pkgconfig:${BUILD_SYSROOT}/share/pkgconfig
export PKG_CONFIG_SYSROOT_DIR=${BUILD_SYSROOT}
