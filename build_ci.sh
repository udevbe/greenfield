#!/usr/bin/env bash

set -e

build () {
    local component
    local "${@}"

    printf "======[ BUILD $component STARTED ]======\n"
    pushd ${component}
    npm ci
    popd
    printf "======[ BUILD $component DONE ]======\n"
}

printf "======[ STARTING BUILDS ]=====\n"
build component=compositor
build component=app-endpoint-server
printf "======[ ALL BUILDS DONE ]======\n"

