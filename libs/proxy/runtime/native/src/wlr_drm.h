#ifndef WESTFIELD_WLR_DRM_H
#define WESTFIELD_WLR_DRM_H

#include "wayland-server/wayland-server-core.h"
#include "westfield-egl.h"
#include "westfield-buffer.h"
#include "westfield-dmabuf.h"
#include "drm_format_set.h"

struct wlr_drm_buffer {
    struct westfield_buffer base;

    struct wl_resource *resource; // can be NULL if the client destroyed it
    struct dmabuf_attributes dmabuf;

    struct wl_listener release;
};

/**
 * A stub implementation of Mesa's wl_drm protocol.
 *
 * It only implements the minimum necessary for modern clients to behave
 * properly. In particular, flink handles are left unimplemented.
 */
struct wlr_drm {
    struct wl_global *global;

    struct {
        struct wl_signal destroy;
    } events;

    // private state

    char *node_name;
    struct drm_format_set formats;

    struct wl_listener display_destroy;
};

bool wlr_drm_buffer_is_resource(struct wl_resource *resource);

struct wlr_drm_buffer *wlr_drm_buffer_from_resource(
        struct wl_resource *resource);

struct wlr_drm *wlr_drm_create(struct wl_display *display,
                               struct westfield_egl *renderer);

#endif //WESTFIELD_WLR_DRM_H
