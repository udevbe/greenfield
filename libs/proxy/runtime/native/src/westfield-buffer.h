//
// Created by erik on 8/06/22.
//

#ifndef WESTFIELD_WESTFIELD_BUFFER_H
#define WESTFIELD_WESTFIELD_BUFFER_H

#include <stdbool.h>
#include <stdint.h>
#include <stddef.h>
#include "wayland-server/wayland-server-core.h"
#include "addon.h"
#include "westfield-dmabuf.h"

/**
 * A buffer containing pixel data.
 *
 * A buffer has a single producer (the party who created the buffer) and
 * multiple consumers (parties reading the buffer). When all consumers are done
 * with the buffer, it gets released and can be re-used by the producer. When
 * the producer and all consumers are done with the buffer, it gets destroyed.
 */
struct westfield_buffer {
    const struct westfield_buffer_impl *impl;

    int width, height;

    bool dropped;
//    size_t n_locks;
//    bool accessing_data_ptr;

    struct {
        struct wl_signal destroy;
        struct wl_signal release;
    } events;

    struct addon_set addons;
};

struct westfield_buffer_impl {
    void (*destroy)(struct westfield_buffer *buffer);
    bool (*get_dmabuf)(struct westfield_buffer *buffer,
                       struct dmabuf_attributes *attribs);
//    bool (*get_shm)(struct westfield_buffer *buffer,
//                    struct westfield_shm_attributes *attribs);
    bool (*begin_data_ptr_access)(struct westfield_buffer *buffer, uint32_t flags,
                                  void **data, uint32_t *format, size_t *stride);
    void (*end_data_ptr_access)(struct westfield_buffer *buffer);
};

/**
 * Initialize a buffer. This function should be called by producers. The
 * initialized buffer is referenced: once the producer is done with the buffer
 * they should call wlr_buffer_drop().
 */
void
westfield_buffer_init(struct westfield_buffer *buffer, const struct westfield_buffer_impl *impl, int width, int height);

void
westfield_buffer_drop(struct westfield_buffer *buffer);

#endif //WESTFIELD_WESTFIELD_BUFFER_H
