_SDK_DIR=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")
export _SDK_DIR
export PKG_CONFIG_PATH="$_SDK_DIR/sysroot/lib/pkgconfig:$_SDK_DIR/sysroot/share/pkgconfig"
export PATH="$PATH:$_SDK_DIR/toolkit/bin"
export PKG_CONFIG="$_SDK_DIR/toolkit/bin/pkg-config"
