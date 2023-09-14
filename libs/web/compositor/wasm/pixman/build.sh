#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath -- "$0")")"

_SDK_DIR=${_SDK_DIR:-$(dirname "$(readlink -f "$PWD/../build_all.sh")")}
URL='https://gitlab.freedesktop.org/pixman/pixman'
BRANCH='pixman-0.42.2'
NEED_PATCH=false

ensure_repo() {
    git clone --depth 1 --branch "$BRANCH" "$URL" repo
    if [ $NEED_PATCH = true ]; then
        git -C repo apply -v --ignore-space-change --ignore-whitespace ../changes.patch
    fi
}

build() {
    git -C repo pull || ensure_repo
    pushd repo
    	pipx run meson setup build/ --cross-file "${_SDK_DIR}/emscripten-build.ini" --cross-file "${_SDK_DIR}/emscripten-toolchain.ini" \
    	  -Dgtk=disabled -Dlibpng=disabled -Dtests=disabled
	    ninja -C build/
	    emcc -s MODULARIZE=1 -s EXPORT_ES6=1 -s ENVIRONMENT='web' -s SINGLE_FILE=1 -O3 -flto -msimd128 -msse -msse2 -msse3 -msse4.1 -includexmmintrin.h -s EVAL_CTORS=2 ./build/pixman/libpixman-1.a -o ../libpixman.js -s EXPORTED_FUNCTIONS='["_malloc","_free","_pixman_region32_init","_pixman_region32_fini","_pixman_region32_init_rect","_pixman_region32_union","_pixman_region32_intersect","_pixman_region32_union_rect","_pixman_region32_rectangles","_pixman_region32_subtract","_pixman_region32_contains_point","_pixman_region32_copy","_pixman_region32_not_empty","_pixman_region32_contains_rectangle","_pixman_region32_equal","_pixman_region32_clear"]'
    popd
}

build
