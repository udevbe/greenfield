#!/usr/bin/env bash

set -e

build () {
    local component
    local "${@}"

    printf "======[ BUILD $component STARTED ]======\n"
    pushd ${component}
    yarn install --frozen-lockfile
    popd
    printf "======[ BUILD $component DONE ]======\n"
}

printf "======[ STARTING BUILDS ]=====\n"
build component=compositor-module
build component=app-endpoint-native
build component=app-endpoint-server
printf "======[ ALL BUILDS DONE ]======\n"

