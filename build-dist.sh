#!/usr/bin/env bash

DIST_DIR="dist"
FIX_WRTC_REQUIRE_PATCH="fix_wrtc_native_module_require.patch"
FIX_FASTCALL_REQUIRE_REF_PATCH="fix_fastcall_native_module_require_ref.patch"
FIX_FASTCALL_REQUIRE_FASTCALL_PATCH="fix_fastcall_native_module_require_fastcall.patch"
FIX_FASTCALL_OPTIMIZATION_FLAG_PATCH="fix_fastcall_native_module_optimization_flag.patch"
FIX_EPOLL_REQUIRE_EPOLL_PATCH="fix_epoll_native_module_require_epoll.patch"

RUN_GF_FILE="greenfield"

function ensure_dist_dir {
    if [ -d ${DIST_DIR} ]; then
      rm -rf ${DIST_DIR}
    fi
    mkdir -p ${DIST_DIR}
}

function build_dist {
    patch -p0 < ${FIX_WRTC_REQUIRE_PATCH}
    patch -p0 < ${FIX_FASTCALL_REQUIRE_REF_PATCH}
    patch -p0 < ${FIX_FASTCALL_REQUIRE_FASTCALL_PATCH}
    patch -p0 < ${FIX_EPOLL_REQUIRE_EPOLL_PATCH}
    patch -p0 < ${FIX_FASTCALL_OPTIMIZATION_FLAG_PATCH}
    npm build ./node_modules/fastcall
    pkg -t node9-linux-x64 ./package.json --output ${DIST_DIR}/${RUN_GF_FILE}
}

function add_native_modules {
    cp ./node_modules/gstreamer-superficial/build/Release/gstreamer-superficial.node ${DIST_DIR}
    cp ./node_modules/epoll/build/Release/socketwatcher.node ${DIST_DIR}
    cp ./node_modules/wrtc/build/Release/wrtc.node ${DIST_DIR}
    cp ./node_modules/fastcall/build/Release/ref.node ${DIST_DIR}
    cp ./node_modules/fastcall/build/Release/fastcall.node ${DIST_DIR}
}

function main {
    ensure_dist_dir
    build_dist
    add_native_modules
}

main
