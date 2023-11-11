#ifndef WLR_TYPES_WLR_LINUX_DMABUF_H
#define WLR_TYPES_WLR_LINUX_DMABUF_H

#include <stdint.h>
#include <sys/stat.h>
#include <wayland-server-core.h>
#include "drm_format_set.h"
#include "westfield-egl.h"
#include "westfield-buffer.h"


struct wlr_dmabuf_v1_buffer {
    struct westfield_buffer base;

    struct wl_resource *resource; // can be NULL if the client destroyed it
    struct dmabuf_attributes attributes;

    // private state

    struct wl_listener release;
};

/**
 * Returns true if the given resource was created via the linux-dmabuf
 * buffer protocol, false otherwise
 */
bool wlr_dmabuf_v1_resource_is_buffer(struct wl_resource *buffer_resource);

/**
 * Returns the struct wlr_dmabuf_buffer if the given resource was created
 * via the linux-dmabuf buffer protocol.
 */
struct wlr_dmabuf_v1_buffer *wlr_dmabuf_v1_buffer_from_buffer_resource(
        struct wl_resource *buffer_resource);


/**
 * Create the linux-dmabuf-unstable-v1 global.
 *
 * The default DMA-BUF feedback is initialized from the struct westfield_egl.
 */
struct wlr_linux_dmabuf_v1 *wlr_linux_dmabuf_v1_create_with_renderer(struct wl_display *display,
                                                                     int version, struct westfield_egl *renderer);

#endif
