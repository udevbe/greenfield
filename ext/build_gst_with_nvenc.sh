#!/bin/bash

# Set your target branch
BRANCH="master"

exec > >(tee build-gstreamer.log)
exec 2>&1

[ ! -d orc ] && git clone git://anongit.freedesktop.org/git/gstreamer/orc
[ ! -d gstreamer ] && git clone git://anongit.freedesktop.org/git/gstreamer/gstreamer
[ ! -d gst-plugins-base ] && git clone git://anongit.freedesktop.org/git/gstreamer/gst-plugins-base
[ ! -d gst-plugins-good ] && git clone git://anongit.freedesktop.org/git/gstreamer/gst-plugins-good
[ ! -d gst-plugins-bad ] && git clone https://gitlab.freedesktop.org/zubzub/gst-plugins-bad.git
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
DISABLED_BAG_PLUGINS="--disable-accurip \
 --disable-adpcmdec \
 --disable-adpcmenc  \
 --disable-aiff \
 --disable-videoframe_audiolevel \
 --disable-asfmux  \
 --disable-audiobuffersplit \
 --disable-audiofxbad \
 --disable-audiolatency  \
 --disable-audiomixmatrix \
 --disable-audiovisualizers \
 --disable-autoconvert \
 --disable-bayer \
 --disable-camerabin2  \
 --disable-coloreffects \
 --disable-debugutils \
 --disable-dvbsuboverlay \
 --disable-dvdspu  \
 --disable-faceoverlay  \
 --disable-festival  \
 --disable-fieldanalysis \
 --disable-freeverb  \
 --disable-frei0r \
 --disable-gaudieffects  \
 --disable-geometrictransform \
 --disable-gdp  \
 --disable-id3tag  \
 --disable-inter  \
 --disable-interlace  \
 --disable-ivfparse \
 --disable-ivtc  \
 --disable-jp2kdecimator \
 --disable-jpegformat \
 --disable-librfb \
 --disable-midi \
 --disable-mpegdemux \
 --disable-mpegtsdemux  \
 --disable-mpegtsmux \
 --disable-mpegpsmux \
 --disable-mxf \
 --disable-netsim  \
 --disable-onvif \
 --disable-pcapparse  \
 --disable-pnm  \
 --disable-proxy  \
 --disable-rawparse \
 --disable-removesilence \
 --disable-rist \
 --disable-rtp  \
 --disable-sdp \
 --disable-segmentclip  \
 --disable-siren \
 --disable-smooth  \
 --disable-speed \
 --disable-subenc \
 --disable-timecode  \
 --disable-videofilters \
 --disable-videoparsers  \
 --disable-videosignal \
 --disable-vmnc \
 --disable-y4m  \
 --disable-yadif  \
 --disable-directsound \
 --disable-wasapi \
 --disable-direct3d  \
 --disable-winscreencap  \
 --disable-winks  \
 --disable-android_media \
 --disable-apple_media  \
 --disable-bluez \
 --disable-avc \
 --disable-shm \
 --disable-ipcpipeline \
 --disable-opensles  \
 --disable-uvch264 \
 --disable-tinyalsa \
 --disable-msdk  \
 --disable-assrender \
 --disable-aom  \
 --disable-avtp  \
 --disable-voamrwbenc  \
 --disable-voaacenc  \
 --disable-bs2b  \
 --disable-bz2 \
 --disable-chromaprint  \
 --disable-curl  \
 --disable-dash \
 --disable-dc1394 \
 --disable-decklink  \
 --disable-directfb \
 --disable-wayland \
 --disable-webp  \
 --disable-dts \
 --disable-resindvd \
 --disable-faac \
 --disable-faad  \
 --disable-fbdev  \
 --disable-fdk_aac  \
 --disable-flite \
 --disable-gsm  \
 --disable-fluidsynth \
 --disable-kate \
 --disable-kms  \
 --disable-ladspa  \
 --disable-lcms2  \
 --disable-lv2  \
 --disable-libde265 \
 --disable-libmms \
 --disable-srt \
 --disable-srtp  \
 --disable-dtls  \
 --disable-ttml  \
 --disable-modplug  \
 --disable-mpeg2enc \
 --disable-mplex \
 --disable-musepack \
 --disable-neon \
 --disable-ofa \
 --disable-openal \
 --disable-opencv  \
 --disable-openexr \
 --disable-openh264  \
 --disable-openjpeg  \
 --disable-openmpt  \
 --disable-openni2 \
 --disable-opus  \
 --disable-pango  \
 --disable-rsvg  \
 --disable-gl \
 --disable-teletextdec  \
 --disable-wildmidi \
 --disable-smoothstreaming  \
 --disable-sndfile  \
 --disable-soundtouch \
 --disable-gme  \
 --disable-dvb  \
 --disable-sbc \
 --disable-zbar  \
 --disable-rtmp  \
 --disable-spandsp \
 --disable-hls \
 --disable-x265  \
 --disable-webrtcdsp \
 --disable-webrtc \
 --disable-wpe  \
 --disable-sctp"
./autogen.sh --disable-gtk-doc --enable-orc $DISABLED_BAG_PLUGINS
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