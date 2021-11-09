cmake_minimum_required(VERSION 3.15)

project(app-endpoint-encoding C)
set(CMAKE_BUILD_TYPE "Debug")

set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/modules")

find_package(GLIB2 REQUIRED)
find_package(GStreamer REQUIRED COMPONENTS gstreamer-app gstreamer-video)
find_package(PkgConfig REQUIRED)

file(GLOB SOURCE_FILES "native/src/*.c" "native/src/*.h")
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

execute_process(COMMAND node -p "require('node-api-headers').include_dir"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_API_DIR
        )
string(REGEX REPLACE "[\r\n\"]" "" NODE_API_DIR ${NODE_API_DIR})

target_include_directories(${PROJECT_NAME}
        PRIVATE ${NODE_API_DIR}
        PRIVATE ${GSTREAMER_INCLUDE_DIRS}
        PRIVATE ${GLIB2_INCLUDE_DIR}
        )

execute_process(COMMAND node -p "require('node-api-headers').include_dir"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_API_DIR
        )
string(REGEX REPLACE "[\r\n\"]" "" NODE_API_DIR ${NODE_API_DIR})

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} ${GLIB2_LIBRARIES} ${GSTREAMER_LIBRARIES} ${GSTREAMER_APP_LIBRARIES} ${GSTREAMER_VIDEO_LIBRARIES})
set_target_properties(${PROJECT_NAME}
    PROPERTIES
        LIBRARY_OUTPUT_DIRECTORY ../dist/encoding
)
