cmake_minimum_required(VERSION 3.7)

project(app-endpoint-encoding C)
#set(CMAKE_BUILD_TYPE "Debug")

set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/modules")

find_package(GLIB2)
find_package(GStreamer)

add_library(${PROJECT_NAME} SHARED
        src/nvh264.c)

target_include_directories(${PROJECT_NAME}
    PRIVATE ${CMAKE_JS_INC}
    PRIVATE ${GSTREAMER_INCLUDE_DIR}
    PRIVATE ${GLIB2_INCLUDE_DIR}
)

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})