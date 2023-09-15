/*
 * Copyright © 2011 Benjamin Franzke
 * Copyright © 2010 Intel Corporation
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

#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <assert.h>
#include <unistd.h>
#include <sys/mman.h>
#include <signal.h>
#include <errno.h>
#include <fcntl.h>
#include <wayland-client.h>

#include "xdg-shell-client-protocol.h"

#define MAX_BUFFER_ALLOC	2
#define KEY_ESC             1 // from linux input.h

struct display {
    struct wl_display *display;
    struct wl_registry *registry;
    struct wl_compositor *compositor;
    struct xdg_wm_base *wm_base;
    struct wl_seat *seat;
    struct wl_keyboard *keyboard;
    struct wl_shm *shm;
    bool has_xrgb;
};

struct buffer {
    struct window *window;
    struct wl_buffer *buffer;
    void *shm_data;
    int busy;
    int width, height;
    size_t size;	/* width * 4 * height */
    struct wl_list buffer_link; /** window::buffer_list */
};

struct window {
    struct display *display;
    int width, height;
    int init_width, init_height;
    struct wl_surface *surface;
    struct xdg_surface *xdg_surface;
    struct xdg_toplevel *xdg_toplevel;
    struct wl_list buffer_list;
    struct buffer *prev_buffer;
    struct wl_callback *callback;
    bool wait_for_configure;
    bool maximized;
    bool fullscreen;
    bool needs_update_buffer;
};

static int running = 1;

static void
redraw(void *data, struct wl_callback *callback, uint32_t time);

static struct buffer *
alloc_buffer(struct window *window, int width, int height)
{
    struct buffer *buffer = calloc(1, sizeof(*buffer));

    buffer->width = width;
    buffer->height = height;
    wl_list_insert(&window->buffer_list, &buffer->buffer_link);

    return buffer;
}

static void
destroy_buffer(struct buffer *buffer)
{
    if (buffer->buffer)
        wl_buffer_destroy(buffer->buffer);

    munmap(buffer->shm_data, buffer->size);
    wl_list_remove(&buffer->buffer_link);
    free(buffer);
}

static struct buffer *
pick_free_buffer(struct window *window)
{
    struct buffer *b;
    struct buffer *buffer = NULL;

    wl_list_for_each(b, &window->buffer_list, buffer_link) {
        if (!b->busy) {
            buffer = b;
            break;
        }
    }

    return buffer;
}

static void
prune_old_released_buffers(struct window *window)
{
    struct buffer *b, *b_next;

    wl_list_for_each_safe(b, b_next,
                          &window->buffer_list, buffer_link) {
        if (!b->busy && (b->width != window->width ||
                         b->height != window->height))
            destroy_buffer(b);
    }
}

static void
buffer_release(void *data, struct wl_buffer *buffer)
{
    struct buffer *mybuf = data;

    mybuf->busy = 0;
}

static const struct wl_buffer_listener buffer_listener = {
        buffer_release
};

#ifndef HAVE_MKOSTEMP
static int
set_cloexec_or_close(int fd)
{
    long flags;

    if (fd == -1)
        return -1;

    flags = fcntl(fd, F_GETFD);
    if (flags == -1)
        goto err;

    if (fcntl(fd, F_SETFD, flags | FD_CLOEXEC) == -1)
        goto err;

    return fd;

    err:
    close(fd);
    return -1;
}
#endif

static int
create_tmpfile_cloexec(char *tmpname)
{
    int fd;

#ifdef HAVE_MKOSTEMP
    fd = mkostemp(tmpname, O_CLOEXEC);
	if (fd >= 0)
		unlink(tmpname);
#else
    fd = mkstemp(tmpname);
    if (fd >= 0) {
        fd = set_cloexec_or_close(fd);
        unlink(tmpname);
    }
#endif

    return fd;
}

int
os_resize_anonymous_file(int fd, off_t size)
{
#ifdef HAVE_POSIX_FALLOCATE
    sigset_t mask;
	sigset_t old_mask;

	/*
	 * posix_fallocate() might be interrupted, so we need to check
	 * for EINTR and retry in that case.
	 * However, in the presence of an alarm, the interrupt may trigger
	 * repeatedly and prevent a large posix_fallocate() to ever complete
	 * successfully, so we need to first block SIGALRM to prevent
	 * this.
	 */
	sigemptyset(&mask);
	sigaddset(&mask, SIGALRM);
	sigprocmask(SIG_BLOCK, &mask, &old_mask);
	/*
	 * Filesystems that do not support fallocate will return EINVAL or
	 * EOPNOTSUPP. In this case we need to fall back to ftruncate
	 */
	do {
		errno = posix_fallocate(fd, 0, size);
	} while (errno == EINTR);
	sigprocmask(SIG_SETMASK, &old_mask, NULL);
	if (errno == 0)
		return 0;
	else if (errno != EINVAL && errno != EOPNOTSUPP)
		return -1;
#endif
    if (ftruncate(fd, size) < 0)
        return -1;

    return 0;
}

