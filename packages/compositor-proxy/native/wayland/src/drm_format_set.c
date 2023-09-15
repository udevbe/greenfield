#include <assert.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include "drm_format_set.h"
#include "westfield-util.h"

void drm_format_set_finish(struct drm_format_set *set) {
    for (size_t i = 0; i < set->len; ++i) {
        free(set->formats[i]);
    }
    free(set->formats);

    set->len = 0;
    set->capacity = 0;
    set->formats = NULL;
}

static struct drm_format **format_set_get_ref(struct drm_format_set *set,
                                                  uint32_t format) {
    for (size_t i = 0; i < set->len; ++i) {
        if (set->formats[i]->format == format) {
            return &set->formats[i];
        }
    }

    return NULL;
}

const struct drm_format *drm_format_set_get(
        const struct drm_format_set *set, uint32_t format) {
    struct drm_format **ptr =
            format_set_get_ref((struct drm_format_set *)set, format);
    return ptr ? *ptr : NULL;
}

bool drm_format_set_has(const struct drm_format_set *set,
                            uint32_t format, uint64_t modifier) {
    const struct drm_format *fmt = drm_format_set_get(set, format);
    if (!fmt) {
        return false;
    }
    return drm_format_has(fmt, modifier);
}

bool drm_format_set_add(struct drm_format_set *set, uint32_t format,
                            uint64_t modifier) {
    struct drm_format **ptr = format_set_get_ref(set, format);
    if (ptr) {
        return drm_format_add(ptr, modifier);
    }

    struct drm_format *fmt = drm_format_create(format);
    if (!fmt) {
        return false;
    }
    if (!drm_format_add(&fmt, modifier)) {
        return false;
    }

    if (set->len == set->capacity) {
        size_t new = set->capacity ? set->capacity * 2 : 4;

        struct drm_format **tmp = realloc(set->formats,
                                              sizeof(*fmt) + sizeof(fmt->modifiers[0]) * new);
        if (!tmp) {
            wfl_log_errno(stderr, "Allocation failed");
            free(fmt);
            return false;
        }

        set->capacity = new;
        set->formats = tmp;
    }

    set->formats[set->len++] = fmt;
    return true;
}

struct drm_format *drm_format_create(uint32_t format) {
    size_t capacity = 4;
    struct drm_format *fmt =
            calloc(1, sizeof(*fmt) + sizeof(fmt->modifiers[0]) * capacity);
    if (!fmt) {
        wfl_log_errno(stderr, "Allocation failed");
        return NULL;
    }
    fmt->format = format;
    fmt->capacity = capacity;
    return fmt;
}

bool drm_format_has(const struct drm_format *fmt, uint64_t modifier) {
    for (size_t i = 0; i < fmt->len; ++i) {
        if (fmt->modifiers[i] == modifier) {
            return true;
        }
    }
    return false;
}

bool drm_format_add(struct drm_format **fmt_ptr, uint64_t modifier) {
    struct drm_format *fmt = *fmt_ptr;

    if (drm_format_has(fmt, modifier)) {
        return true;
    }

    if (fmt->len == fmt->capacity) {
        size_t capacity = fmt->capacity ? fmt->capacity * 2 : 4;

        fmt = realloc(fmt, sizeof(*fmt) + sizeof(fmt->modifiers[0]) * capacity);
        if (!fmt) {
            wfl_log_errno(stderr, "Allocation failed");
            return false;
        }

        fmt->capacity = capacity;
        *fmt_ptr = fmt;
    }

    fmt->modifiers[fmt->len++] = modifier;
    return true;
}

struct drm_format *drm_format_dup(const struct drm_format *format) {
    assert(format->len <= format->capacity);
    size_t format_size = sizeof(struct drm_format) +
                         format->capacity * sizeof(format->modifiers[0]);
    struct drm_format *duped_format = malloc(format_size);
    if (duped_format == NULL) {
        return NULL;
    }
    memcpy(duped_format, format, format_size);
    return duped_format;
}

bool drm_format_set_copy(struct drm_format_set *dst, const struct drm_format_set *src) {
    struct drm_format **formats = malloc(src->len * sizeof(formats[0]));
    if (formats == NULL) {
        return false;
    }

    struct drm_format_set out = {
            .len = 0,
            .capacity = src->len,
            .formats = formats,
    };

    size_t i;
    for (i = 0; i < src->len; i++) {
        out.formats[out.len] = drm_format_dup(src->formats[i]);
        if (out.formats[out.len] == NULL) {
            drm_format_set_finish(&out);
            return false;
        }
        out.len++;
    }

    *dst = out;

    return true;
}

struct drm_format *drm_format_intersect(
        const struct drm_format *a, const struct drm_format *b) {
    assert(a->format == b->format);

    size_t format_cap = a->len < b->len ? a->len : b->len;
    size_t format_size = sizeof(struct drm_format) +
                         format_cap * sizeof(a->modifiers[0]);
    struct drm_format *format = calloc(1, format_size);
    if (format == NULL) {
        wfl_log_errno(stderr, "Allocation failed");
        return NULL;
    }
    format->format = a->format;
    format->capacity = format_cap;

    for (size_t i = 0; i < a->len; i++) {
        for (size_t j = 0; j < b->len; j++) {
            if (a->modifiers[i] == b->modifiers[j]) {
                assert(format->len < format->capacity);
                format->modifiers[format->len] = a->modifiers[i];
                format->len++;
                break;
            }
        }
    }

    // If the intersection is empty, then the formats aren't compatible with
    // each other.
    if (format->len == 0) {
        free(format);
        return NULL;
    }

    return format;
}

bool drm_format_set_intersect(struct drm_format_set *dst,
                                  const struct drm_format_set *a, const struct drm_format_set *b) {
    assert(dst != a && dst != b);

    struct drm_format_set out = {0};
    out.capacity = a->len < b->len ? a->len : b->len;
    out.formats = calloc(out.capacity, sizeof(struct drm_format *));
    if (out.formats == NULL) {
        wfl_log_errno(stderr, "Allocation failed");
        return false;
    }

    for (size_t i = 0; i < a->len; i++) {
        for (size_t j = 0; j < b->len; j++) {
            if (a->formats[i]->format == b->formats[j]->format) {
                // When the two formats have no common modifier, keep
                // intersecting the rest of the formats: they may be compatible
                // with each other
                struct drm_format *format =
                        drm_format_intersect(a->formats[i], b->formats[j]);
                if (format != NULL) {
                    out.formats[out.len] = format;
                    out.len++;
                }
                break;
            }
        }
    }

    if (out.len == 0) {
        drm_format_set_finish(&out);
        return false;
    }

    *dst = out;
    return true;
}
