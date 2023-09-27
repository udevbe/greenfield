CURRENT_SCRIPT=
_SDK_DIR="."

if [ -n "${BASH_SOURCE-}" ]; then
  CURRENT_SCRIPT="$BASH_SOURCE"
elif [ -n "${ZSH_VERSION-}" ]; then
  CURRENT_SCRIPT="${(%):-%x}"
elif [ -n "${KSH_VERSION-}" ]; then
  CURRENT_SCRIPT=${.sh.file}
fi

_SDK_DIR=$(dirname "$(readlink -f "$CURRENT_SCRIPT")")
export PKG_CONFIG_LIBDIR="$_SDK_DIR/sysroot/lib/pkgconfig:$_SDK_DIR/sysroot/share/pkgconfig:$_SDK_DIR/build-sysroot/lib/pkgconfig"

export _SDK_DIR
export PATH="$_SDK_DIR/toolkit/bin:$PATH"
