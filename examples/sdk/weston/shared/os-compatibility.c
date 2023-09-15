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

#include "config.h"

#include <sys/types.h>
#include <sys/socket.h>
#include <unistd.h>
#include <fcntl.h>
#include <errno.h>
#include <sys/epoll.h>
#include <string.h>
#include <stdlib.h>
#include <libweston/zalloc.h>
#include <sys/mman.h>

#include "os-compatibility.h"

#define READONLY_SEALS (F_SEAL_SHRINK | F_SEAL_GROW | F_SEAL_WRITE)

int
os_fd_clear_cloexec(int fd)
{
	int flags;

	flags = fcntl(fd, F_GETFD);
	if (flags == -1)
		return -1;

	if (fcntl(fd, F_SETFD, flags & ~(int)FD_CLOEXEC) == -1)
		return -1;

	return 0;
}

int
os_fd_set_cloexec(int fd)
{
	int flags;

	if (fd == -1)
		return -1;

	flags = fcntl(fd, F_GETFD);
	if (flags == -1)
		return -1;

	if (fcntl(fd, F_SETFD, flags | FD_CLOEXEC) == -1)
		return -1;

	return 0;
}

static int
set_cloexec_or_close(int fd)
{
	if (os_fd_set_cloexec(fd) != 0) {
		close(fd);
		return -1;
	}
	return fd;
}

int
os_socketpair_cloexec(int domain, int type, int protocol, int *sv)
{
	int ret;

#ifdef SOCK_CLOEXEC
	ret = socketpair(domain, type | SOCK_CLOEXEC, protocol, sv);
	if (ret == 0 || errno != EINVAL)
		return ret;
#endif

	ret = socketpair(domain, type, protocol, sv);
	if (ret < 0)
		return ret;

	sv[0] = set_cloexec_or_close(sv[0]);
	sv[1] = set_cloexec_or_close(sv[1]);

	if (sv[0] != -1 && sv[1] != -1)
		return 0;

	close(sv[0]);
	close(sv[1]);
	return -1;
}

int
os_epoll_create_cloexec(void)
{
	int fd;

#ifdef EPOLL_CLOEXEC
	fd = epoll_create1(EPOLL_CLOEXEC);
	if (fd >= 0)
		return fd;
	if (errno != EINVAL)
		return -1;
#endif

	fd = epoll_create(1);
	return set_cloexec_or_close(fd);
}

static int
create_tmpfile_cloexec(char *tmpname)
{
	int fd;

#ifdef HAVE_MKOSTEMP
	fd = mkostemp(tmpname, O_CLOEXEC);
	if (fd >= 0)
		unlink(tmpname);
#else
	fd = mkstemp(tmpname);
	if (fd >= 0) {
		fd = set_cloexec_or_close(fd);
		unlink(tmpname);
	}
#endif

	return fd;
}

/*
 * Create a new, unique, anonymous file of the given size, and
 * return the file descriptor for it. The file descriptor is set
 * CLOEXEC. The file is immediately suitable for mmap()'ing
 * the given size at offset zero.
 *
 * The file should not have a permanent backing store like a disk,
 * but may have if XDG_RUNTIME_DIR is not properly implemented in OS.
 *
 * The file name is deleted from the file system.
 *
 * The file is suitable for buffer sharing between processes by
 * transmitting the file descriptor over Unix sockets using the
 * SCM_RIGHTS methods.
 *
 * If the C library implements posix_fallocate(), it is used to
 * guarantee that disk space is available for the file at the
 * given size. If disk space is insufficient, errno is set to ENOSPC.
 * If posix_fallocate() is not supported, program may receive
 * SIGBUS on accessing mmap()'ed file contents instead.
 *
 * If the C library implements memfd_create(), it is used to create the
 * file purely in memory, without any backing file name on the file
 * system, and then sealing off the possibility of shrinking it.  This
 * can then be checked before accessing mmap()'ed file contents, to
 * make sure SIGBUS can't happen.  It also avoids requiring
 * XDG_RUNTIME_DIR.
 */
int
os_create_anonymous_file(off_t size)
{
	static const char template[] = "/weston-shared-XXXXXX";
	const char *path;
	char *name;
	int fd;
	int ret;

#ifdef HAVE_MEMFD_CREATE
	fd = memfd_create("weston-shared", MFD_CLOEXEC | MFD_ALLOW_SEALING);
	if (fd >= 0) {
		/* We can add this seal before calling posix_fallocate(), as
		 * the file is currently zero-sized anyway.
		 *
		 * There is also no need to check for the return value, we
		 * couldn't do anything with it anyway.
		 */
		fcntl(fd, F_ADD_SEALS, F_SEAL_SHRINK);
	} else
#endif
	{
		path = getenv("XDG_RUNTIME_DIR");
		if (!path) {
			errno = ENOENT;
			return -1;
		}

		name = malloc(strlen(path) + sizeof(template));
		if (!name)
			return -1;

		strcpy(name, path);
		strcat(name, template);

		fd = create_tmpfile_cloexec(name);

		free(name);

		if (fd < 0)
			return -1;
	}

#ifdef HAVE_POSIX_FALLOCATE
	do {
		ret = posix_fallocate(fd, 0, size);
	} while (ret == EINTR);
	if (ret != 0) {
		close(fd);
		errno = ret;
		return -1;
	}
#else
	do {
		ret = ftruncate(fd, size);
	} while (ret < 0 && errno == EINTR);
	if (ret < 0) {
		close(fd);
		return -1;
	}
#endif

	return fd;
}

