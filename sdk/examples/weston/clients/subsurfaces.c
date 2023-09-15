/*
 * Copyright © 2010 Intel Corporation
 * Copyright © 2011 Benjamin Franzke
 * Copyright © 2012-2013 Collabora, Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice (including the next
 * paragraph) shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

#include "config.h"

#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <cairo.h>
#include <math.h>
#include <assert.h>
#include <errno.h>

#include <linux/input.h>
#include <wayland-client.h>

#include <wayland-egl.h>
#include <GLES2/gl2.h>
#include <EGL/egl.h>
#include <EGL/eglext.h>

#include "shared/helpers.h"
#include "shared/xalloc.h"
#include <libweston/zalloc.h>
#include "window.h"

#if 0
#define DBG(fmt, ...) \
	fprintf(stderr, "%d:%s " fmt, __LINE__, __func__, ##__VA_ARGS__)
#else
#define DBG(...) do {} while (0)
#endif

static int32_t option_red_mode;
static int32_t option_triangle_mode;
static bool option_no_triangle;
static bool option_help;

static const struct weston_option options[] = {
	{ WESTON_OPTION_INTEGER, "red-mode", 'r', &option_red_mode },
	{ WESTON_OPTION_INTEGER, "triangle-mode", 't', &option_triangle_mode },
	{ WESTON_OPTION_BOOLEAN, "no-triangle", 'n', &option_no_triangle },
	{ WESTON_OPTION_BOOLEAN, "help", 'h', &option_help },
};

static enum subsurface_mode
int_to_mode(int32_t i)
{
	switch (i) {
	case 0:
		return SUBSURFACE_DESYNCHRONIZED;
	case 1:
		return SUBSURFACE_SYNCHRONIZED;
	default:
		fprintf(stderr, "error: %d is not a valid commit mode.\n", i);
		exit(1);
	}
}

static const char help_text[] =
"Usage: %s [options]\n"
"\n"
"  -r, --red-mode=MODE\t\tthe commit mode for the red sub-surface (0)\n"
"  -t, --triangle-mode=MODE\tthe commit mode for the GL sub-surface (0)\n"
"  -n, --no-triangle\t\tDo not create the GL sub-surface.\n"
"\n"
"The MODE is the wl_subsurface commit mode used by default for the\n"
"given sub-surface. Valid values are the integers:\n"
"   0\tfor desynchronized, i.e. free-running\n"
"   1\tfor synchronized\n"
"\n"
"This program demonstrates sub-surfaces with the toytoolkit.\n"
"The main surface contains the decorations, a green canvas, and a\n"
"green spinner. One sub-surface is red with a red spinner. These\n"
"are rendered with Cairo. The other sub-surface contains a spinning\n"
"triangle rendered in EGL/GLESv2, without Cairo, i.e. it is a raw GL\n"
"widget.\n"
"\n"
"The GL widget animates on its own. The spinners follow wall clock\n"
"time and update only when their surface is repainted, so you see\n"
"which surfaces get redrawn. The red sub-surface animates on its own,\n"
"but can be toggled with the spacebar.\n"
"\n"
"Even though the sub-surfaces attempt to animate on their own, they\n"
"are subject to the commit mode. If commit mode is synchronized,\n"
"they will need a commit on the main surface to actually display.\n"
"You can trigger a main surface repaint, without a resize, by\n"
"hovering the pointer over the title bar buttons.\n"
"\n"
"Resizing will temporarily toggle the commit mode of all sub-surfaces\n"
"to guarantee synchronized rendering on size changes. It also forces\n"
"a repaint of all surfaces.\n"
"\n"
"Using -t1 -r1 is especially useful for trying to catch inconsistent\n"
"rendering and deadlocks, since free-running sub-surfaces would\n"
"immediately hide the problem.\n"
"\n"
"Key controls:\n"
"  space - toggle red sub-surface animation loop\n"
"  up	 - step window size shorter\n"
"  down  - step window size taller\n"
"\n";

struct egl_state {
	EGLDisplay dpy;
	EGLContext ctx;
	EGLConfig conf;
};

struct triangle_gl_state {
	GLuint rotation_uniform;
	GLuint pos;
	GLuint col;
};

struct triangle {
	struct egl_state *egl;

	struct wl_surface *wl_surface;
	struct wl_egl_window *egl_window;
	EGLSurface egl_surface;
	int width;
	int height;

	struct triangle_gl_state gl;

	struct widget *widget;
	uint32_t time;
	struct wl_callback *frame_cb;
};

/******** Pure EGL/GLESv2/libwayland-client component: ***************/

