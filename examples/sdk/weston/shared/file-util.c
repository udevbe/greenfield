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

#include "config.h"

#include <stdio.h>
#include <errno.h>
#include <time.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdlib.h>

#include "file-util.h"

static int
current_time_str(char *str, size_t len, const char *fmt)
{
	time_t t;
	struct tm *t_local;
	int ret;

	t = time(NULL);
	t_local = localtime(&t);
	if (!t_local) {
		errno = ETIME;
		return -1;
	}

	ret = strftime(str, len, fmt, t_local);
	if (ret == 0) {
		errno = ETIME;
		return -1;
	}

	return ret;
}

static int
create_file_excl(const char *fname)
{
	return open(fname, O_RDWR | O_CLOEXEC | O_CREAT | O_EXCL, 00666);
}

/** Create a unique file with date and time in the name
 *
 * \param path File path
 * \param prefix File name prefix.
 * \param suffix File name suffix.
 * \param[out] name_out Buffer for the resulting file name.
 * \param name_len Number of bytes usable in name_out.
 * \return stdio FILE pointer, or NULL on failure.
 *
 * Create and open a new file with the name concatenated from
 * path/prefix, date and time, and suffix. If a file with this name
 * already exists, an counter number is added to the end of the
 * date and time sub-string. The counter is increased until a free file
 * name is found.
 *
 * Once creating the file succeeds, the name of the file is in name_out.
 * On failure, the contents of name_out are undefined and errno is set.
 */
FILE *
file_create_dated(const char *path, const char *prefix, const char *suffix,
		  char *name_out, size_t name_len)
{
	char timestr[128];
	int ret;
	int fd;
	int cnt = 0;
	int with_path;

	with_path = path && path[0];

	if (current_time_str(timestr, sizeof(timestr), "%F_%H-%M-%S") < 0)
		return NULL;

	ret = snprintf(name_out, name_len, "%s%s%s%s%s",
		       with_path ? path : "", with_path ? "/" : "",
		       prefix, timestr, suffix);
	if (ret < 0 || (size_t)ret >= name_len) {
		errno = ENOBUFS;
		return NULL;
	}

	fd = create_file_excl(name_out);

	while (fd == -1 && errno == EEXIST) {
		cnt++;

		ret = snprintf(name_out, name_len, "%s%s%s%s-%d%s",
			       with_path ? path : "", with_path ? "/" : "",
			       prefix, timestr, cnt, suffix);
		if (ret < 0 || (size_t)ret >= name_len) {
			errno = ENOBUFS;
			return NULL;
		}

		fd = create_file_excl(name_out);
	}

	if (fd == -1)
		return NULL;

	return fdopen(fd, "w");
}

char *
file_name_with_datadir(const char *filename)
{
	const char *base = getenv("WESTON_DATA_DIR");
	char *out;
	int len;

	if (base)
		len = asprintf(&out, "%s/%s", base, filename);
	else
		len = asprintf(&out, "%s/weston/%s", DATADIR, filename);

	if (len == -1)
		return NULL;

	return out;
}
