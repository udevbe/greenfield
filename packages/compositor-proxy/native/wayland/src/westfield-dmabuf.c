#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include "westfield-dmabuf.h"
#include "westfield-util.h"

void
dmabuf_attributes_finish(struct dmabuf_attributes *attribs) {
    for (int i = 0; i < attribs->n_planes; ++i) {
        close(attribs->fd[i]);
        attribs->fd[i] = -1;
    }
    attribs->n_planes = 0;
}

bool
dmabuf_attributes_copy(struct dmabuf_attributes *dst,  const struct dmabuf_attributes *src) {
    memcpy(dst, src, sizeof(struct dmabuf_attributes));

    int i;
    for (i = 0; i < src->n_planes; ++i) {
        dst->fd[i] = fcntl(src->fd[i], F_DUPFD_CLOEXEC, 0);
        if (dst->fd[i] < 0) {
            wfl_log_errno(stderr, "fcntl(F_DUPFD_CLOEXEC) failed");
            goto error;
        }
    }

    return true;

    error:
    for (int j = 0; j < i; j++) {
        close(dst->fd[j]);
        dst->fd[j] = -1;
    }
    dst->n_planes = 0;
    return false;
}
