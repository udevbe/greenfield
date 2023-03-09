cmake_minimum_required(VERSION 3.13)

project(app-endpoint-encoding C)
set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED TRUE)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -Werror -pedantic")

#set(CMAKE_BUILD_TYPE "Debug")
set(CMAKE_BUILD_TYPE "Release")

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

get_filename_component(WESTFIELD_LIBWAYLAND_SERVER ${CMAKE_CURRENT_SOURCE_DIR}/node_modules/westfield-proxy/dist/libwayland-server.so.0 ABSOLUTE)
get_filename_component(WESTFIELD ${CMAKE_CURRENT_SOURCE_DIR}/node_modules/westfield-proxy/dist/libwestfield.so ABSOLUTE)

add_library(proxy-encoding SHARED
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/encoder.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/gst_frame_encoder.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/gst_audio_encoder.c
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/gst_main_loop.c
)
target_include_directories(proxy-encoding PRIVATE
        ${CMAKE_SOURCE_DIR}/node_modules/westfield-proxy/dist/include
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
        ${WESTFIELD}
        ${WESTFIELD_LIBWAYLAND_SERVER}
        -Wl,--no-undefined
)
set_target_properties(proxy-encoding
        PROPERTIES
        LIBRARY_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/dist/encoding
)


add_library(proxy-encoding-addon SHARED
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/encoder.h
        ${CMAKE_CURRENT_SOURCE_DIR}/native/src/node_encoder.c
)
target_include_directories(proxy-encoding-addon PRIVATE
        ${CMAKE_SOURCE_DIR}/node_modules/node-api-headers/include
        ${CMAKE_SOURCE_DIR}/node_modules/westfield-proxy/dist/include
)
set_target_properties(proxy-encoding-addon PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(proxy-encoding-addon PRIVATE
        ${CMAKE_JS_LIB}
        ${WESTFIELD}
        proxy-encoding
)
set_target_properties(proxy-encoding-addon
    PROPERTIES
        LIBRARY_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/dist/encoding
)