static const char *vert_shader_text =
	"uniform mat4 rotation;\n"
	"attribute vec4 pos;\n"
	"attribute vec4 color;\n"
	"varying vec4 v_color;\n"
	"void main() {\n"
	"  gl_Position = rotation * pos;\n"
	"  v_color = color;\n"
	"}\n";

static const char *frag_shader_text =
	"precision mediump float;\n"
	"varying vec4 v_color;\n"
	"void main() {\n"
	"  gl_FragColor = v_color;\n"
	"}\n";

static void
egl_print_config_info(struct egl_state *egl)
{
	EGLint r, g, b, a;

	printf("Chosen EGL config details:\n");

	printf("\tRGBA bits");
	if (eglGetConfigAttrib(egl->dpy, egl->conf, EGL_RED_SIZE, &r) &&
	    eglGetConfigAttrib(egl->dpy, egl->conf, EGL_GREEN_SIZE, &g) &&
	    eglGetConfigAttrib(egl->dpy, egl->conf, EGL_BLUE_SIZE, &b) &&
	    eglGetConfigAttrib(egl->dpy, egl->conf, EGL_ALPHA_SIZE, &a))
		printf(": %d %d %d %d\n", r, g, b, a);
	else
		printf(" unknown\n");

	printf("\tswap interval range");
	if (eglGetConfigAttrib(egl->dpy, egl->conf, EGL_MIN_SWAP_INTERVAL, &a) &&
	    eglGetConfigAttrib(egl->dpy, egl->conf, EGL_MAX_SWAP_INTERVAL, &b))
		printf(": %d - %d\n", a, b);
	else
		printf(" unknown\n");
}

static struct egl_state *
egl_state_create(struct wl_display *display)
{
	struct egl_state *egl;

	static const EGLint context_attribs[] = {
		EGL_CONTEXT_CLIENT_VERSION, 2,
		EGL_NONE
	};

	EGLint config_attribs[] = {
		EGL_SURFACE_TYPE, EGL_WINDOW_BIT,
		EGL_RED_SIZE, 1,
		EGL_GREEN_SIZE, 1,
		EGL_BLUE_SIZE, 1,
		EGL_ALPHA_SIZE, 1,
		EGL_RENDERABLE_TYPE, EGL_OPENGL_ES2_BIT,
		EGL_NONE
	};

	EGLint major, minor, n;
	EGLBoolean ret;

	egl = zalloc(sizeof *egl);
	assert(egl);

	egl->dpy =
		weston_platform_get_egl_display(EGL_PLATFORM_WAYLAND_KHR,
						display, NULL);
	assert(egl->dpy);

	ret = eglInitialize(egl->dpy, &major, &minor);
	assert(ret == EGL_TRUE);
	ret = eglBindAPI(EGL_OPENGL_ES_API);
	assert(ret == EGL_TRUE);

	ret = eglChooseConfig(egl->dpy, config_attribs, &egl->conf, 1, &n);
	assert(ret && n == 1);

	egl->ctx = eglCreateContext(egl->dpy, egl->conf,
				    EGL_NO_CONTEXT, context_attribs);
	assert(egl->ctx);
	egl_print_config_info(egl);

	return egl;
}

static void
egl_state_destroy(struct egl_state *egl)
{
	/* Required, otherwise segfault in egl_dri2.c: dri2_make_current()
	 * on eglReleaseThread(). */
	eglMakeCurrent(egl->dpy, EGL_NO_SURFACE, EGL_NO_SURFACE,
		       EGL_NO_CONTEXT);

	eglTerminate(egl->dpy);
	eglReleaseThread();
	free(egl);
}

