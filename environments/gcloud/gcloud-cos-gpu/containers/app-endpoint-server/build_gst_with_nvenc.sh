#!/bin/bash
set -e
# Set your target branch
BRANCH="master"

exec > >(tee build-gstreamer.log)
exec 2>&1

checkout_sources() {
    [ ! -d orc ] && git clone --depth 1 git://anongit.freedesktop.org/git/gstreamer/orc
    [ ! -d gstreamer ] && git clone --depth 1 --single-branch --branch ${BRANCH} git://anongit.freedesktop.org/git/gstreamer/gstreamer
    [ ! -d gst-plugins-base ] && git clone --depth 1 --single-branch --branch ${BRANCH} git://anongit.freedesktop.org/git/gstreamer/gst-plugins-base
    [ ! -d gst-plugins-good ] && git clone --depth 1 --single-branch --branch ${BRANCH} git://anongit.freedesktop.org/git/gstreamer/gst-plugins-good
    [ ! -d gst-plugins-bad ] && git clone --depth 1 --single-branch --branch ${BRANCH} git://anongit.freedesktop.org/git/gstreamer/gst-plugins-bad
    [ ! -d gst-plugins-ugly ] && git clone --depth 1 --single-branch --branch ${BRANCH} git://anongit.freedesktop.org/git/gstreamer/gst-plugins-ugly
}

build_source() {
    pushd $1
        meson build/
        meson configure build -Dbuildtype=release $2
        ninja -C build/
        meson install -C build/
        ldconfig
    popd
}

