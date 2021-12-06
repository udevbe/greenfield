cmake_minimum_required(VERSION 3.13)

project(app-endpoint-encoding C)
set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED TRUE)
#set(CMAKE_BUILD_TYPE "Debug")
set(CMAKE_BUILD_TYPE "Release")

execute_process(COMMAND node -p "require('node-api-headers').include_dir"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_API_DIR
        )
string(REGEX REPLACE "[\r\n\"]" "" NODE_API_DIR ${NODE_API_DIR})

set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/modules")

find_package(GLIB2 REQUIRED)
find_package(GStreamer REQUIRED COMPONENTS gstreamer-app gstreamer-video)
find_package(PkgConfig REQUIRED)

add_library(${PROJECT_NAME} SHARED
        native/src/encoder.h
        native/src/node_encoder.c
        native/src/gst_encoder.c
        native/src/gst_main_loop.c)

target_include_directories(${PROJECT_NAME}
        PRIVATE ${NODE_API_DIR}
        PRIVATE ${GSTREAMER_INCLUDE_DIRS}
        PRIVATE ${GLIB2_INCLUDE_DIR}
        PRIVATE node_modules/westfield-endpoint/native/src/wayland-server
        )

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
get_filename_component(WESTFIELD_LIBWAYLAND_SERVER node_modules/westfield-endpoint/src/libwayland-server.so ABSOLUTE)
target_link_libraries(${PROJECT_NAME}
        ${CMAKE_JS_LIB}
        ${GLIB2_LIBRARIES}
        ${GSTREAMER_LIBRARIES}
        ${GSTREAMER_APP_LIBRARIES}
        ${GSTREAMER_VIDEO_LIBRARIES}
        ${WESTFIELD_LIBWAYLAND_SERVER}
        )
set_target_properties(${PROJECT_NAME}
    PROPERTIES
        LIBRARY_OUTPUT_DIRECTORY ../dist/encoding
)
