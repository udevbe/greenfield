#!/usr/bin/env bash

set -e

build () {
    local component
    local "${@}"

    printf "\n======[ BUILD $component. ]======\n\n"
    pushd ${component}
    npm ci
    popd
    printf "\n======[ BUILD $component DONE. ]======\n"
}

printf "\n======[ START BUILD ]=====\n"
build component=compositor
build component=app-endpointd
printf "\n======[ BUILD DONE ]======\n"

