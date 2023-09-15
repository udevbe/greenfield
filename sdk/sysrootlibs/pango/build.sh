#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")";

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../../build_sysroot.sh")")}
URL='https://gitlab.gnome.org/GNOME/pango.git'
BRANCH='1.51.1'
NEED_PATCH=true

ensure_repo() {
    git clone --depth 1 --branch "$BRANCH" "$URL" repo
    if [ $NEED_PATCH = true ]; then
        git -C repo apply -v --ignore-space-change --ignore-whitespace ../changes.patch
    fi
}

build() {
    git -C repo pull || ensure_repo
    pushd repo
    	pipx run meson setup build/ --cross-file "${_SDK_DIR}/sysrootlibs/emscripten-toolchain.ini" --cross-file "${_SDK_DIR}/sysrootlibs/pango/emscripten-build.ini" -Dprefix="${_SDK_DIR}/sysroot" --pkg-config-path="${_SDK_DIR}/sysroot/lib/pkgconfig" \
    	  -Dgtk_doc=false -Dintrospection=disabled -Dinstall-tests=false -Dfontconfig=enabled -Dsysprof=disabled -Dlibthai=disabled -Dcairo=enabled \
    	  -Dxft=disabled -Dfreetype=enabled
	    ninja -C build/ install
    popd
}

build
