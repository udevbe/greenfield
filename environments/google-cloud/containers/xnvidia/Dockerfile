FROM marketplace.gcr.io/google/debian9

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update \
    && apt-get -qq -y install xserver-xorg \
    && rm -rf /var/lib/apt/lists/*

VOLUME /tmp/.X11-unix

# FIXME we want to auto generate this file when the image is started:
# Get bus id
# nvidia-xconfig --query-gpu-info
# Generate config using bus id
# nvidia-xconfig -a --allow-empty-initial-configuration --use-display-device=None --virtual=1920x1200 --busid "${BUS_ID}"
COPY xorg.conf /etc/X11/xorg.conf
ENV LD_LIBRARY_PATH "/usr/local/lib/:/usr/local/nvidia/lib64/"
CMD ["/usr/bin/Xorg", "-seat", "1", "-ac", "-noreset", "-config", "/etc/X11/xorg.conf", ":0"]