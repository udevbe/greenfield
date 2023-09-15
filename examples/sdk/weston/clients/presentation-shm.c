/*
 * Copyright © 2011 Benjamin Franzke
 * Copyright © 2010 Intel Corporation
 * Copyright © 2014 Collabora, Ltd.
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
#include <stdbool.h>
#include <assert.h>
#include <unistd.h>
#include <sys/mman.h>
#include <signal.h>
#include <time.h>
#include <errno.h>

#include <wayland-client.h>
#include "shared/helpers.h"
#include <libweston/zalloc.h>
#include "shared/timespec-util.h"
#include "shared/os-compatibility.h"
#include "presentation-time-client-protocol.h"
#include "xdg-shell-client-protocol.h"

enum run_mode {
	RUN_MODE_FEEDBACK,
	RUN_MODE_FEEDBACK_IDLE,
	RUN_MODE_PRESENT,
};

static const char * const run_mode_name[] = {
	[RUN_MODE_FEEDBACK] = "feedback",
	[RUN_MODE_FEEDBACK_IDLE] = "feedback-idle",
	[RUN_MODE_PRESENT] = "low-lat present",
};

struct output {
	struct wl_output *output;
	uint32_t name;
	struct wl_list link;
};

struct display {
	struct wl_display *display;
	struct wl_registry *registry;
	struct wl_compositor *compositor;
	struct xdg_wm_base *wm_base;

	struct wl_shm *shm;
	uint32_t formats;

	struct wp_presentation *presentation;
	clockid_t clk_id;

	struct wl_list output_list; /* struct output::link */
};

struct feedback {
	struct window *window;
	unsigned frame_no;
	struct wp_presentation_feedback *feedback;
	struct timespec commit;
	struct timespec target;
	uint32_t frame_stamp;
	struct wl_list link;
	struct timespec present;
};

struct buffer {
	struct wl_buffer *buffer;
	void *shm_data;
	int busy;
};

struct window {
	struct display *display;
	int width, height;
	enum run_mode mode;
	struct wl_surface *surface;
	struct xdg_surface *xdg_surface;
	struct xdg_toplevel *xdg_toplevel;
	uint32_t configure_serial;

	struct buffer *buffers;
	int num_buffers;
	int next;
	int refresh_nsec;
	int commit_delay_msecs;

	struct wl_callback *callback;
	struct wl_list feedback_list;

	struct feedback *received_feedback;
};

#define NSEC_PER_SEC 1000000000

static void
buffer_release(void *data, struct wl_buffer *buffer)
{
	struct buffer *mybuf = data;

	mybuf->busy = 0;
}

static const struct wl_buffer_listener buffer_listener = {
	buffer_release
};

