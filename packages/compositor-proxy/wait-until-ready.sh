#!/usr/bin/env sh

# If the file is already deleted, the inotify command will exit with an error code, resulting in a k8s pod restart. We add an || true to mitigate this.
inotifywait /var/run/compositor-proxy/starting || true