/*
 * Create a new, unique, anonymous file of the given size, and
 * return the file descriptor for it. The file descriptor is set
 * CLOEXEC. The file is immediately suitable for mmap()'ing
 * the given size at offset zero.
 *
 * The file should not have a permanent backing store like a disk,
 * but may have if XDG_RUNTIME_DIR is not properly implemented in OS.
 *
 * The file name is deleted from the file system.
 *
 * The file is suitable for buffer sharing between processes by
 * transmitting the file descriptor over Unix sockets using the
 * SCM_RIGHTS methods.
 *
 * If the C library implements posix_fallocate(), it is used to
 * guarantee that disk space is available for the file at the
 * given size. If disk space is insufficient, errno is set to ENOSPC.
 * If posix_fallocate() is not supported, program may receive
 * SIGBUS on accessing mmap()'ed file contents instead.
 *
 * If the C library implements memfd_create(), it is used to create the
 * file purely in memory, without any backing file name on the file
 * system, and then sealing off the possibility of shrinking it.  This
 * can then be checked before accessing mmap()'ed file contents, to
 * make sure SIGBUS can't happen.  It also avoids requiring
 * XDG_RUNTIME_DIR.
 */
int
os_create_anonymous_file(off_t size)
{
    static const char template[] = "/wayland-shm-XXXXXX";
    const char *path;
    char *name;
    size_t name_size;
    int fd;

#ifdef HAVE_MEMFD_CREATE
    fd = memfd_create("wayland-cursor", MFD_CLOEXEC | MFD_ALLOW_SEALING);
	if (fd >= 0) {
		/* We can add this seal before calling posix_fallocate(), as
		 * the file is currently zero-sized anyway.
		 *
		 * There is also no need to check for the return value, we
		 * couldn't do anything with it anyway.
		 */
		fcntl(fd, F_ADD_SEALS, F_SEAL_SHRINK | F_SEAL_SEAL);
	} else
#endif
    {
        path = getenv("XDG_RUNTIME_DIR");
        if (!path || path[0] != '/') {
            errno = ENOENT;
            return -1;
        }

        name_size = strlen(path) + sizeof(template);
        name = malloc(name_size);
        if (!name)
            return -1;

        snprintf(name, name_size, "%s%s", path, template);

        fd = create_tmpfile_cloexec(name);

        free(name);

        if (fd < 0)
            return -1;
    }

    if (os_resize_anonymous_file(fd, size) < 0) {
        close(fd);
        return -1;
    }

    return fd;
}

static int
create_shm_buffer(struct window *window, struct buffer *buffer, uint32_t format)
{
    struct wl_shm_pool *pool;
    int fd, size, stride;
    void *data;
    int width, height;
    struct display *display;

    width = window->width;
    height = window->height;
    stride = width * 4;
    size = stride * height;
    display = window->display;

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
    buffer->buffer = wl_shm_pool_create_buffer(pool, 0,
                                               width, height,
                                               stride, format);
    wl_buffer_add_listener(buffer->buffer, &buffer_listener, buffer);
    wl_shm_pool_destroy(pool);
    close(fd);

    buffer->size = size;
    buffer->shm_data = data;

    return 0;
}

static void
keyboard_handle_keymap(void *data, struct wl_keyboard *keyboard,
                       uint32_t format, int fd, uint32_t size)
{
    /* Just so we don’t leak the keymap fd */
    close(fd);
}

static void
keyboard_handle_enter(void *data, struct wl_keyboard *keyboard,
                      uint32_t serial, struct wl_surface *surface,
                      struct wl_array *keys)
{
}

static void
keyboard_handle_leave(void *data, struct wl_keyboard *keyboard,
                      uint32_t serial, struct wl_surface *surface)
{
}

static void
keyboard_handle_key(void *data, struct wl_keyboard *keyboard,
                    uint32_t serial, uint32_t time, uint32_t key,
                    uint32_t state)
{
    if (key == KEY_ESC && state)
        running = 0;
}

