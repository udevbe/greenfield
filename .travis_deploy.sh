#!/usr/bin/env bash

npm install -g pkg
source ./build-dist.sh
rsync -r --delete-after --quiet dist zubzub@badger.pfoe.be:~
