install_headers(
	'config-parser.h',
	'libweston.h',
	'desktop.h',
	'matrix.h',
	'plugin-registry.h',
	'windowed-output-api.h',
	'weston-log.h',
	'zalloc.h',
	'remoting-plugin.h',
	'pipewire-plugin.h',
	subdir: dir_include_libweston_install
)

backend_drm_h =      files('backend-drm.h')
backend_headless_h = files('backend-headless.h')
backend_rdp_h =      files('backend-rdp.h')
backend_vnc_h =      files('backend-vnc.h')
backend_wayland_h =  files('backend-wayland.h')
backend_x11_h =      files('backend-x11.h')

xwayland_api_h = files('xwayland-api.h')

libweston_version_h = configuration_data()
libweston_version_h.set('WESTON_VERSION_MAJOR', version_weston_arr[0])
libweston_version_h.set('WESTON_VERSION_MINOR', version_weston_arr[1])
libweston_version_h.set('WESTON_VERSION_MICRO', version_weston_arr[2])
libweston_version_h.set('WESTON_VERSION', version_weston)
version_h = configure_file(
	input: 'version.h.in',
	output: 'version.h',
	configuration: libweston_version_h
)
install_headers(version_h, subdir: dir_include_libweston_install)