static void
egl_make_swapbuffers_nonblock(struct egl_state *egl)
{
	EGLint a = EGL_MIN_SWAP_INTERVAL;
	EGLint b = EGL_MAX_SWAP_INTERVAL;

	if (!eglGetConfigAttrib(egl->dpy, egl->conf, a, &a) ||
	    !eglGetConfigAttrib(egl->dpy, egl->conf, b, &b)) {
		fprintf(stderr, "warning: swap interval range unknown\n");
	} else if (a > 0) {
		fprintf(stderr, "warning: minimum swap interval is %d, "
			"while 0 is required to not deadlock on resize.\n", a);
	}

	/*
	 * We rely on the Wayland compositor to sync to vblank anyway.
	 * We just need to be able to call eglSwapBuffers() without the
	 * risk of waiting for a frame callback in it.
	 */
	if (!eglSwapInterval(egl->dpy, 0)) {
		fprintf(stderr, "error: eglSwapInterval() failed.\n");
	}
}

static GLuint
create_shader(const char *source, GLenum shader_type)
{
	GLuint shader;
	GLint status;

	shader = glCreateShader(shader_type);
	assert(shader != 0);

	glShaderSource(shader, 1, (const char **) &source, NULL);
	glCompileShader(shader);

	glGetShaderiv(shader, GL_COMPILE_STATUS, &status);
	if (!status) {
		char log[1000];
		GLsizei len;
		glGetShaderInfoLog(shader, 1000, &len, log);
		fprintf(stderr, "Error: compiling %s: %.*s\n",
			shader_type == GL_VERTEX_SHADER ? "vertex" : "fragment",
			len, log);
		exit(1);
	}

	return shader;
}

static void
triangle_init_gl(struct triangle_gl_state *trigl)
{
	GLuint frag, vert;
	GLuint program;
	GLint status;

	frag = create_shader(frag_shader_text, GL_FRAGMENT_SHADER);
	vert = create_shader(vert_shader_text, GL_VERTEX_SHADER);

	program = glCreateProgram();
	glAttachShader(program, frag);
	glAttachShader(program, vert);
	glLinkProgram(program);

	glGetProgramiv(program, GL_LINK_STATUS, &status);
	if (!status) {
		char log[1000];
		GLsizei len;
		glGetProgramInfoLog(program, 1000, &len, log);
		fprintf(stderr, "Error: linking:\n%.*s\n", len, log);
		exit(1);
	}

	glUseProgram(program);

	trigl->pos = 0;
	trigl->col = 1;

	glBindAttribLocation(program, trigl->pos, "pos");
	glBindAttribLocation(program, trigl->col, "color");
	glLinkProgram(program);

	trigl->rotation_uniform = glGetUniformLocation(program, "rotation");
}

static void
triangle_draw(const struct triangle_gl_state *trigl, uint32_t time)
{
	static const GLfloat verts[3][2] = {
		{ -0.5, -0.5 },
		{  0.5, -0.5 },
		{  0,    0.5 }
	};
	static const GLfloat colors[3][3] = {
		{ 1, 0, 0 },
		{ 0, 1, 0 },
		{ 0, 0, 1 }
	};
	GLfloat angle;
	GLfloat rotation[4][4] = {
		{ 1, 0, 0, 0 },
		{ 0, 1, 0, 0 },
		{ 0, 0, 1, 0 },
		{ 0, 0, 0, 1 }
	};
	static const int32_t speed_div = 5;

	angle = (time / speed_div) % 360 * M_PI / 180.0;
	rotation[0][0] =  cos(angle);
	rotation[0][2] =  sin(angle);
	rotation[2][0] = -sin(angle);
	rotation[2][2] =  cos(angle);

	glUniformMatrix4fv(trigl->rotation_uniform, 1, GL_FALSE,
			   (GLfloat *) rotation);

	glClearColor(0.0, 0.0, 0.0, 0.5);
	glClear(GL_COLOR_BUFFER_BIT);

	glVertexAttribPointer(trigl->pos, 2, GL_FLOAT, GL_FALSE, 0, verts);
	glVertexAttribPointer(trigl->col, 3, GL_FLOAT, GL_FALSE, 0, colors);
	glEnableVertexAttribArray(trigl->pos);
	glEnableVertexAttribArray(trigl->col);

	glDrawArrays(GL_TRIANGLES, 0, 3);

	glDisableVertexAttribArray(trigl->pos);
	glDisableVertexAttribArray(trigl->col);
}

