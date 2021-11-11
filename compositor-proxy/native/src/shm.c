//
// Created by erik on 11/11/21.
//

#include <westfield-extra.h>
#include <glib.h>
#include <gst/gstbuffer.h>

void
wayland_shm_to_gst_format(enum wl_shm_format wl_shm_format, char **gst_format) {
    if(wl_shm_format == WL_SHM_FORMAT_ARGB8888) {
        *gst_format = "BGRA";
    }
    else if(wl_shm_format == WL_SHM_FORMAT_XRGB8888) {
        *gst_format = "BGRx";
    }
}

struct shm_pool_ref {
    struct wl_shm_buffer *buffer;
    struct wl_shm_pool *pool;
};

static void
handle_gst_buffer_destroyed(gpointer data) {
    struct shm_pool_ref *shm_pool_ref = data;
    wl_shm_pool_unref(shm_pool_ref->pool);
    wl_shm_buffer_end_access(shm_pool_ref->buffer);
    free(shm_pool_ref);
}

GstBuffer *
wl_shm_buffer_to_gst_buffer(struct wl_shm_buffer *shm_buffer, uint32_t *width, uint32_t *height, char** gst_format) {
    GstBuffer *buffer;
    void *buffer_data;
    struct shm_pool_ref *pool_ref;
    struct wl_shm_pool *shm_pool;
    enum wl_shm_format buffer_format;
    uint32_t buffer_width, buffer_height, buffer_stride;
    gsize buffer_size;

    buffer_format = wl_shm_buffer_get_format(shm_buffer);
    wayland_shm_to_gst_format(buffer_format, gst_format);
    if (*gst_format == NULL) {
        return NULL;
    }

    shm_pool = wl_shm_buffer_ref_pool(shm_buffer);
    wl_shm_buffer_begin_access(shm_buffer);

    buffer_data = wl_shm_buffer_get_data(shm_buffer);
    buffer_stride = wl_shm_buffer_get_stride(shm_buffer);
    buffer_width = wl_shm_buffer_get_width(shm_buffer);
    buffer_height = wl_shm_buffer_get_height(shm_buffer);
    buffer_size = buffer_stride * buffer_height;

    *width = buffer_width;
    *height = buffer_height;

    pool_ref = calloc(1, sizeof(struct shm_pool_ref));
    pool_ref->buffer = shm_buffer;
    pool_ref->pool = shm_pool;

    buffer = gst_buffer_new_wrapped_full(0, (gpointer) buffer_data, buffer_size, 0, buffer_size, pool_ref,
                                         handle_gst_buffer_destroyed);

    return buffer;
}