static void
keyboard_handle_modifiers(void *data, struct wl_keyboard *keyboard,
                          uint32_t serial, uint32_t mods_depressed,
                          uint32_t mods_latched, uint32_t mods_locked,
                          uint32_t group)
{
}

static const struct wl_keyboard_listener keyboard_listener = {
        keyboard_handle_keymap,
        keyboard_handle_enter,
        keyboard_handle_leave,
        keyboard_handle_key,
        keyboard_handle_modifiers,
};

static void
seat_handle_capabilities(void *data, struct wl_seat *seat,
                         enum wl_seat_capability caps)
{
    struct display *d = data;

    if ((caps & WL_SEAT_CAPABILITY_KEYBOARD) && !d->keyboard) {
        d->keyboard = wl_seat_get_keyboard(seat);
        wl_keyboard_add_listener(d->keyboard, &keyboard_listener, d);
    } else if (!(caps & WL_SEAT_CAPABILITY_KEYBOARD) && d->keyboard) {
        wl_keyboard_destroy(d->keyboard);
        d->keyboard = NULL;
    }
}

static const struct wl_seat_listener seat_listener = {
        seat_handle_capabilities,
};

static void
handle_xdg_surface_configure(void *data, struct xdg_surface *surface,
                             uint32_t serial)
{
    struct window *window = data;

    xdg_surface_ack_configure(surface, serial);

    if (window->wait_for_configure) {
        redraw(window, NULL, 0);
        window->wait_for_configure = false;
    }
}

static const struct xdg_surface_listener xdg_surface_listener = {
        handle_xdg_surface_configure,
};

static void
handle_xdg_toplevel_configure(void *data, struct xdg_toplevel *xdg_toplevel,
                              int32_t width, int32_t height,
                              struct wl_array *states)
{
    struct window *window = data;
    uint32_t *p;

    window->fullscreen = false;
    window->maximized = false;

    wl_array_for_each(p, states) {
        uint32_t state = *p;
        switch (state) {
            case XDG_TOPLEVEL_STATE_FULLSCREEN:
                window->fullscreen = true;
                break;
            case XDG_TOPLEVEL_STATE_MAXIMIZED:
                window->maximized = true;
                break;
        }
    }

    if (width > 0 && height > 0) {
        if (!window->fullscreen && !window->maximized) {
            window->init_width = width;
            window->init_height = height;
        }
        window->width = width;
        window->height = height;
    } else if (!window->fullscreen && !window->maximized) {
        window->width = window->init_width;
        window->height = window->init_height;
    }

    window->needs_update_buffer = true;
}

static void
handle_xdg_toplevel_close(void *data, struct xdg_toplevel *xdg_toplevel)
{
    running = 0;
}

static const struct xdg_toplevel_listener xdg_toplevel_listener = {
        handle_xdg_toplevel_configure,
        handle_xdg_toplevel_close,
};

static struct window *
create_window(struct display *display, int width, int height)
{
    struct window *window;
    int i;

    window = calloc(1, sizeof *window);
    if (!window)
        return NULL;

    window->callback = NULL;
    window->display = display;
    window->width = width;
    window->height = height;
    window->init_width = width;
    window->init_height = height;
    window->surface = wl_compositor_create_surface(display->compositor);
    window->needs_update_buffer = false;
    wl_list_init(&window->buffer_list);

    if (display->wm_base) {
        window->xdg_surface =
                xdg_wm_base_get_xdg_surface(display->wm_base,
                                            window->surface);
        assert(window->xdg_surface);
        xdg_surface_add_listener(window->xdg_surface,
                                 &xdg_surface_listener, window);

        window->xdg_toplevel =
                xdg_surface_get_toplevel(window->xdg_surface);
        assert(window->xdg_toplevel);
        xdg_toplevel_add_listener(window->xdg_toplevel,
                                  &xdg_toplevel_listener, window);

        xdg_toplevel_set_title(window->xdg_toplevel, "simple-shm");
        xdg_toplevel_set_app_id(window->xdg_toplevel,
                                "org.freedesktop.weston.simple-shm");

        wl_surface_commit(window->surface);
        window->wait_for_configure = true;
    } else {
        assert(0);
    }

    for (i = 0; i < MAX_BUFFER_ALLOC; i++)
        alloc_buffer(window, window->width, window->height);

    return window;
}