static void
triangle_frame_callback(void *data, struct wl_callback *callback,
			uint32_t time);

static const struct wl_callback_listener triangle_frame_listener = {
	triangle_frame_callback
};

static void
triangle_frame_callback(void *data, struct wl_callback *callback,
			uint32_t time)
{
	struct triangle *tri = data;

	DBG("%stime %u\n", callback ? "" : "artificial ", time);
	assert(callback == tri->frame_cb);
	tri->time = time;

	if (callback)
		wl_callback_destroy(callback);

	eglMakeCurrent(tri->egl->dpy, tri->egl_surface,
				   tri->egl_surface, tri->egl->ctx);

	glViewport(0, 0, tri->width, tri->height);

	triangle_draw(&tri->gl, tri->time);

	tri->frame_cb = wl_surface_frame(tri->wl_surface);
	wl_callback_add_listener(tri->frame_cb, &triangle_frame_listener, tri);

	eglSwapBuffers(tri->egl->dpy, tri->egl_surface);
}

static void
triangle_create_egl_surface(struct triangle *tri, int width, int height)
{
	EGLBoolean ret;

	tri->wl_surface = widget_get_wl_surface(tri->widget);
	tri->egl_window = wl_egl_window_create(tri->wl_surface, width, height);
	tri->egl_surface = weston_platform_create_egl_surface(tri->egl->dpy,
							      tri->egl->conf,
							      tri->egl_window, NULL);

	ret = eglMakeCurrent(tri->egl->dpy, tri->egl_surface,
			     tri->egl_surface, tri->egl->ctx);
	assert(ret == EGL_TRUE);

	egl_make_swapbuffers_nonblock(tri->egl);
	triangle_init_gl(&tri->gl);
}

/********* The widget code interfacing the toolkit agnostic code: **********/

static void
triangle_resize_handler(struct widget *widget,
			int32_t width, int32_t height, void *data)
{
	struct triangle *tri = data;

	DBG("to %dx%d\n", width, height);
	tri->width = width;
	tri->height = height;

	if (tri->egl_surface) {
		wl_egl_window_resize(tri->egl_window, width, height, 0, 0);
	} else {
		triangle_create_egl_surface(tri, width, height);
		triangle_frame_callback(tri, NULL, 0);
	}
}

static void
triangle_redraw_handler(struct widget *widget, void *data)
{
	struct triangle *tri = data;
	int w, h;

	wl_egl_window_get_attached_size(tri->egl_window, &w, &h);

	DBG("previous %dx%d, new %dx%d\n", w, h, tri->width, tri->height);

	/* If size is not changing, do not redraw ahead of time.
	 * That would risk blocking in eglSwapbuffers().
	 */
	if (w == tri->width && h == tri->height)
		return;

	if (tri->frame_cb) {
		wl_callback_destroy(tri->frame_cb);
		tri->frame_cb = NULL;
	}
	triangle_frame_callback(tri, NULL, tri->time);
}

static void
set_empty_input_region(struct widget *widget, struct display *display)
{
	struct wl_compositor *compositor;
	struct wl_surface *surface;
	struct wl_region *region;

	compositor = display_get_compositor(display);
	surface = widget_get_wl_surface(widget);
	region = wl_compositor_create_region(compositor);
	wl_surface_set_input_region(surface, region);
	wl_region_destroy(region);
}

static struct triangle *
triangle_create(struct window *window, struct egl_state *egl)
{
	struct triangle *tri;

	tri = xzalloc(sizeof *tri);

	tri->egl = egl;
	tri->widget = window_add_subsurface(window, tri,
		int_to_mode(option_triangle_mode));
	widget_set_use_cairo(tri->widget, 0);
	widget_set_resize_handler(tri->widget, triangle_resize_handler);
	widget_set_redraw_handler(tri->widget, triangle_redraw_handler);

	set_empty_input_region(tri->widget, window_get_display(window));

	return tri;
}

