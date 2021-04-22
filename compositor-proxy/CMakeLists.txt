cmake_minimum_required(VERSION 3.7)

project(app-endpoint-encoding C)
#set(CMAKE_BUILD_TYPE "Debug")

set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/modules")

find_package(GLIB2 REQUIRED)
find_package(GStreamer REQUIRED COMPONENTS gstreamer-app gstreamer-video)
find_package(PkgConfig REQUIRED)

add_library(${PROJECT_NAME} SHARED
        native/src/x264_gst_encoder.c
        native/src/x264_gst_encoder.h
        native/src/encoder.h
        native/src/png_gst_encoder.c
        native/src/png_gst_encoder.h
        native/src/nv264_gst_encoder.c
        native/src/nv264_gst_encoder.h
        native/src/node_encoder.c)

target_include_directories(${PROJECT_NAME}
        PRIVATE ${CMAKE_JS_INC}
        PRIVATE ${GSTREAMER_INCLUDE_DIRS}
        PRIVATE ${GLIB2_INCLUDE_DIR}
        )

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} ${GLIB2_LIBRARIES} ${GSTREAMER_LIBRARIES} ${GSTREAMER_APP_LIBRARIES} ${GSTREAMER_VIDEO_LIBRARIES})
set_target_properties(${PROJECT_NAME}
    PROPERTIES
        LIBRARY_OUTPUT_DIRECTORY ../dist/src/encoding
)
