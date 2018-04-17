#!/usr/bin/env bash

DIST_DIR="dist"
FIX_WRTC_REQUIRE_PATCH="fixup_wrtc_native_module_require.patch"
RUN_GF_FILE="greenfield"
RUN_GF_PROD_FILE="run_greenfield_prod.sh"

function ensure_dist_dir {
    if [ -d ${DIST_DIR} ]; then
      rm -rf ${DIST_DIR}
    fi
    mkdir -p ${DIST_DIR}
}

function build_dist {
    rm -rf "node_modules"
    npm install
    patch -p0 < ${FIX_WRTC_REQUIRE_PATCH}
    pkg -t node9-linux-x64 ./package.json --output ${DIST_DIR}/${RUN_GF_FILE}
    echo -e '#!/usr/bin/env bash\n\nNODE_ENV=production ./greenfield' > ${DIST_DIR}/${RUN_GF_PROD_FILE}
    chmod +x ./dist/${RUN_GF_PROD_FILE}
}

function add_native_modules {
    cp ./node_modules/gstreamer-superficial/build/Release/gstreamer-superficial.node ${DIST_DIR}
    cp ./node_modules/socketwatcher/build/Release/socketwatcher.node ${DIST_DIR}
    cp ./node_modules/wrtc/build/Release/wrtc.node ${DIST_DIR}
}

function main {
    ensure_dist_dir
    build_dist
    add_native_modules
}

main
