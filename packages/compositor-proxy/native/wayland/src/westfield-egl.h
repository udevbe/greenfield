#ifndef WESTFIELD_WESTFIELD_EGL_H
#define WESTFIELD_WESTFIELD_EGL_H

#include <stdio.h>
#include <errno.h>
#include <EGL/egl.h>
#include <EGL/eglext.h>
#include "wayland-server/wayland-server-core.h"
#include "westfield-dmabuf.h"
#include "westfield-util.h"

struct westfield_egl;

struct westfield_egl*
westfield_egl_new(char* device_path);

void
westfield_egl_finalize(struct westfield_egl *westfield_egl);

EGLDisplay
westfield_egl_get_display(struct westfield_egl *westfield_egl);

EGLContext
westfield_egl_get_context(struct westfield_egl *westfield_egl);

EGLDeviceEXT
westfield_egl_get_device(struct westfield_egl *westfield_egl);

EGLConfig
westfield_egl_get_config(struct westfield_egl *westfield_egl);

int
westfield_egl_get_device_fd(struct westfield_egl *westfield_egl);

const struct drm_format_set*
westfield_egl_get_dmabuf_texture_formats(struct westfield_egl *westfield_egl);

EGLImageKHR
westfield_egl_create_image_from_dmabuf(struct westfield_egl *westfield_egl,
                                       const struct dmabuf_attributes *attributes, bool *external_only);

void
westfield_egl_destroy_image(struct westfield_egl *westfield_egl, EGLImageKHR egl_image);

#endif //WESTFIELD_WESTFIELD_EGL_H
