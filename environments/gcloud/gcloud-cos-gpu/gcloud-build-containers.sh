#!/usr/bin/env bash
set -e

build_app_endpiont_server() {
    pushd containers/app-endpoint-server
        gcloud builds submit ../../../../..
    popd
}

build_xnvidia() {
    pushd containers/xnvidia
        gcloud builds submit .
    popd
}

main() {
    build_app_endpiont_server
    build_xnvidia
}

main
