FROM debian:jessie
MAINTAINER Erik De Rijcke <erik.de.rijcke@udev.be>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update \
    && apt-get -y install xserver-xorg-video-dummy x11-apps

VOLUME /tmp/.X11-unix

COPY xorg.conf /etc/X11/xorg.conf

CMD ["/usr/bin/Xorg", "-ac", "-noreset", "+extension", "GLX", "+extension", "RANDR", "+extension", "RENDER", "-logfile", "./xdummy.log", "-config", "/etc/X11/xorg.conf", ":0"]