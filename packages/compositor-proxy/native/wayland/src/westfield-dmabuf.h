//
// Created by erik on 9/06/22.
//

#ifndef WESTFIELD_WESTFIELD_DMABUF_H
#define WESTFIELD_WESTFIELD_DMABUF_H

#include <stdbool.h>
#include <stdint.h>

#define WESTFIELD_DMABUF_MAX_PLANES 4

/**
 * A Linux DMA-BUF pixel buffer.
 *
 * If the buffer was allocated with explicit modifiers enabled, the `modifier`
 * field must not be INVALID.
 *
 * If the buffer was allocated with explicit modifiers disabled (either because
 * the driver doesn't support it, or because the user didn't specify a valid
 * modifier list), the `modifier` field can have two values: INVALID means that
 * an implicit vendor-defined modifier is in use, LINEAR means that the buffer
 * is linear. The `modifier` field must not have any other value.
 *
 * When importing a DMA-BUF, users must not ignore the modifier unless it's
 * INVALID or LINEAR. In particular, users must not import a DMA-BUF to a
 * legacy API which doesn't support specifying an explicit modifier unless the
 * modifier is set to INVALID or LINEAR.
 */
struct dmabuf_attributes {
    int32_t width, height;
    uint32_t format; // FourCC code, see DRM_FORMAT_* in <drm_fourcc.h>
    uint64_t modifier; // see DRM_FORMAT_MOD_* in <drm_fourcc.h>

    int n_planes;
    uint32_t offset[WESTFIELD_DMABUF_MAX_PLANES];
    uint32_t stride[WESTFIELD_DMABUF_MAX_PLANES];
    int fd[WESTFIELD_DMABUF_MAX_PLANES];
};

/**
 * Marks all file descriptors in the DMA-BUF attributes as invalid.
 */
void dmabuf_attributes_finish(struct dmabuf_attributes *attribs);

#endif //WESTFIELD_WESTFIELD_DMABUF_H