static int
create_shm_buffers(struct display *display, struct buffer **buffers,
		   int num_buffers, int width, int height, uint32_t format)
{
	struct buffer *bufs;
	struct wl_shm_pool *pool;
	int fd, size, stride, offset;
	void *data;
	int i;

	stride = width * 4;
	size = stride * height * num_buffers;

	fd = os_create_anonymous_file(size);
	if (fd < 0) {
		fprintf(stderr, "creating a buffer file for %d B failed: %s\n",
			size, strerror(errno));
		return -1;
	}

	data = mmap(NULL, size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
	if (data == MAP_FAILED) {
		fprintf(stderr, "mmap failed: %s\n", strerror(errno));
		close(fd);
		return -1;
	}

	pool = wl_shm_create_pool(display->shm, fd, size);
	offset = 0;

	bufs = calloc(num_buffers, sizeof(*bufs));
	assert(bufs);

	for (i = 0; i < num_buffers; i++) {
		bufs[i].buffer = wl_shm_pool_create_buffer(pool, offset,
							   width, height,
							   stride, format);
		assert(bufs[i].buffer);
		wl_buffer_add_listener(bufs[i].buffer,
				       &buffer_listener, &bufs[i]);

		bufs[i].shm_data = (char *)data + offset;
		offset += stride * height;
	}

	wl_shm_pool_destroy(pool);
	close(fd);

	*buffers = bufs;

	return 0;
}

static void
xdg_wm_base_handle_ping(void *data, struct xdg_wm_base *xdg_wm_base,
			uint32_t serial)
{
	xdg_wm_base_pong(xdg_wm_base, serial);
}

static const struct xdg_wm_base_listener xdg_wm_base_listener = {
	.ping = xdg_wm_base_handle_ping,
};

static void
xdg_surface_handle_configure(void *data, struct xdg_surface *xdg_surface,
			     uint32_t serial)
{
	struct window *window = data;

	window->configure_serial = serial;
}

static const struct xdg_surface_listener xdg_surface_listener = {
	.configure = xdg_surface_handle_configure,
};


static void
xdg_toplevel_handle_configure(void *data, struct xdg_toplevel *xdg_toplevel,
			      int32_t width, int32_t height,
			      struct wl_array *states)
{
	/* noop */
}

static void
xdg_toplevel_handle_close(void *data, struct xdg_toplevel *xdg_toplevel)
{
	fprintf(stderr, "presentation-shm exiting\n");
	exit(0);
}

static const struct xdg_toplevel_listener xdg_toplevel_listener = {
	.configure = xdg_toplevel_handle_configure,
	.close = xdg_toplevel_handle_close,
};

static struct window *
create_window(struct display *display, int width, int height,
	      enum run_mode mode, int commit_delay_msecs)
{
	struct window *window;
	char title[128];
	int ret;

	snprintf(title, sizeof(title),
		 "presentation-shm: %s [Delay %i msecs]", run_mode_name[mode],
		 commit_delay_msecs);

	window = zalloc(sizeof *window);
	if (!window)
		return NULL;

	window->commit_delay_msecs = commit_delay_msecs;
	window->mode = mode;
	window->callback = NULL;
	wl_list_init(&window->feedback_list);
	window->display = display;
	window->width = width;
	window->height = height;
	window->surface = wl_compositor_create_surface(display->compositor);
	window->xdg_surface = xdg_wm_base_get_xdg_surface(display->wm_base,
							  window->surface);

	if (!window->xdg_surface)
		return NULL;

	window->xdg_toplevel = xdg_surface_get_toplevel(window->xdg_surface);

	if (!window->xdg_toplevel)
		return NULL;

	xdg_wm_base_add_listener(display->wm_base, &xdg_wm_base_listener,
				 NULL);
	xdg_surface_add_listener(window->xdg_surface, &xdg_surface_listener,
				 window);
	xdg_toplevel_add_listener(window->xdg_toplevel, &xdg_toplevel_listener,
				  window);

	xdg_toplevel_set_title(window->xdg_toplevel, title);
	xdg_toplevel_set_min_size(window->xdg_toplevel, width, height);
	xdg_toplevel_set_max_size(window->xdg_toplevel, width, height);

	wl_surface_commit(window->surface);
	wl_display_roundtrip(window->display->display);

	window->num_buffers = 60;
	window->refresh_nsec = NSEC_PER_SEC / 60; /* 60 Hz guess */
	window->next = 0;
	ret = create_shm_buffers(window->display,
				 &window->buffers, window->num_buffers,
				 window->width, window->height,
				 WL_SHM_FORMAT_XRGB8888);
	assert(ret == 0);

	return window;
}

static void
destroy_feedback(struct feedback *feedback)
{
	if (feedback->feedback)
		wp_presentation_feedback_destroy(feedback->feedback);

	wl_list_remove(&feedback->link);
	free(feedback);
}

static void
destroy_window(struct window *window)
{
	int i;

	while (!wl_list_empty(&window->feedback_list)) {
		struct feedback *f;

		f = wl_container_of(window->feedback_list.next, f, link);
		printf("clean up feedback %u\n", f->frame_no);
		destroy_feedback(f);
	}

	if (window->callback)
		wl_callback_destroy(window->callback);

	xdg_surface_destroy(window->xdg_surface);
	wl_surface_destroy(window->surface);

	for (i = 0; i < window->num_buffers; i++)
		wl_buffer_destroy(window->buffers[i].buffer);
	/* munmap(window->buffers[0].shm_data, size); */
	free(window->buffers);

	free(window);
}

static struct buffer *
window_next_buffer(struct window *window)
{
	struct buffer *buf = &window->buffers[window->next];

	window->next = (window->next + 1) % window->num_buffers;

	return buf;
}

static void
paint_pixels(void *image, int width, int height, uint32_t phase)
{
	const int halfh = height / 2;
	const int halfw = width / 2;
	uint32_t *pixel = image;
	int y, or;
	double ang = M_PI * 2.0 / 1000000.0 * phase;
	double s = sin(ang);
	double c = cos(ang);

	/* squared radii thresholds */
	or = (halfw < halfh ? halfw : halfh) - 16;
	or *= or;

	for (y = 0; y < height; y++) {
		int x;
		int oy = y - halfh;
		int y2 = oy * oy;

		for (x = 0; x < width; x++) {
			int ox = x - halfw;
			uint32_t v = 0xff000000;
			double rx, ry;

			if (ox * ox + y2 > or) {
				if (ox * oy > 0)
					*pixel++ = 0xff000000;
				else
					*pixel++ = 0xffffffff;
				continue;
			}

			rx = c * ox + s * oy;
			ry = -s * ox + c * oy;

			if (rx < 0.0)
				v |= 0x00ff0000;
			if (ry < 0.0)
				v |= 0x0000ff00;
			if ((rx < 0.0) == (ry < 0.0))
				v |= 0x000000ff;

			*pixel++ = v;
		}
	}
}

static void
feedback_sync_output(void *data,
		     struct wp_presentation_feedback *presentation_feedback,
		     struct wl_output *output)
{
	/* not interested */
}

static char *
pflags_to_str(uint32_t flags, char *str, unsigned len)
{
	static const struct {
		uint32_t flag;
		char sym;
	} desc[] = {
		{ WP_PRESENTATION_FEEDBACK_KIND_VSYNC, 's' },
		{ WP_PRESENTATION_FEEDBACK_KIND_HW_CLOCK, 'c' },
		{ WP_PRESENTATION_FEEDBACK_KIND_HW_COMPLETION, 'e' },
		{ WP_PRESENTATION_FEEDBACK_KIND_ZERO_COPY, 'z' },
	};
	unsigned i;

	*str = '\0';
	if (len < ARRAY_LENGTH(desc) + 1)
		return str;

	for (i = 0; i < ARRAY_LENGTH(desc); i++)
		str[i] = flags & desc[i].flag ? desc[i].sym : '_';
	str[ARRAY_LENGTH(desc)] = '\0';

	return str;
}

static uint32_t
timespec_to_ms(const struct timespec *ts)
{
	return (uint32_t)ts->tv_sec * 1000 + ts->tv_nsec / 1000000;
}

static int
timespec_diff_to_usec(const struct timespec *a, const struct timespec *b)
{
	time_t secs = a->tv_sec - b->tv_sec;
	long nsec = a->tv_nsec - b->tv_nsec;

	return secs * 1000000 + nsec / 1000;
}

static void
feedback_presented(void *data,
		   struct wp_presentation_feedback *presentation_feedback,
		   uint32_t tv_sec_hi,
		   uint32_t tv_sec_lo,
		   uint32_t tv_nsec,
		   uint32_t refresh_nsec,
		   uint32_t seq_hi,
		   uint32_t seq_lo,
		   uint32_t flags)
{
	struct feedback *feedback = data;
	struct window *window = feedback->window;
	struct feedback *prev_feedback = window->received_feedback;
	uint64_t seq = u64_from_u32s(seq_hi, seq_lo);
	const struct timespec *prevpresent;
	uint32_t commit, present;
	uint32_t f2c, c2p, f2p;
	int p2p, t2p;
	char flagstr[10];

	timespec_from_proto(&feedback->present, tv_sec_hi, tv_sec_lo, tv_nsec);
	commit = timespec_to_ms(&feedback->commit);
	present = timespec_to_ms(&feedback->present);

	if (prev_feedback)
		prevpresent = &prev_feedback->present;
	else
		prevpresent = &feedback->present;

	f2c = commit - feedback->frame_stamp;
	c2p = present - commit;
	f2p = present - feedback->frame_stamp;
	p2p = timespec_diff_to_usec(&feedback->present, prevpresent);
	t2p = timespec_diff_to_usec(&feedback->present, &feedback->target);

	switch (window->mode) {
	case RUN_MODE_PRESENT:
		printf("%6u: c2p %4u ms, p2p %5d us, t2p %6d us, [%s] "
			"seq %" PRIu64 "\n", feedback->frame_no, c2p,
			p2p, t2p,
			pflags_to_str(flags, flagstr, sizeof(flagstr)), seq);
		break;
	case RUN_MODE_FEEDBACK:
	case RUN_MODE_FEEDBACK_IDLE:
		printf("%6u: f2c %2u ms, c2p %2u ms, f2p %2u ms, p2p %5d us, "
			"t2p %6d, [%s], seq %" PRIu64 "\n", feedback->frame_no,
			f2c, c2p, f2p, p2p, t2p,
			pflags_to_str(flags, flagstr, sizeof(flagstr)), seq);
	}

	if (window->received_feedback)
		destroy_feedback(window->received_feedback);
	window->received_feedback = feedback;
}

static void
feedback_discarded(void *data,
		   struct wp_presentation_feedback *presentation_feedback)
{
	struct feedback *feedback = data;

	printf("discarded %u\n", feedback->frame_no);

	destroy_feedback(feedback);
}

static const struct wp_presentation_feedback_listener feedback_listener = {
	feedback_sync_output,
	feedback_presented,
	feedback_discarded
};

static void
window_emulate_rendering(struct window *window)
{
	struct timespec delay;
	int ret;

	if (window->commit_delay_msecs <= 0)
		return;

	delay.tv_sec = window->commit_delay_msecs / 1000;
	delay.tv_nsec = (window->commit_delay_msecs % 1000) * 1000000;

	ret = nanosleep(&delay, NULL);
	if (ret)
		printf("nanosleep failed: %s\n", strerror(errno));
}

static void
window_create_feedback(struct window *window, uint32_t frame_stamp)
{
	static unsigned seq;
	struct wp_presentation *pres = window->display->presentation;
	struct feedback *feedback;

	seq++;

	if (!pres)
		return;

	feedback = zalloc(sizeof *feedback);
	if (!feedback)
		return;

	feedback->window = window;
	feedback->feedback = wp_presentation_feedback(pres, window->surface);
	wp_presentation_feedback_add_listener(feedback->feedback,
					      &feedback_listener, feedback);

	feedback->frame_no = seq;

	clock_gettime(window->display->clk_id, &feedback->commit);
	feedback->frame_stamp = frame_stamp;
	feedback->target = feedback->commit;

	wl_list_insert(&window->feedback_list, &feedback->link);
}

static void
window_commit_next(struct window *window)
{
	struct buffer *buffer;

	buffer = window_next_buffer(window);
	assert(buffer);

	if (window->configure_serial) {
		xdg_surface_ack_configure(window->xdg_surface,
					  window->configure_serial);
		window->configure_serial = 0;
	}

	wl_surface_attach(window->surface, buffer->buffer, 0, 0);
	wl_surface_damage(window->surface, 0, 0, window->width, window->height);
	wl_surface_commit(window->surface);
	buffer->busy = 1;
}

static const struct wl_callback_listener frame_listener_mode_feedback;

static void
redraw_mode_feedback(void *data, struct wl_callback *callback, uint32_t time)
{
	struct window *window = data;

	if (callback && window->mode == RUN_MODE_FEEDBACK_IDLE)
		sleep(1);

	if (callback)
		wl_callback_destroy(callback);

	window_emulate_rendering(window);

	window->callback = wl_surface_frame(window->surface);
	wl_callback_add_listener(window->callback,
				 &frame_listener_mode_feedback, window);

	window_create_feedback(window, time);
	window_commit_next(window);
}

static const struct wl_callback_listener frame_listener_mode_feedback = {
	redraw_mode_feedback
};

static const struct wp_presentation_feedback_listener feedkick_listener;

static void
window_feedkick(struct window *window)
{
	struct wp_presentation *pres = window->display->presentation;
	struct wp_presentation_feedback *fback;

	fback = wp_presentation_feedback(pres, window->surface);
	wp_presentation_feedback_add_listener(fback, &feedkick_listener,
					      window);
}

static void
feedkick_presented(void *data,
		   struct wp_presentation_feedback *presentation_feedback,
		   uint32_t tv_sec_hi,
		   uint32_t tv_sec_lo,
		   uint32_t tv_nsec,
		   uint32_t refresh_nsec,
		   uint32_t seq_hi,
		   uint32_t seq_lo,
		   uint32_t flags)
{
	struct window *window = data;

	wp_presentation_feedback_destroy(presentation_feedback);
	window->refresh_nsec = refresh_nsec;

	switch (window->mode) {
	case RUN_MODE_PRESENT:
		window_emulate_rendering(window);
		window_create_feedback(window, 0);
		window_feedkick(window);
		window_commit_next(window);
		break;
	case RUN_MODE_FEEDBACK:
	case RUN_MODE_FEEDBACK_IDLE:
		assert(0 && "bad mode");
	}
}

static void
feedkick_discarded(void *data,
		   struct wp_presentation_feedback *presentation_feedback)
{
	struct window *window = data;

	wp_presentation_feedback_destroy(presentation_feedback);

	switch (window->mode) {
	case RUN_MODE_PRESENT:
		window_emulate_rendering(window);
		window_create_feedback(window, 0);
		window_feedkick(window);
		window_commit_next(window);
		break;
	case RUN_MODE_FEEDBACK:
	case RUN_MODE_FEEDBACK_IDLE:
		assert(0 && "bad mode");
	}
}

static const struct wp_presentation_feedback_listener feedkick_listener = {
	feedback_sync_output,
	feedkick_presented,
	feedkick_discarded
};

static void
firstdraw_mode_burst(struct window *window)
{
	window_emulate_rendering(window);

	switch (window->mode) {
	case RUN_MODE_PRESENT:
		window_create_feedback(window, 0);
		break;
	case RUN_MODE_FEEDBACK:
	case RUN_MODE_FEEDBACK_IDLE:
		assert(0 && "bad mode");
	}

	window_feedkick(window);
	window_commit_next(window);
}

static void
window_prerender(struct window *window)
{
	int i;
	int timefactor = 1000000 / window->num_buffers;

	for (i = 0; i < window->num_buffers; i++) {
		struct buffer *buf = &window->buffers[i];

		if (buf->busy)
			fprintf(stderr, "wl_buffer id %u) busy\n",
				wl_proxy_get_id(
					(struct wl_proxy *)buf->buffer));

		paint_pixels(buf->shm_data, window->width, window->height,
			     i * timefactor);
	}
}

static void
output_destroy(struct output *o)
{
	wl_output_destroy(o->output);
	wl_list_remove(&o->link);
	free(o);
}

static void
display_add_output(struct display *d, uint32_t name, uint32_t version)
{
	struct output *o;

	o = zalloc(sizeof(*o));
	assert(o);

	o->output = wl_registry_bind(d->registry, name,
				     &wl_output_interface, 1);
	o->name = name;
	wl_list_insert(&d->output_list, &o->link);
}

static void
presentation_clock_id(void *data, struct wp_presentation *presentation,
		      uint32_t clk_id)
{
	struct display *d = data;

	d->clk_id = clk_id;
}

static const struct wp_presentation_listener presentation_listener = {
	presentation_clock_id
};

static void
shm_format(void *data, struct wl_shm *wl_shm, uint32_t format)
{
	struct display *d = data;

	d->formats |= (1 << format);
}

static const struct wl_shm_listener shm_listener = {
	shm_format
};

static void
registry_handle_global(void *data, struct wl_registry *registry,
		       uint32_t name, const char *interface, uint32_t version)
{
	struct display *d = data;

	if (strcmp(interface, "wl_compositor") == 0) {
		d->compositor =
			wl_registry_bind(registry,
					 name, &wl_compositor_interface, 1);
	} else if (strcmp(interface, "xdg_wm_base") == 0) {
		d->wm_base =
			wl_registry_bind(registry, name,
					 &xdg_wm_base_interface, 1);
	} else if (strcmp(interface, "wl_shm") == 0) {
		d->shm = wl_registry_bind(registry,
					  name, &wl_shm_interface, 1);
		wl_shm_add_listener(d->shm, &shm_listener, d);
	} else if (strcmp(interface, "wl_output") == 0) {
		display_add_output(d, name, version);
	} else if (strcmp(interface, wp_presentation_interface.name) == 0) {
		d->presentation =
			wl_registry_bind(registry,
					 name, &wp_presentation_interface, 1);
		wp_presentation_add_listener(d->presentation,
					     &presentation_listener, d);
	}
}

static void
registry_handle_global_remove(void *data, struct wl_registry *registry,
			      uint32_t name)
{
	struct display *d = data;
	struct output *output, *otmp;

	wl_list_for_each_safe(output, otmp, &d->output_list, link) {
		if (output->name != name)
			continue;

		output_destroy(output);
	}
}

static const struct wl_registry_listener registry_listener = {
	registry_handle_global,
	registry_handle_global_remove
};

static struct display *
create_display(void)
{
	struct display *display;

	display = malloc(sizeof *display);
	if (display == NULL) {
		fprintf(stderr, "out of memory\n");
		exit(1);
	}
	display->display = wl_display_connect(NULL);
	assert(display->display);

	display->formats = 0;
	display->clk_id = -1;
	wl_list_init(&display->output_list);
	display->registry = wl_display_get_registry(display->display);
	wl_registry_add_listener(display->registry,
				 &registry_listener, display);
	wl_display_roundtrip(display->display);
	if (display->shm == NULL) {
		fprintf(stderr, "No wl_shm global\n");
		exit(1);
	}

	wl_display_roundtrip(display->display);

	if (!(display->formats & (1 << WL_SHM_FORMAT_XRGB8888))) {
		fprintf(stderr, "WL_SHM_FORMAT_XRGB32 not available\n");
		exit(1);
	}

	wl_display_get_fd(display->display);

	return display;
}

static void
destroy_display(struct display *display)
{
	while (!wl_list_empty(&display->output_list)) {
		struct output *o;

		o = wl_container_of(display->output_list.next, o, link);
		output_destroy(o);
	}

	if (display->shm)
		wl_shm_destroy(display->shm);

	if (display->wm_base)
		xdg_wm_base_destroy(display->wm_base);

	if (display->compositor)
		wl_compositor_destroy(display->compositor);

	wl_registry_destroy(display->registry);
	wl_display_flush(display->display);
	wl_display_disconnect(display->display);
	free(display);
}

static int running = 1;

static void
signal_int(int signum)
{
	running = 0;
}

static void
usage(const char *prog, int exit_code)
{
	fprintf(stderr, "Usage: %s [mode] [options]\n"
		"where 'mode' is one of\n"
		"  -f\t\trun in feedback mode (default)\n"
		"  -i\t\trun in feedback-idle mode; sleep 1s between frames\n"
		"  -p\t\trun in low-latency presentation mode\n"
		"and 'options' may include\n"
		"  -d msecs\temulate the time used for rendering by a delay \n"
		"\t\tof the given milliseconds before commit\n\n",
		prog);

	fprintf(stderr, "Printed timing statistics, depending on mode:\n"
		"  commit sequence number\n"
		"  f2c: time from frame callback timestamp to commit\n"
		"  c2p: time from commit to presentation\n"
		"  f2p: time from frame callback timestamp to presentation\n"
		"  p2p: time from previous presentation to this one\n"
		"  t2p: time from target timestamp to presentation\n"
		"  seq: MSC\n");


	exit(exit_code);
}

int
main(int argc, char **argv)
{
	struct sigaction sigint;
	struct display *display;
	struct window *window;
	int ret = 0;
	enum run_mode mode = RUN_MODE_FEEDBACK;
	int i;
	int commit_delay_msecs = 0;

	for (i = 1; i < argc; i++) {
		if (strcmp("-f", argv[i]) == 0)
			mode = RUN_MODE_FEEDBACK;
		else if (strcmp("-i", argv[i]) == 0)
			mode = RUN_MODE_FEEDBACK_IDLE;
		else if (strcmp("-p", argv[i]) == 0)
			mode = RUN_MODE_PRESENT;
		else if ((strcmp("-d", argv[i]) == 0) && (i + 1 < argc)) {
			i++;
			commit_delay_msecs = atoi(argv[i]);
		}
		else
			usage(argv[0], EXIT_FAILURE);
	}

	display = create_display();
	window = create_window(display, 250, 250, mode, commit_delay_msecs);
	if (!window)
		return 1;

	sigint.sa_handler = signal_int;
	sigemptyset(&sigint.sa_mask);
	sigint.sa_flags = SA_RESETHAND;
	sigaction(SIGINT, &sigint, NULL);

	window_prerender(window);

	switch (mode) {
	case RUN_MODE_FEEDBACK:
	case RUN_MODE_FEEDBACK_IDLE:
		redraw_mode_feedback(window, NULL, 0);
		break;
	case RUN_MODE_PRESENT:
		firstdraw_mode_burst(window);
		break;
	}

	while (running && ret != -1)
		ret = wl_display_dispatch(display->display);

	fprintf(stderr, "presentation-shm exiting\n");
	destroy_window(window);
	destroy_display(display);

	return 0;
}
