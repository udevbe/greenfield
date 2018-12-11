#!/usr/bin/env bash

set -ev

build_compositor() {
    printf "\n======[ Build compositor. ]======\n\n"
    pushd compositor
    npm ci
    popd
}

build_app_endpointd() {
    printf "\n======[ Build app-endpointd. ]======\n\n"
    pushd compositor
    npm ci
    popd
}

printf "\n======[ START BUILD ]=====\n"
build_compositor
build_app_endpointd
printf "\n======[ BUILD DONE ]======\n"

