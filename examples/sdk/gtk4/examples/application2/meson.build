app2_resources = gnome.compile_resources('exampleapp2_resources',
  'exampleapp.gresource.xml',
  source_dir: meson.current_source_dir())

executable('exampleapp2',
  'exampleapp.c', 'exampleappwin.c', 'main.c', app2_resources,
  dependencies: libgtk_dep,
  c_args: common_cflags,
  name_suffix: 'html')