char *
strchrnul(const char *s, int c)
{
	while (*s && *s != c)
		s++;
	return (char *)s;
}

struct ro_anonymous_file {
	int fd;
	size_t size;
};

/** Create a new anonymous read-only file of the given size and the given data
 *
 * \param size The size of \p data.
 * \param data The data of the file with the size \p size.
 * \return A new \c ro_anonymous_file, or NULL on failure.
 *
 * The intended use-case is for sending mid-sized data from the compositor
 * to clients.
 * If the function fails errno is set.
 */
struct ro_anonymous_file *
os_ro_anonymous_file_create(size_t size,
			    const char *data)
{
	struct ro_anonymous_file *file;
	void *map;

	file = zalloc(sizeof *file);
	if (!file) {
		errno = ENOMEM;
		return NULL;
	}

	file->size = size;
	file->fd = os_create_anonymous_file(size);
	if (file->fd == -1)
		goto err_free;

	map = mmap(NULL, size, PROT_READ | PROT_WRITE, MAP_SHARED, file->fd, 0);
	if (map == MAP_FAILED)
		goto err_close;

	memcpy(map, data, size);

	munmap(map, size);

#ifdef HAVE_MEMFD_CREATE
	/* try to put seals on the file to make it read-only so that we can
	 * return the fd later directly when support_shared is not set.
	 * os_ro_anonymous_file_get_fd can handle the fd even if it is not
	 * sealed read-only and will instead create a new anonymous file on
	 * each invocation.
	 */
	fcntl(file->fd, F_ADD_SEALS, READONLY_SEALS);
#endif

	return file;

err_close:
	close(file->fd);
err_free:
	free(file);
	return NULL;
}

/** Destroy an anonymous read-only file
 *
 * \param file The file to destroy.
 */
void
os_ro_anonymous_file_destroy(struct ro_anonymous_file *file)
{
	close(file->fd);
	free(file);
}

/** Get the size of an anonymous read-only file
 *
 * \param file The file to get the size of.
 * \return The size of the file.
 */
size_t
os_ro_anonymous_file_size(struct ro_anonymous_file *file)
{
	return file->size;
}

/** Returns a file descriptor for the given file, ready to be send to a client.
 *
 * \param file The file for which to get a file descriptor.
 * \param mapmode Describes the ways in which the returned file descriptor can
 * be used with mmap.
 * \return A file descriptor for the given file that can be send to a client
 * or -1 on failure.
 *
 * The returned file descriptor must not be shared between multiple clients.
 * When \p mapmode is RO_ANONYMOUS_FILE_MAPMODE_PRIVATE the file descriptor is
 * only guaranteed to be mmapable with \c MAP_PRIVATE, when \p mapmode is
 * RO_ANONYMOUS_FILE_MAPMODE_SHARED the file descriptor can be mmapped with
 * either MAP_PRIVATE or MAP_SHARED.
 * When you're done with the fd you must call \c os_ro_anonymous_file_put_fd
 * instead of calling \c close.
 * If the function fails errno is set.
 */
int
os_ro_anonymous_file_get_fd(struct ro_anonymous_file *file,
			    enum ro_anonymous_file_mapmode mapmode)
{
	void *src, *dst;
	int fd;

#ifdef HAVE_MEMFD_CREATE
	int seals = fcntl(file->fd, F_GET_SEALS);

	/* file was sealed for read-only and we don't have to support MAP_SHARED
	 * so we can simply pass the memfd fd
	 */
	if (seals != -1 && mapmode == RO_ANONYMOUS_FILE_MAPMODE_PRIVATE &&
	    (seals & READONLY_SEALS) == READONLY_SEALS)
		return file->fd;
#endif

	/* for all other cases we create a new anonymous file that can be mapped
	 * with MAP_SHARED and copy the contents to it and return that instead
	 */
	fd = os_create_anonymous_file(file->size);
	if (fd == -1)
		return fd;

	src = mmap(NULL, file->size, PROT_READ, MAP_PRIVATE, file->fd, 0);
	if (src == MAP_FAILED) {
		close(fd);
		return -1;
	}

	dst = mmap(NULL, file->size, PROT_WRITE, MAP_SHARED, fd, 0);
	if (dst == MAP_FAILED) {
		close(fd);
		munmap(src, file->size);
		return -1;
	}

	memcpy(dst, src, file->size);
	munmap(src, file->size);
	munmap(dst, file->size);

	return fd;
}

/** Release a file descriptor returned by \c os_ro_anonymous_file_get_fd
 *
 * \param fd A file descriptor returned by \c os_ro_anonymous_file_get_fd.
 * \return 0 on success, or -1 on failure.
 *
 * This function must be called for every file descriptor created with
 * \c os_ro_anonymous_file_get_fd to not leake any resources.
 * If the function fails errno is set.
 */
int
os_ro_anonymous_file_put_fd(int fd)
{
#ifdef HAVE_MEMFD_CREATE
	int seals = fcntl(fd, F_GET_SEALS);
	if (seals == -1 && errno != EINVAL)
		return -1;

	/* The only case in which we do NOT have to close the file is when the file
	 * was sealed for read-only
	 */
	if (seals != -1 && (seals & READONLY_SEALS) == READONLY_SEALS)
		return 0;
#endif

	close(fd);
	return 0;
}
