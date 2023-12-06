cmake_minimum_required(VERSION 3.13)

project(compositor-proxy C)
set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED TRUE)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -Werror -pedantic")
set(THREADS_PREFER_PTHREAD_FLAG ON)

#set(CMAKE_BUILD_TYPE "Debug")
set(CMAKE_BUILD_TYPE "Release")

find_package(Threads REQUIRED)
find_package(PkgConfig REQUIRED)
pkg_check_modules(GLIB2 REQUIRED glib-2.0 IMPORTED_TARGET)
pkg_check_modules(GSTREAMER REQUIRED
        IMPORTED_TARGET
        gstreamer-1.0>=1.18
        gstreamer-app-1.0>=1.18
        gstreamer-video-1.0>=1.18
        gstreamer-gl-1.0>=1.18
        gstreamer-allocators-1.0>=1.18
)
pkg_check_modules(GRAPHENE REQUIRED IMPORTED_TARGET graphene-1.0)
pkg_check_modules(EGL REQUIRED IMPORTED_TARGET egl>=1.5)
pkg_check_modules(OPENGL REQUIRED IMPORTED_TARGET opengl>=3.3)
pkg_check_modules(LibFFI REQUIRED libffi IMPORTED_TARGET)
pkg_check_modules(GBM REQUIRED gbm IMPORTED_TARGET)
pkg_check_modules(LIBDRM REQUIRED libdrm IMPORTED_TARGET)

add_library(proxy-encoding SHARED
        ${CMAKE_CURRENT_SOURCE_DIR}/native/encoding/src/encoder.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/encoding/src/gst_frame_encoder_drm_formats.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/encoding/src/gst_frame_encoder.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/encoding/src/gst_main_loop.c
)
set_property(
    TARGET proxy-encoding
    PROPERTY INSTALL_RPATH
    $ORIGIN
)
target_include_directories(proxy-encoding PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src
        ${GSTREAMER_INCLUDE_DIRS}
        ${GRAPHENE_INCLUDE_DIRS}
        ${GLIB2_INCLUDE_DIRS}
        ${EGL_INCLUDE_DIRS}
        ${OPENGL_INCLUDE_DIRS}
)
target_link_libraries(proxy-encoding PRIVATE
        PkgConfig::GLIB2
        PkgConfig::GSTREAMER
        PkgConfig::GRAPHENE
        PkgConfig::EGL
        PkgConfig::OPENGL
        westfield
        wayland-server
        -Wl,--no-undefined
)


add_library(proxy-poll-addon SHARED
        ${CMAKE_CURRENT_SOURCE_DIR}/native/poll/src/poll.c
)
set_property(
    TARGET proxy-poll-addon
    PROPERTY INSTALL_RPATH
    $ORIGIN/shared
)
target_include_directories(proxy-poll-addon PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}/native/node-api
)
set_target_properties(proxy-poll-addon PROPERTIES PREFIX "" SUFFIX ".node")


add_library(proxy-encoding-addon SHARED
        ${CMAKE_CURRENT_SOURCE_DIR}/native/encoding/src/encoder.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/encoding/src/node_encoder.c
)
set_property(
    TARGET proxy-encoding-addon
    PROPERTY INSTALL_RPATH
    $ORIGIN/shared
)
target_include_directories(proxy-encoding-addon PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}/native/node-api
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src
)
set_target_properties(proxy-encoding-addon PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(proxy-encoding-addon PRIVATE
        westfield
        wayland-server
        proxy-encoding
)

add_library(wayland-server SHARED
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-server-protocol.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-protocol.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/westfield-wayland-server-extra.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/connection.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/event-loop.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-os.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-os.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-server-protocol.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-private.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-server.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-server.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-server-private.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-server-core.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-shm.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-util.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-util.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/westfield-wayland-server.h
)

set_target_properties(wayland-server PROPERTIES
    SUFFIX ".so.0"
    INSTALL_RPATH $ORIGIN
)

target_include_directories(wayland-server PRIVATE
        ${LibFFI_INCLUDE_DIRS}
)
target_link_libraries(wayland-server PRIVATE
        PkgConfig::LibFFI
        Threads::Threads
        -Wl,--no-undefined
)

file(GLOB WESTFIELD_WAYLAND_SERVER_PUBLIC_HEADERS
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-server-protocol.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-server.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-server-core.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-util.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/wayland-version.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/westfield-wayland-server-extra.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server/westfield-wayland-server.h
)

add_library(westfield SHARED
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/westfield-fdutils.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/westfield-fdutils.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/westfield-xwayland.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/westfield-xwayland.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/westfield-egl.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/westfield-egl.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/westfield.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/westfield-surface.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/addon.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/addon.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/westfield-buffer.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/westfield-buffer.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/westfield-dmabuf.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/westfield-dmabuf.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/linux-dmabuf-unstable-v1-protocol.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/linux-dmabuf-unstable-v1-protocol.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/westfield-util.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/drm-protocol.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/drm-protocol.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/drm_format_set.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/drm_format_set.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wlr_linux_dmabuf_v1.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wlr_linux_dmabuf_v1.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wlr_drm.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wlr_drm.h
)
set_property(
    TARGET westfield
    PROPERTY INSTALL_RPATH
    $ORIGIN
)
target_include_directories(westfield PRIVATE
        ${CMAKE_SOURCE_DIR}/native/wayland/src
        ${CMAKE_SOURCE_DIR}/native/wayland/src/wayland-server
        ${CMAKE_SOURCE_DIR}/native/wayland/src/wayland-server/protocol
        ${GBM_INCLUDE_DIRS}
        ${EGL_INCLUDE_DIRS}
        ${LIBDRM_INCLUDE_DIRS}
)
target_link_libraries(westfield PRIVATE
        wayland-server
        PkgConfig::GBM
        PkgConfig::EGL
        PkgConfig::LIBDRM
        Threads::Threads
        rt
        -Wl,--no-undefined
)

file(GLOB WESTFIELD_PUBLIC_HEADERS
        ${CMAKE_SOURCE_DIR}/native/wayland/src/*.h
)

add_library(wayland-server-addon SHARED
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/node-addon/wayland-server-addon.c
)
set_property(
    TARGET wayland-server-addon
    PROPERTY INSTALL_RPATH
    $ORIGIN/shared
)
target_include_directories(wayland-server-addon PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src/wayland-server
        ${CMAKE_CURRENT_SOURCE_DIR}/native/wayland/src
        ${CMAKE_CURRENT_SOURCE_DIR}/native/node-api
)
set_target_properties(wayland-server-addon
        PROPERTIES PREFIX "" SUFFIX ".node"
)
target_link_libraries(wayland-server-addon PRIVATE
            wayland-server
            westfield
            Threads::Threads
            rt
)

install(TARGETS
        proxy-encoding-addon
        wayland-server-addon
        proxy-poll-addon
        DESTINATION
        ${CMAKE_CURRENT_SOURCE_DIR}/dist/addons
)
install(TARGETS
        proxy-encoding
        wayland-server
        westfield
        DESTINATION
        ${CMAKE_CURRENT_SOURCE_DIR}/dist/addons/shared
)
