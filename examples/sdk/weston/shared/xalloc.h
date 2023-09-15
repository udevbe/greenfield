/*
 * Copyright © 2008 Kristian Høgsberg
 * Copyright 2022 Collabora, Ltd.
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

#ifndef WESTON_XALLOC_H
#define WESTON_XALLOC_H

#ifdef  __cplusplus
extern "C" {
#endif

#include <errno.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

static inline void *
abort_oom_if_null(void *p)
{
	static const char oommsg[] = ": out of memory\n";
	size_t written __attribute__((unused));

	if (p)
		return p;

	written = write(STDERR_FILENO, program_invocation_short_name,
		        strlen(program_invocation_short_name));
	written = write(STDERR_FILENO, oommsg, strlen(oommsg));

	abort();
}

#define xmalloc(s) (abort_oom_if_null(malloc(s)))
#define xzalloc(s) (abort_oom_if_null(calloc(1, s)))
#define xcalloc(n, s) (abort_oom_if_null(calloc(n, s)))
#define xstrdup(s) (abort_oom_if_null(strdup(s)))
#define xrealloc(p, s) (abort_oom_if_null(realloc(p, s)))

#ifdef  __cplusplus
}
#endif

#endif /* WESTON_XALLOC_H */
