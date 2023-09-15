if get_option('resize-pool')
	config_h.set('USE_RESIZE_POOL', '1')
endif

srcs_toytoolkit = [
	'window.c',
	xdg_shell_client_protocol_h,
	xdg_shell_protocol_c,
	pointer_constraints_unstable_v1_client_protocol_h,
	pointer_constraints_unstable_v1_protocol_c,
    relative_pointer_unstable_v1_client_protocol_h,
    relative_pointer_unstable_v1_protocol_c,
	viewporter_client_protocol_h,
	viewporter_protocol_c,
]
deps_toytoolkit = [
	dep_wayland_client,
	dep_lib_cairo_shared,
	dep_xkbcommon,
	dependency('wayland-cursor'),
	dep_epoll,
#	cc.find_library('util'),
]
lib_toytoolkit = static_library(
	'toytoolkit',
	srcs_toytoolkit,
	include_directories: common_inc,
	dependencies: deps_toytoolkit,
	install: false,
)
dep_toytoolkit = declare_dependency(
	link_with: lib_toytoolkit,
	dependencies: deps_toytoolkit,
)
dep_gbm = dependency('gbm', required: false)
if dep_gbm.found() and dep_gbm.version().version_compare('>= 21.3')
	config_h.set('HAVE_GBM_BO_CREATE_WITH_MODIFIERS2', '1')
endif

simple_clients_enabled = get_option('simple-clients')
simple_build_all = simple_clients_enabled.contains('all')

simple_clients = [
	{
		'name': 'damage',
		'sources': [
			'simple-damage.c',
			viewporter_client_protocol_h,
			viewporter_protocol_c,
			xdg_shell_client_protocol_h,
			xdg_shell_protocol_c,
			fullscreen_shell_unstable_v1_client_protocol_h,
			fullscreen_shell_unstable_v1_protocol_c,
		],
		'dep_objs': [ dep_wayland_client, dep_libshared ]
	},
	{
		'name': 'egl',
		'sources': [
			'simple-egl.c',
			xdg_shell_client_protocol_h,
			xdg_shell_protocol_c,
		],
		'dep_objs': [
			dep_libm,
			dep_libshared,
			dep_matrix_c,
			dep_wayland_client,
		],
		'deps': [ 'egl', 'wayland-egl', 'glesv2', 'wayland-cursor' ],
		'options': [ 'renderer-gl' ]
	},
	# weston-simple-im is handled specially separately due to install_dir and odd window.h usage
	{
		'name': 'shm',
		'sources': [
			'simple-shm.c',
			xdg_shell_client_protocol_h,
			xdg_shell_protocol_c,
			fullscreen_shell_unstable_v1_client_protocol_h,
			fullscreen_shell_unstable_v1_protocol_c,
		],
		'dep_objs': [ dep_wayland_client, dep_libshared ]
	},
	{
		'name': 'touch',
		'sources': [
			'simple-touch.c',
			xdg_shell_client_protocol_h,
			xdg_shell_protocol_c,
		],
		'dep_objs': [ dep_wayland_client, dep_libshared ]
	},
]

foreach t : simple_clients
	if simple_build_all or simple_clients_enabled.contains(t.get('name'))
		t_name = 'weston-simple-' + t.get('name')
		t_deps = t.get('dep_objs', [])
		foreach depname : t.get('deps', [])
			dep = dependency(depname, required: false)
			if not dep.found()
				error('@0@ requires @1@ which was not found. If you rather not build this, drop "@2@" from simple-clients option.'.format(t_name, depname, t.get('name')))
			endif
			t_deps += dep
		endforeach

		foreach optname : t.get('options', [])
			if not get_option(optname)
				error('@0@ requires option @1@ which is not enabled. If you rather not build this, drop "@2@" from simple-clients option.'.format(t_name, optname, t.get('name')))
			endif
		endforeach

		executable(
			t_name, t.get('sources'),
			include_directories: common_inc,
			dependencies: t_deps,
			install: true,
			name_suffix: 'html'
		)
	endif
endforeach

if simple_build_all or simple_clients_enabled.contains('im')
	executable(
		'weston-simple-im', [
			'simple-im.c',
			input_method_unstable_v1_client_protocol_h,
			input_method_unstable_v1_protocol_c,
		],
		include_directories: common_inc,
		dependencies: [
			dep_libshared,
			dep_wayland_client,
			dep_xkbcommon,
			dependency('wayland-cursor'),
			dependency('cairo')
		],
		install: true,
		install_dir: dir_libexec,
		name_suffix: 'html'
	)
endif

tools_enabled = get_option('tools')
tools_list = [
	{
		'name': 'calibrator',
		'sources': [ 'calibrator.c' ],
		'deps': [ dep_toytoolkit, dep_matrix_c ],
	},
	{
		'name': 'terminal',
		'sources': [ 'terminal.c' ],
		'deps': [ dep_toytoolkit ],
	},
]

foreach t : tools_list
	if tools_enabled.contains(t.get('name'))
		executable(
			'weston-@0@'.format(t.get('name')),
			t.get('sources'),
			include_directories: common_inc,
			dependencies: t.get('deps', []),
			install: true,
			name_suffix: 'html'
		)
	endif
endforeach

demo_clients = [
	{ 'basename': 'dnd' },
	{
		'basename': 'editor',
		'add_sources': [
			text_input_unstable_v1_client_protocol_h,
			text_input_unstable_v1_protocol_c,
		],
		'deps': [ 'pangocairo', 'gobject-2.0' ]
	},
	{ 'basename': 'eventdemo' },
	{ 'basename': 'flower' },
	{
		'basename': 'fullscreen',
		'add_sources': [
			fullscreen_shell_unstable_v1_client_protocol_h,
			fullscreen_shell_unstable_v1_protocol_c,
		]
	},
	{ 'basename': 'image' },
	{
		'basename': 'multi-resource',
		'add_sources': [
			xdg_shell_client_protocol_h,
			xdg_shell_protocol_c,
		]
	},
	{
		'basename': 'presentation-shm',
		'add_sources': [
			presentation_time_client_protocol_h,
			presentation_time_protocol_c,
			xdg_shell_client_protocol_h,
			xdg_shell_protocol_c,
		]
	},
	{ 'basename': 'resizor' },
	{
		'basename': 'scaler',
		'add_sources': [
			viewporter_client_protocol_h,
			viewporter_protocol_c,
		]
	},
	{ 'basename': 'smoke' },
	{ 'basename': 'stacking' },
#	{
#		'basename': 'subsurfaces',
#		'deps': [ 'egl', 'glesv2', 'wayland-egl' ]
#	},
	{ 'basename': 'transformed' },
]

if get_option('demo-clients')
	foreach t : demo_clients
		t_name = 'weston-' + t.get('basename')
		t_srcs = [ t.get('basename') + '.c' ] + t.get('add_sources', [])
		t_deps = [ dep_toytoolkit, t.get('dep_objs', []) ]
		foreach depname : t.get('deps', [])
			dep = dependency(depname, required: false)
			if not dep.found()
				error('@0@ requires \'@1@\' which was not found. If you rather not build this, set \'-Ddemo-clients=false\'.'.format(t_name, depname))
			endif
			t_deps += dep
		endforeach

		executable(
			t_name, t_srcs,
			include_directories: common_inc,
			dependencies: t_deps,
			install: true,
			name_suffix: 'html'
		)
	endforeach
endif
