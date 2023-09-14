#include <string.h>
#include <assert.h>
#include "westfield-buffer.h"
#include "addon.h"

void westfield_buffer_init(struct westfield_buffer *buffer,
                     const struct westfield_buffer_impl *impl, int width, int height) {
    assert(impl->destroy);
    if (impl->begin_data_ptr_access || impl->end_data_ptr_access) {
        assert(impl->begin_data_ptr_access && impl->end_data_ptr_access);
    }

    memset(buffer, 0, sizeof(*buffer));
    buffer->impl = impl;
    buffer->width = width;
    buffer->height = height;
    wl_signal_init(&buffer->events.destroy);
    wl_signal_init(&buffer->events.release);
    addon_set_init(&buffer->addons);
}
static void
buffer_consider_destroy(struct westfield_buffer *buffer) {
    if (!buffer->dropped) {
        return;
    }

    wl_signal_emit(&buffer->events.destroy, NULL);
    addon_set_finish(&buffer->addons);

    buffer->impl->destroy(buffer);
}


void
westfield_buffer_drop(struct westfield_buffer *buffer) {
    if (buffer == NULL) {
        return;
    }

    assert(!buffer->dropped);
    buffer->dropped = true;
    buffer_consider_destroy(buffer);
}