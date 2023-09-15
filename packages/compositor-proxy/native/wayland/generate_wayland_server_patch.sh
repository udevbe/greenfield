#!/bin/bash

generate_wayland_server_patch() {
  pushd native || exit
    diff -urN src/wayland-upstream src/wayland-server > tmp_changes.diff
    error=$?
    if [ $error -eq 0 ]
    then
      rm -rf tmp_changes.diff
      echo "No changes. Did you forget to apply the old patch?"
      exit 1
    elif [ $error -eq 1 ]
    then
      mv tmp_changes.diff changes.diff
      echo "Patch ok"
    else
      rm -rf tmp_changes.diff
      echo "There was something wrong with the diff command"
      exit 1
    fi
  popd || exit
}

generate_wayland_server_patch