static void
destroy_window(struct window *window)
{
    struct buffer *buffer, *buffer_next;

    if (window->callback)
        wl_callback_destroy(window->callback);

    wl_list_for_each_safe(buffer, buffer_next,
                          &window->buffer_list, buffer_link)
    destroy_buffer(buffer);

    if (window->xdg_toplevel)
        xdg_toplevel_destroy(window->xdg_toplevel);
    if (window->xdg_surface)
        xdg_surface_destroy(window->xdg_surface);
    wl_surface_destroy(window->surface);
    free(window);
}

static struct buffer *
window_next_buffer(struct window *window)
{
    struct buffer *buffer = NULL;
    int ret = 0;

    if (window->needs_update_buffer) {
        int i;

        for (i = 0; i < MAX_BUFFER_ALLOC; i++)
            alloc_buffer(window, window->width, window->height);

        window->needs_update_buffer = false;
    }

    buffer = pick_free_buffer(window);

    if (!buffer)
        return NULL;

    if (!buffer->buffer) {
        ret = create_shm_buffer(window, buffer, WL_SHM_FORMAT_XRGB8888);

        if (ret < 0)
            return NULL;

        /* paint the padding */
        memset(buffer->shm_data, 0xff,
               window->width * window->height * 4);
    }

    return buffer;
}

static void
paint_pixels(void *image, int padding, int width, int height, uint32_t time)
{
    const int halfh = padding + (height - padding * 2) / 2;
    const int halfw = padding + (width  - padding * 2) / 2;
    int ir, or;
    uint32_t *pixel = image;
    int y;

    /* squared radii thresholds */
    or = (halfw < halfh ? halfw : halfh) - 8;
    ir = or - 32;
    or *= or;
    ir *= ir;

    pixel += padding * width;
    for (y = padding; y < height - padding; y++) {
        int x;
        int y2 = (y - halfh) * (y - halfh);

        pixel += padding;
        for (x = padding; x < width - padding; x++) {
            uint32_t v;

            /* squared distance from center */
            int r2 = (x - halfw) * (x - halfw) + y2;

            if (r2 < ir)
                v = (r2 / 32 + time / 64) * 0x0080401;
            else if (r2 < or)
                v = (y + time / 32) * 0x0080401;
            else
                v = (x + time / 16) * 0x0080401;
            v &= 0x00ffffff;

            /* cross if compositor uses X from XRGB as alpha */
            if (abs(x - y) > 6 && abs(x + y - height) > 6)
                v |= 0xff000000;

            *pixel++ = v;
        }

        pixel += padding;
    }
}

static const struct wl_callback_listener frame_listener;

static void
redraw(void *data, struct wl_callback *callback, uint32_t time)
{
    struct window *window = data;
    struct buffer *buffer;

    prune_old_released_buffers(window);

    buffer = window_next_buffer(window);
    if (!buffer) {
        fprintf(stderr,
                !callback ? "Failed to create the first buffer.\n" :
                "Both buffers busy at redraw(). Server bug?\n");
        abort();
    }

    paint_pixels(buffer->shm_data, 20, window->width, window->height, time);

    wl_surface_attach(window->surface, buffer->buffer, 0, 0);
    wl_surface_damage(window->surface,
                      20, 20, window->width - 40, window->height - 40);

    if (callback)
        wl_callback_destroy(callback);

    window->callback = wl_surface_frame(window->surface);
    wl_callback_add_listener(window->callback, &frame_listener, window);
    wl_surface_commit(window->surface);
    buffer->busy = 1;
}

static const struct wl_callback_listener frame_listener = {
        redraw
};

static void
shm_format(void *data, struct wl_shm *wl_shm, uint32_t format)
{
    struct display *d = data;

    if (format == WL_SHM_FORMAT_XRGB8888)
        d->has_xrgb = true;
}

struct wl_shm_listener shm_listener = {
        shm_format
};

static void
xdg_wm_base_ping(void *data, struct xdg_wm_base *shell, uint32_t serial)
{
    xdg_wm_base_pong(shell, serial);
}

static const struct xdg_wm_base_listener xdg_wm_base_listener = {
        xdg_wm_base_ping,
};

