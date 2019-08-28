#!/bin/bash

# Set your target branch
BRANCH="1.16.0"

exec > >(tee build-gstreamer.log)
exec 2>&1

[ ! -d orc ] && git clone git://anongit.freedesktop.org/git/gstreamer/orc
[ ! -d gstreamer ] && git clone git://anongit.freedesktop.org/git/gstreamer/gstreamer
[ ! -d gst-plugins-base ] && git clone git://anongit.freedesktop.org/git/gstreamer/gst-plugins-base
[ ! -d gst-plugins-good ] && git clone git://anongit.freedesktop.org/git/gstreamer/gst-plugins-good
[ ! -d gst-plugins-bad ] && git clone git://anongit.freedesktop.org/git/gstreamer/gst-plugins-bad
[ ! -d gst-plugins-ugly ] && git clone git://anongit.freedesktop.org/git/gstreamer/gst-plugins-ugly

cd orc
./autogen.sh --disable-gtk-doc
make
make install
cd ..

cd gstreamer
git checkout $BRANCH
./autogen.sh --disable-gtk-doc
make
make install
cd ..

cd gst-plugins-base
git checkout $BRANCH
# TODO disable unused plugins
./autogen.sh --disable-gtk-doc --enable-opengl
make
make install
cd ..

cd gst-plugins-good
git checkout $BRANCH
# TODO disable unused plugins
./autogen.sh --disable-gtk-doc
make
make install
cd ..

cd gst-plugins-bad
git checkout $BRANCH
# TODO disable unused plugins
./autogen.sh --disable-gtk-doc --enable-orc NVENCODE_CFLAGS="-I/usr/local/nvidia/include" NVENCODE_LIBS="-L/usr/local/nvidia/lib64/" --with-cuda-prefix="/usr"
make
make install
cd ..

cd gst-plugins-ugly
git checkout $BRANCH
./autogen.sh --disable-gtk-doc --enable-orc
make
make install
cd ..


ldconfig