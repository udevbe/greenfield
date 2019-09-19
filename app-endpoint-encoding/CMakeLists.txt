cmake_minimum_required(VERSION 3.7)

project(app-endpoint-encoding C)
set(CMAKE_BUILD_TYPE "Debug")

set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/modules")

find_package(GLIB2)
find_package(PkgConfig)

macro(find_gstreamer_component prefix pkg lib)
    pkg_check_modules(PC_${prefix} REQUIRED ${pkg})
    find_library(${prefix}_LIBRARIES NAMES ${lib} HINTS ${PC_${prefix}_LIBRARY_DIRS} ${PC_${prefix}_LIBDIR})
    list(APPEND gstreamer_INCLUDE_DIRS ${PC_${prefix}_INCLUDE_DIRS})
    list(APPEND gstreamer_LIBRARIES ${${prefix}_LIBRARIES})
    mark_as_advanced(${prefix}_LIBRARIES gstreamer_LIBRARIES gstreamer_INCLUDE_DIRS)
endmacro()

find_gstreamer_component(gst gstreamer-1.0 gstreamer-1.0)
find_gstreamer_component(gstbase gstreamer-base-1.0 gstbase-1.0)
find_gstreamer_component(gstapp gstreamer-app-1.0 gstapp-1.0)
find_gstreamer_component(gstvideo gstreamer-video-1.0 gstvideo-1.0)

find_gstreamer_component(gstvideo gstreamer-video-1.0 gstvideo-1.0)

add_library(${PROJECT_NAME} SHARED
        src/x264gst_encoder.c
        src/x264gst_encoder.h
        src/encoder.h
        src/node_encoder.c)

target_include_directories(${PROJECT_NAME}
        PRIVATE ${CMAKE_JS_INC}
        PRIVATE ${gstreamer_INCLUDE_DIRS}
        PRIVATE ${GLIB2_INCLUDE_DIR}
        )

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} ${GLIB2_LIBRARIES} ${gstreamer_LIBRARIES})