static void
registry_handle_global(void *data, struct wl_registry *registry,
                       uint32_t id, const char *interface, uint32_t version)
{
    struct display *d = data;

    if (strcmp(interface, "wl_compositor") == 0) {
        d->compositor =
                wl_registry_bind(registry,
                                 id, &wl_compositor_interface, 1);
    } else if (strcmp(interface, "xdg_wm_base") == 0) {
        d->wm_base = wl_registry_bind(registry,
                                      id, &xdg_wm_base_interface, 1);
        xdg_wm_base_add_listener(d->wm_base, &xdg_wm_base_listener, d);
    } else if (strcmp(interface, "wl_seat") == 0) {
        d->seat = wl_registry_bind(registry, id,
                                   &wl_seat_interface, 1);
        wl_seat_add_listener(d->seat, &seat_listener, d);
    } else if (strcmp(interface, "wl_shm") == 0) {
        d->shm = wl_registry_bind(registry,
                                  id, &wl_shm_interface, 1);
        wl_shm_add_listener(d->shm, &shm_listener, d);
    }
}

static void
registry_handle_global_remove(void *data, struct wl_registry *registry,
                              uint32_t name)
{
}

static const struct wl_registry_listener registry_listener = {
        registry_handle_global,
        registry_handle_global_remove
};

static struct display *
create_display(void)
{
    struct display *display;

    display = calloc(1, sizeof *display);
    if (display == NULL) {
        fprintf(stderr, "out of memory\n");
        exit(1);
    }
    display->display = wl_display_connect(NULL);
    assert(display->display);

    display->has_xrgb = false;
    display->registry = wl_display_get_registry(display->display);
    wl_registry_add_listener(display->registry,
                             &registry_listener, display);
    wl_display_roundtrip(display->display);
    if (display->shm == NULL) {
        fprintf(stderr, "No wl_shm global\n");
        exit(1);
    }

    wl_display_roundtrip(display->display);

    /*
     * Why do we need two roundtrips here?
     *
     * wl_display_get_registry() sends a request to the server, to which
     * the server replies by emitting the wl_registry.global events.
     * The first wl_display_roundtrip() sends wl_display.sync. The server
     * first processes the wl_display.get_registry which includes sending
     * the global events, and then processes the sync. Therefore when the
     * sync (roundtrip) returns, we are guaranteed to have received and
     * processed all the global events.
     *
     * While we are inside the first wl_display_roundtrip(), incoming
     * events are dispatched, which causes registry_handle_global() to
     * be called for each global. One of these globals is wl_shm.
     * registry_handle_global() sends wl_registry.bind request for the
     * wl_shm global. However, wl_registry.bind request is sent after
     * the first wl_display.sync, so the reply to the sync comes before
     * the initial events of the wl_shm object.
     *
     * The initial events that get sent as a reply to binding to wl_shm
     * include wl_shm.format. These tell us which pixel formats are
     * supported, and we need them before we can create buffers. They
     * don't change at runtime, so we receive them as part of init.
     *
     * When the reply to the first sync comes, the server may or may not
     * have sent the initial wl_shm events. Therefore we need the second
     * wl_display_roundtrip() call here.
     *
     * The server processes the wl_registry.bind for wl_shm first, and
     * the second wl_display.sync next. During our second call to
     * wl_display_roundtrip() the initial wl_shm events are received and
     * processed. Finally, when the reply to the second wl_display.sync
     * arrives, it guarantees we have processed all wl_shm initial events.
     *
     * This sequence contains two examples on how wl_display_roundtrip()
     * can be used to guarantee, that all reply events to a request
     * have been received and processed. This is a general Wayland
     * technique.
     */

    if (!display->has_xrgb) {
        fprintf(stderr, "WL_SHM_FORMAT_XRGB32 not available\n");
        exit(1);
    }

    return display;
}

static void
destroy_display(struct display *display)
{
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

static void
signal_int(int signum)
{
    running = 0;
}

int
main(int argc, char **argv)
{
    struct sigaction sigint;
    struct display *display;
    struct window *window;
    int ret = 0;

    display = create_display();
    window = create_window(display, 250, 250);
    if (!window)
        return 1;

    sigint.sa_handler = signal_int;
    sigemptyset(&sigint.sa_mask);
    sigint.sa_flags = SA_RESETHAND;
    sigaction(SIGINT, &sigint, NULL);

    /* Initialise damage to full surface, so the padding gets painted */
    wl_surface_damage(window->surface, 0, 0,
                      window->width, window->height);

    if (!window->wait_for_configure)
        redraw(window, NULL, 0);

    while (running && ret != -1)
        ret = wl_display_dispatch(display->display);

    fprintf(stderr, "simple-shm exiting\n");

    destroy_window(window);
    destroy_display(display);

    return 0;
}