main() {
    checkout_sources

    build_source orc
    build_source gstreamer

    build_source gst-plugins-base "-Daudioconvert=disabled \
 -Dgl_platform=egl \
 -Dgl_winsys=egl \
 -Daudiomixer=disabled \
 -Daudiorate=disabled \
 -Daudioresample=disabled \
 -Daudiotestsrc=disabled \
 -Dcompositor=disabled \
 -Dgio=disabled \
 -Doverlaycomposition=disabled \
 -Dplayback=disabled \
 -Drawparse=disabled \
 -Dsubparse=disabled \
 -Dtcp=disabled \
 -Dtypefind=disabled \
 -Dvideorate=disabled \
 -Dvolume=disabled"

    build_source gst-plugins-good "-Dalpha=disabled \
 -Dapetag=disabled \
 -Daudiofx=disabled \
 -Daudioparsers=disabled \
 -Dauparse=disabled	\
 -Dautodetect=disabled \
 -Davi=disabled \
 -Dcutter=disabled \
 -Ddebugutils=disabled \
 -Ddeinterlace=disabled \
 -Ddtmf=disabled \
 -Deffectv=disabled \
 -Dequalizer=disabled \
 -Dflv=disabled \
 -Dflx=disabled \
 -Dgoom=disabled \
 -Dgoom2k1=disabled \
 -Dicydemux=disabled \
 -Did3demux=disabled \
 -Dimagefreeze=disabled \
 -Dinterleave=disabled \
 -Disomp4=disabled \
 -Dlaw=disabled \
 -Dlevel=disabled \
 -Dmatroska=disabled \
 -Dmultifile=disabled \
 -Dmultipart=disabled \
 -Dreplaygain=disabled \
 -Drtp=disabled \
 -Drtpmanager=disabled \
 -Drtsp=disabled \
 -Dshapewipe=disabled \
 -Dmonoscope=disabled \
 -Doss4=disabled \
 -Doss=disabled \
 -Dv4l2=disabled \
 -Dximagesrc=disabled \
 -Dsmpte=disabled \
 -Dspectrum=disabled \
 -Dudp=disabled \
 -Dvideocrop=disabled \
 -Dvideofilter=disabled \
 -Dvideomixer=disabled \
 -Dwavenc=disabled \
 -Dwavparse=disabled \
 -Dy4m=disabled"

    build_source gst-plugins-bad "-Daccurip=disabled \
 -Dcurl-ssh2=disabled \
 -Dcolormanagement=disabled \
 -Dclosedcaption=disabled \
 -Dadpcmdec=disabled \
 -Dadpcmenc=disabled \
 -Daiff=disabled \
 -Dvideoframe_audiolevel=disabled \
 -Dasfmux=disabled \
 -Daudiobuffersplit=disabled \
 -Daudiofxbad=disabled \
 -Daudiolatency=disabled \
 -Daudiomixmatrix=disabled \
 -Daudiovisualizers=disabled \
 -Dautoconvert=disabled \
 -Dbayer=disabled \
 -Dcamerabin2=disabled \
 -Dcoloreffects=disabled \
 -Ddebugutils=disabled \
 -Ddvbsuboverlay=disabled \
 -Ddvdspu=disabled \
 -Dfaceoverlay=disabled \
 -Dfestival=disabled \
 -Dfieldanalysis=disabled \
 -Dfreeverb=disabled \
 -Dfrei0r=disabled \
 -Dgaudieffects=disabled \
 -Dgeometrictransform=disabled \
 -Dgdp=disabled \
 -Did3tag=disabled \
 -Dinter=disabled \
 -Dinterlace=disabled \
 -Divfparse=disabled \
 -Divtc=disabled \
 -Djp2kdecimator=disabled \
 -Djpegformat=disabled \
 -Dlibrfb=disabled \
 -Dmidi=disabled \
 -Dmpegdemux=disabled \
 -Dmpegtsdemux=disabled \
 -Dmpegtsmux=disabled \
 -Dmpegpsmux=disabled \
 -Dmxf=disabled \
 -Dnetsim=disabled \
 -Donvif=disabled \
 -Dpcapparse=disabled \
 -Dpnm=disabled \
 -Dproxy=disabled \
 -Drawparse=disabled \
 -Dremovesilence=disabled \
 -Drist=disabled \
 -Drtp=disabled \
 -Dsdp=disabled \
 -Dsegmentclip=disabled \
 -Dsiren=disabled \
 -Dsmooth=disabled \
 -Dspeed=disabled \
 -Dsubenc=disabled \
 -Dtimecode=disabled \
 -Dvideofilters=disabled \
 -Dvideoparsers=disabled \
 -Dvideosignal=disabled \
 -Dvmnc=disabled \
 -Dy4m=disabled \
 -Dyadif=disabled \
 -Ddirectsound=disabled \
 -Dwasapi=disabled \
 -Dwinscreencap=disabled \
 -Dwinks=disabled \
 -Dbluez=disabled \
 -Dipcpipeline=disabled \
 -Dopensles=disabled \
 -Duvch264=disabled \
 -Dtinyalsa=disabled \
 -Dmsdk=disabled \
 -Dassrender=disabled \
 -Daom=disabled \
 -Davtp=disabled \
 -Dvoamrwbenc=disabled \
 -Dvoaacenc=disabled \
 -Dbs2b=disabled \
 -Dbz2=disabled \
 -Dchromaprint=disabled \
 -Dcurl=disabled \
 -Ddash=disabled \
 -Ddc1394=disabled \
 -Ddecklink=disabled \
 -Ddirectfb=disabled \
 -Dwayland=disabled \
 -Dwebp=disabled \
 -Ddts=disabled \
 -Dresindvd=disabled \
 -Dfaac=disabled \
 -Dfaad=disabled \
 -Dfbdev=disabled \
 -Dflite=disabled \
 -Dgsm=disabled \
 -Dfluidsynth=disabled \
 -Dkate=disabled \
 -Dkms=disabled \
 -Dladspa=disabled \
 -Dlv2=disabled \
 -Dlibde265=disabled \
 -Dlibmms=disabled \
 -Dsrt=disabled \
 -Dsrtp=disabled \
 -Ddtls=disabled \
 -Dttml=disabled \
 -Dmodplug=disabled \
 -Dmpeg2enc=disabled \
 -Dmplex=disabled \
 -Dmusepack=disabled \
 -Dneon=disabled \
 -Dofa=disabled \
 -Dopenal=disabled \
 -Dopencv=disabled \
 -Dopenexr=disabled \
 -Dopenh264=disabled \
 -Dopenjpeg=disabled \
 -Dopenmpt=disabled \
 -Dopenni2=disabled \
 -Dopus=disabled \
 -Drsvg=disabled \
 -Dwildmidi=disabled \
 -Dsmoothstreaming=disabled \
 -Dsndfile=disabled \
 -Dsoundtouch=disabled \
 -Dgme=disabled \
 -Ddvb=disabled \
 -Dsbc=disabled \
 -Dzbar=disabled \
 -Drtmp=disabled \
 -Dspandsp=disabled \
 -Dhls=disabled \
 -Dx265=disabled \
 -Dwebrtcdsp=disabled \
 -Dwebrtc=disabled \
 -Dwpe=disabled \
 -Dsctp=disabled"

    build_source gst-plugins-ugly "-Dasfdemux=disabled \
 -Ddvdlpcmdec=disabled \
 -Ddvdsub=disabled \
 -Drealmedia=disabled \
 -Dxingmux=disabled \
 -Da52dec=disabled \
 -Damrnb=disabled \
 -Damrwbdec=disabled \
 -Dcdio=disabled \
 -Dmpeg2dec=disabled"
}

main
