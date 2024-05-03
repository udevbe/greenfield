project('gtk-demos-examples', 'c',
        version: '4.10.5',
        default_options: [
          'buildtype=debugoptimized',
          'warning_level=1',
          # We only need c99, but glib needs GNU-specific features
          # https://github.com/mesonbuild/meson/issues/2289
          'c_std=gnu99',
        ],
        meson_version : '>= 0.60.0',
        license: 'LGPL-2.1-or-later')

gnome = import('gnome')

confinc = include_directories('.')
extra_demo_ldflags = []
os_linux = true
os_unix = true

gtk_prefix = get_option('prefix')
gtk_datadir = join_paths(gtk_prefix, get_option('datadir'))
gtk_applicationsdir = join_paths(gtk_datadir, 'applications')
gtk_schemasdir = join_paths(gtk_datadir, 'glib-2.0/schemas')
gtk_appdatadir = join_paths(gtk_datadir, 'metainfo')

# config.h
cdata = configuration_data()
cdata.set_quoted('PACKAGE_VERSION', meson.project_version())
cdata.set_quoted('GTK_DATADIR', gtk_datadir)
cdata.set_quoted('GETTEXT_PACKAGE', 'gtk40')

configure_file(output: 'config.h', configuration: cdata)

libgtk_dep = dependency('gtk4', version: '4.10.5', required: true, default_options: ['targets=wayland'])
common_cflags = []

if get_option('build-examples')
  subdir('examples')
endif

if get_option('demos')
  subdir('demos')
endif