static void
triangle_destroy(struct triangle *tri)
{
	if (tri->egl_surface)
		weston_platform_destroy_egl_surface(tri->egl->dpy,
						    tri->egl_surface);

	if (tri->egl_window)
		wl_egl_window_destroy(tri->egl_window);

	widget_destroy(tri->widget);
	free(tri);
}

/************** The toytoolkit application code: *********************/

struct demoapp {
	struct display *display;
	struct window *window;
	struct widget *widget;
	struct widget *subsurface;

	struct egl_state *egl;
	struct triangle *triangle;

	int animate;
};

static void
draw_spinner(cairo_t *cr, const struct rectangle *rect, uint32_t time)
{
	double cx, cy, r, angle;
	unsigned t;

	cx = rect->x + rect->width / 2;
	cy = rect->y + rect->height / 2;
	r = (rect->width < rect->height ? rect->width : rect->height) * 0.3;
	t = time % 2000;
	angle = t * (M_PI / 500.0);

	cairo_set_line_width(cr, 4.0);

	if (t < 1000)
		cairo_arc(cr, cx, cy, r, 0.0, angle);
	else
		cairo_arc(cr, cx, cy, r, angle, 0.0);

	cairo_stroke(cr);
}

static void
sub_redraw_handler(struct widget *widget, void *data)
{
	struct demoapp *app = data;
	cairo_t *cr;
	struct rectangle allocation;
	uint32_t time;

	widget_get_allocation(app->subsurface, &allocation);

	cr = widget_cairo_create(widget);
	cairo_set_operator(cr, CAIRO_OPERATOR_SOURCE);

	/* debug: paint whole surface magenta; no magenta should show */
	cairo_set_source_rgba(cr, 0.9, 0.0, 0.9, 1.0);
	cairo_paint(cr);

	cairo_rectangle(cr,
			allocation.x,
			allocation.y,
			allocation.width,
			allocation.height);
	cairo_clip(cr);

	cairo_set_source_rgba(cr, 0.8, 0, 0, 0.8);
	cairo_paint(cr);

	time = widget_get_last_time(widget);
	cairo_set_source_rgba(cr, 1.0, 0.5, 0.5, 1.0);
	draw_spinner(cr, &allocation, time);

	cairo_destroy(cr);

	if (app->animate)
		widget_schedule_redraw(app->subsurface);
	DBG("%dx%d @ %d,%d, last time %u\n",
	    allocation.width, allocation.height,
	    allocation.x, allocation.y, time);
}

static void
sub_resize_handler(struct widget *widget,
		   int32_t width, int32_t height, void *data)
{
	DBG("%dx%d\n", width, height);
	widget_input_region_add(widget, NULL);
}

static void
redraw_handler(struct widget *widget, void *data)
{
	struct demoapp *app = data;
	cairo_t *cr;
	struct rectangle allocation;
	uint32_t time;

	widget_get_allocation(app->widget, &allocation);

	cr = widget_cairo_create(widget);
	cairo_set_operator(cr, CAIRO_OPERATOR_SOURCE);
	cairo_rectangle(cr,
			allocation.x,
			allocation.y,
			allocation.width,
			allocation.height);
	cairo_set_source_rgba(cr, 0, 0.8, 0, 0.8);
	cairo_fill(cr);

	time = widget_get_last_time(widget);
	cairo_set_source_rgba(cr, 0.5, 1.0, 0.5, 1.0);
	draw_spinner(cr, &allocation, time);

	cairo_destroy(cr);

	DBG("%dx%d @ %d,%d, last time %u\n",
	    allocation.width, allocation.height,
	    allocation.x, allocation.y, time);
}

