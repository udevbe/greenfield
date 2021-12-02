FROM alpine:3.15

RUN apk add --no-cache \
    font-noto \
    font-noto-emoji \
    mesa-egl \
    mesa-gbm \
    mesa-dri-gallium \
    wayland-libs-egl \
    libxkbcommon \
    xkeyboard-config \
    alacritty \
    bash \
    bash-completion \
    util-linux \
    coreutils \
    findutils \
    grep \
    procps \
    vim \
    curl \
    git \
    jq \
    nerd-fonts \
    mc
RUN curl https://raw.githubusercontent.com/riobard/bash-powerline/master/bash-powerline.sh > /etc/profile.d/bash-powerline.sh

RUN adduser -u 1000 -h "/home/$USER" -s "/bin/bash" -D "user"

ENV XDG_CONFIG_HOME="/etc/xdg"
COPY alacritty.yml $XDG_CONFIG_HOME/alacritty/alacritty.yml
RUN chown -R 1000:1000 $XDG_CONFIG_HOME
ENTRYPOINT ["alacritty"]
