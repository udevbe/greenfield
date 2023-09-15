srcs_libshared = [
	'config-parser.c',
	'option-parser.c',
	'file-util.c',
	'os-compatibility.c',
        'process-util.c',
]
deps_libshared = [dep_wayland_client]

lib_libshared = static_library(
	'shared',
	srcs_libshared,
	include_directories: common_inc,
	dependencies: deps_libshared,
	pic: true,
	install: false
)
dep_libshared = declare_dependency(
	link_with: lib_libshared,
	include_directories: public_inc,
	dependencies: deps_libshared
)

xcb_dep = dependency('xcb', required: false)

xcb_xwayland_srcs = [
	'xcb-xwayland.c',
]

lib_xcb_xwayland = static_library(
	'xcb-xwayland',
	xcb_xwayland_srcs,
	include_directories: common_inc,
	dependencies: [ xcb_dep ],
	install: false,
	build_by_default: false,
)

dep_xcb_xwayland = declare_dependency(
	link_with: lib_xcb_xwayland,
	include_directories: public_inc,
)

srcs_cairo_shared = [
	'image-loader.c',
	'cairo-util.c',
	'frame.c',
]

deps_cairo_shared = [
	dep_libshared,
	dependency('cairo'),
	dependency('libpng'),
	dep_pixman,
	dep_libm,
]

dep_pango = dependency('pango', required: false)
dep_pangocairo = dependency('pangocairo', required: false)
dep_fontconfig = dependency('fontconfig', required: false)
dep_glib = dependency('glib-2.0', version: '>= 2.36', required: false)

if dep_pango.found() and dep_pangocairo.found() and dep_fontconfig.found() and dep_glib.found()
	deps_cairo_shared += [ dep_pango, dep_pangocairo, dep_fontconfig, dep_glib ]
	config_h.set('HAVE_PANGO', '1')
endif

if get_option('image-jpeg')
	dep_libjpeg = dependency('libjpeg', required: false)
	if not dep_libjpeg.found()
		dep_libjpeg = cc.find_library('jpeg', required: false)
	endif
	if not dep_libjpeg.found()
		error('JPEG image loading requires libjpeg or jpeg, neither was found. Or, you can use \'-Dimage-jpeg=false\'.')
	endif
	deps_cairo_shared += dep_libjpeg
	config_h.set('HAVE_JPEG', '1')
endif

if get_option('image-webp')
	dep_webp = dependency('libwebp', required: false)
	if not dep_webp.found()
		error('WEBP image loading requires libwebp which was not found. Or, you can use \'-Dimage-webp=false\'.')
	endif
	deps_cairo_shared += dep_webp
	config_h.set('HAVE_WEBP', '1')
endif

lib_cairo_shared = static_library(
	'cairo-shared',
	srcs_cairo_shared,
	include_directories: common_inc,
	dependencies: deps_cairo_shared,
	install: false
)
dep_lib_cairo_shared = declare_dependency(
	link_with: lib_cairo_shared,
	dependencies: deps_cairo_shared
)

dep_matrix_c = declare_dependency(
	sources: 'matrix.c',
	include_directories: public_inc,
	dependencies: dep_libm
)
