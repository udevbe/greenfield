#!/usr/bin/env bash
set -e

build_app_endpiont_server() {
    pushd containers/app-endpoint-server
        gcloud builds submit ../../../../..
    popd
}

main() {
    build_app_endpiont_server
}

main
