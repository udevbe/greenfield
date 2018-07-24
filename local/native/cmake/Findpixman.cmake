#.rst:
# FindPixman
# -------
#
# Find Pixman library
#
# Try to find Pixman library. The following values are defined
#
# ::
#
#   PIXMAN_FOUND         - True if Pixman is available
#   PIXMAN_INCLUDE_DIRS  - Include directories for Pixman
#   PIXMAN_LIBRARIES     - List of libraries for Pixman
#   PIXMAN_DEFINITIONS   - List of definitions for Pixman
#
#=============================================================================
# Copyright (c) 2015 Jari Vetoniemi
#
# Distributed under the OSI-approved BSD License (the "License");
#
# This software is distributed WITHOUT ANY WARRANTY; without even the
# implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# See the License for more information.
#=============================================================================

include(FeatureSummary)
set_package_properties(Pixman PROPERTIES
        URL "http://pixman.org/"
        DESCRIPTION "Low-level software library for pixel manipulation")

find_package(PkgConfig)
pkg_check_modules(PC_PIXMAN QUIET pixman-1)
find_library(PIXMAN_LIBRARIES NAMES pixman-1 HINTS ${PC_PIXMAN_LIBRARY_DIRS})
find_path(PIXMAN_INCLUDE_DIRS NAMES pixman.h PATH_SUFFIXES pixman-1 HINTS ${PC_PIXMAN_INCLUDE_DIRS})

set(PIXMAN_DEFINITIONS ${PC_PIXMAN_CFLAGS_OTHER})

include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(PIXMAN DEFAULT_MSG PIXMAN_LIBRARIES PIXMAN_INCLUDE_DIRS)
mark_as_advanced(PIXMAN_INCLUDE_DIRS PIXMAN_LIBRARIES PIXMAN_DEFINITIONS)