static void
resize_handler(struct widget *widget,
	       int32_t width, int32_t height, void *data)
{
	struct demoapp *app = data;
	struct rectangle area;
	int side, h;

	widget_get_allocation(widget, &area);

	side = area.width < area.height ? area.width / 2 : area.height / 2;
	h = area.height - side;

	widget_set_allocation(app->subsurface,
			      area.x + area.width - side,
			      area.y,
			      side, h);

	if (app->triangle) {
		widget_set_allocation(app->triangle->widget,
				      area.x + area.width - side,
				      area.y + h,
				      side, side);
	}

	DBG("green %dx%d, red %dx%d, GL %dx%d\n",
	    area.width, area.height, side, h, side, side);
}

static void
keyboard_focus_handler(struct window *window,
		       struct input *device, void *data)
{
	struct demoapp *app = data;

	window_schedule_redraw(app->window);
}

static void
key_handler(struct window *window, struct input *input, uint32_t time,
	    uint32_t key, uint32_t sym,
	    enum wl_keyboard_key_state state, void *data)
{
	struct demoapp *app = data;
	struct rectangle winrect;

	if (state == WL_KEYBOARD_KEY_STATE_RELEASED)
		return;

	switch (sym) {
	case XKB_KEY_space:
		app->animate = !app->animate;
		window_schedule_redraw(window);
		break;
	case XKB_KEY_Up:
		window_get_allocation(window, &winrect);
		winrect.height -= 100;
		if (winrect.height < 150)
			winrect.height = 150;
		window_schedule_resize(window, winrect.width, winrect.height);
		break;
	case XKB_KEY_Down:
		window_get_allocation(window, &winrect);
		winrect.height += 100;
		if (winrect.height > 600)
			winrect.height = 600;
		window_schedule_resize(window, winrect.width, winrect.height);
		break;
	case XKB_KEY_Escape:
		display_exit(app->display);
		break;
	}
}

static struct demoapp *
demoapp_create(struct display *display)
{
	struct demoapp *app;

	app = xzalloc(sizeof *app);

	app->egl = egl_state_create(display_get_display(display));

	app->display = display;
	display_set_user_data(app->display, app);

	app->window = window_create(app->display);
	app->widget = window_frame_create(app->window, app);
	window_set_title(app->window, "Wayland Sub-surface Demo");
	window_set_appid(app->window,
			 "org.freedesktop.weston.wayland-sub-surface-demo");

	window_set_key_handler(app->window, key_handler);
	window_set_user_data(app->window, app);
	window_set_keyboard_focus_handler(app->window, keyboard_focus_handler);

	widget_set_redraw_handler(app->widget, redraw_handler);
	widget_set_resize_handler(app->widget, resize_handler);

	app->subsurface = window_add_subsurface(app->window, app,
		int_to_mode(option_red_mode));
	widget_set_redraw_handler(app->subsurface, sub_redraw_handler);
	widget_set_resize_handler(app->subsurface, sub_resize_handler);

	if (app->egl && !option_no_triangle)
		app->triangle = triangle_create(app->window, app->egl);

	/* minimum size */
	widget_schedule_resize(app->widget, 100, 100);

	/* initial size */
	widget_schedule_resize(app->widget, 400, 300);

	app->animate = 1;

	return app;
}

static void
demoapp_destroy(struct demoapp *app)
{
	if (app->triangle)
		triangle_destroy(app->triangle);

	if (app->egl)
		egl_state_destroy(app->egl);

	widget_destroy(app->subsurface);
	widget_destroy(app->widget);
	window_destroy(app->window);
	free(app);
}

int
main(int argc, char *argv[])
{
	struct display *display;
	struct demoapp *app;

	if (parse_options(options, ARRAY_LENGTH(options), &argc, argv) > 1
	    || option_help) {
		printf(help_text, argv[0]);
		return 0;
	}

	display = display_create(&argc, argv);
	if (display == NULL) {
		fprintf(stderr, "failed to create display: %s\n",
			strerror(errno));
		return -1;
	}

	if (!display_has_subcompositor(display)) {
		fprintf(stderr, "compositor does not support "
			"the subcompositor extension\n");
		return -1;
	}

	app = demoapp_create(display);

	display_run(display);

	demoapp_destroy(app);
	display_destroy(display);

	return 0;
}
