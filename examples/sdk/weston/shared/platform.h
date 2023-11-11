/*
 * Copyright © 2015 Collabora, Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice (including the
 * next paragraph) shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

#ifndef WESTON_PLATFORM_H
#define WESTON_PLATFORM_H

#include <stdbool.h>
#include <string.h>

#ifdef ENABLE_EGL
#include <wayland-egl.h>
#include <EGL/egl.h>
#include <EGL/eglext.h>

#include "weston-egl-ext.h"
#endif

#ifdef  __cplusplus
extern "C" {
#endif

#ifdef ENABLE_EGL

static bool
weston_check_egl_extension(const char *extensions, const char *extension)
{
	size_t extlen = strlen(extension);
	const char *end = extensions + strlen(extensions);

	while (extensions < end) {
		size_t n = 0;

		/* Skip whitespaces, if any */
		if (*extensions == ' ') {
			extensions++;
			continue;
		}

		n = strcspn(extensions, " ");

		/* Compare strings */
		if (n == extlen && strncmp(extension, extensions, n) == 0)
			return true; /* Found */

		extensions += n;
	}

	/* Not found */
	return false;
}

static inline void *
weston_platform_get_egl_proc_address(const char *address)
{
	const char *extensions = eglQueryString(EGL_NO_DISPLAY, EGL_EXTENSIONS);

	if (extensions &&
	    (weston_check_egl_extension(extensions, "EGL_EXT_platform_wayland") ||
	     weston_check_egl_extension(extensions, "EGL_KHR_platform_wayland"))) {
		return (void *) eglGetProcAddress(address);
	}

	return NULL;
}

static inline EGLDisplay
weston_platform_get_egl_display(EGLenum platform, void *native_display,
				const EGLint *attrib_list)
{
	static PFNEGLGETPLATFORMDISPLAYEXTPROC get_platform_display = NULL;

	if (!get_platform_display) {
		get_platform_display = (PFNEGLGETPLATFORMDISPLAYEXTPROC)
			weston_platform_get_egl_proc_address(
				"eglGetPlatformDisplayEXT");
	}

	if (get_platform_display)
		return get_platform_display(platform,
					    native_display, attrib_list);

	return eglGetDisplay((EGLNativeDisplayType) native_display);
}

static inline EGLSurface
weston_platform_create_egl_surface(EGLDisplay dpy, EGLConfig config,
				   void *native_window,
				   const EGLint *attrib_list)
{
	static PFNEGLCREATEPLATFORMWINDOWSURFACEEXTPROC
		create_platform_window = NULL;

	if (!create_platform_window) {
		create_platform_window = (PFNEGLCREATEPLATFORMWINDOWSURFACEEXTPROC)
			weston_platform_get_egl_proc_address(
				"eglCreatePlatformWindowSurfaceEXT");
	}

	if (create_platform_window)
		return create_platform_window(dpy, config,
					      native_window,
					      attrib_list);

	return eglCreateWindowSurface(dpy, config,
				      (EGLNativeWindowType) native_window,
				      attrib_list);
}

static inline EGLBoolean
weston_platform_destroy_egl_surface(EGLDisplay display,
				    EGLSurface surface)
{
	return eglDestroySurface(display, surface);
}

#else /* ENABLE_EGL */

static inline void *
weston_platform_get_egl_display(int platform, void *native_display,
				const int *attrib_list)
{
	return NULL;
}

static inline void *
weston_platform_create_egl_surface(void *dpy, void *config,
				   void *native_window,
				   const int *attrib_list)
{
	return NULL;
}

static inline unsigned int
weston_platform_destroy_egl_surface(void *display,
				    void *surface)
{
	return 1;
}
#endif /* ENABLE_EGL */

#ifdef  __cplusplus
}
#endif

#endif /* WESTON_PLATFORM_H */
