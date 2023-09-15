/*
 * Copyright © 2012 Collabora, Ltd.
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

#ifndef OS_COMPATIBILITY_H
#define OS_COMPATIBILITY_H

#include "config.h"

#include <sys/types.h>

int
os_fd_clear_cloexec(int fd);

int
os_fd_set_cloexec(int fd);

int
os_socketpair_cloexec(int domain, int type, int protocol, int *sv);

int
os_epoll_create_cloexec(void);

int
os_create_anonymous_file(off_t size);

char *
strchrnul(const char *s, int c);

struct ro_anonymous_file;

enum ro_anonymous_file_mapmode {
	RO_ANONYMOUS_FILE_MAPMODE_PRIVATE,
	RO_ANONYMOUS_FILE_MAPMODE_SHARED,
};

struct ro_anonymous_file *
os_ro_anonymous_file_create(size_t size,
			    const char *data);

void
os_ro_anonymous_file_destroy(struct ro_anonymous_file *file);

size_t
os_ro_anonymous_file_size(struct ro_anonymous_file *file);

int
os_ro_anonymous_file_get_fd(struct ro_anonymous_file *file,
			    enum ro_anonymous_file_mapmode mapmode);

int
os_ro_anonymous_file_put_fd(int fd);

#endif /* OS_COMPATIBILITY_H */
