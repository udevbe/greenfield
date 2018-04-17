#!/usr/bin/env bash

source ./build-dist.sh

eval "$(ssh-agent -s)"
chmod 600 .id_rsa
ssh-add .id_rsa
tar zcvf dist.tar.gz ${DIST_DIR}
scp zubzub@badger.pfoe.be:~