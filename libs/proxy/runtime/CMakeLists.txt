cmake_minimum_required(VERSION 3.13)

project(westfield C)
set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED TRUE)
set(THREADS_PREFER_PTHREAD_FLAG ON)

#set(CMAKE_BUILD_TYPE "Debug")
set(CMAKE_BUILD_TYPE "Release")

find_package(Threads REQUIRED)
find_package(PkgConfig REQUIRED)
pkg_check_modules(LibFFI REQUIRED libffi IMPORTED_TARGET)
pkg_check_modules(LIBUDEV REQUIRED libudev IMPORTED_TARGET)
pkg_check_modules(GBM REQUIRED gbm IMPORTED_TARGET)
pkg_check_modules(LIBDRM REQUIRED libdrm IMPORTED_TARGET)
pkg_check_modules(EGL REQUIRED egl IMPORTED_TARGET)

add_library(wayland-server SHARED
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-server-protocol.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-protocol.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/westfield-wayland-server-extra.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/connection.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/event-loop.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-os.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-os.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-server-protocol.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-private.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-server.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-server.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-server-private.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-server-core.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-shm.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-util.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-util.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/westfield-wayland-server.h
)
target_include_directories(wayland-server PRIVATE
        ${LibFFI_INCLUDE_DIRS}
)
target_link_libraries(wayland-server PRIVATE
        PkgConfig::LibFFI
        Threads::Threads
        -Wl,--no-undefined
)
set_target_properties(wayland-server
        PROPERTIES
        LIBRARY_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/dist
        SOVERSION 0
)
file(GLOB WESTFIELD_WAYLAND_SERVER_PUBLIC_HEADERS
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-server-protocol.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-server.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-server-core.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-util.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/wayland-version.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/westfield-wayland-server-extra.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server/westfield-wayland-server.h
)
file(MAKE_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/dist/include/wayland-server)
file(COPY ${WESTFIELD_WAYLAND_SERVER_PUBLIC_HEADERS} DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}/dist/include/wayland-server)


add_library(westfield SHARED
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/westfield-fdutils.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/westfield-fdutils.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/westfield-xwayland.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/westfield-xwayland.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/westfield-egl.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/westfield-egl.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/westfield.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/westfield-surface.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/addon.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/addon.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/westfield-buffer.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/westfield-buffer.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/westfield-dmabuf.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/westfield-dmabuf.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/linux-dmabuf-unstable-v1-protocol.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/linux-dmabuf-unstable-v1-protocol.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/westfield-util.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/drm-protocol.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/drm-protocol.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/drm_format_set.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/drm_format_set.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wlr_linux_dmabuf_v1.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wlr_linux_dmabuf_v1.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wlr_drm.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wlr_drm.h
        )
target_include_directories(westfield PRIVATE
        ${CMAKE_SOURCE_DIR}/native/src
        ${CMAKE_SOURCE_DIR}/native/src/wayland-server
        ${CMAKE_SOURCE_DIR}/native/src/wayland-server/protocol
        ${LIBUDEV_INCLUDE_DIRS}
        ${GBM_INCLUDE_DIRS}
        ${EGL_INCLUDE_DIRS}
        ${LIBDRM_INCLUDE_DIRS}
)
target_link_libraries(westfield PRIVATE
        wayland-server
        ${CMAKE_JS_LIB}
        PkgConfig::LIBUDEV
        PkgConfig::GBM
        PkgConfig::EGL
        PkgConfig::LIBDRM
        Threads::Threads
        rt
        -Wl,--no-undefined
)
set_target_properties(westfield
        PROPERTIES
        LIBRARY_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/dist
)
file(GLOB WESTFIELD_PUBLIC_HEADERS
        ${CMAKE_SOURCE_DIR}/native/src/*.h
)
file(MAKE_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/dist/include)
file(COPY ${WESTFIELD_PUBLIC_HEADERS} DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}/dist/include)


add_library(westfield-addon SHARED
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/node-addon/westfield-addon.c
)
target_include_directories(westfield-addon PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/wayland-server
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src
)
set_target_properties(westfield-addon
        PROPERTIES PREFIX "" SUFFIX ".node"
)
target_link_libraries(westfield-addon PRIVATE
            ${CMAKE_JS_LIB}
            wayland-server
            westfield
            Threads::Threads
            rt
)
set_target_properties(westfield-addon
        PROPERTIES
        LIBRARY_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/dist
)