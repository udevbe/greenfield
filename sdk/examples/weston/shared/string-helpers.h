/*
 * Copyright © 2016 Samsung Electronics Co., Ltd
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

#ifndef WESTON_STRING_HELPERS_H
#define WESTON_STRING_HELPERS_H

#include <stdbool.h>
#include <stdlib.h>
#include <stdint.h>
#include <errno.h>
#include <assert.h>
#include <stdarg.h>
#include <stdio.h>

/* Convert string to integer
 *
 * Parses a base-10 number from the given string.  Checks that the
 * string is not blank, contains only numerical characters, and is
 * within the range of INT32_MIN to INT32_MAX.  If the validation is
 * successful the result is stored in *value; otherwise *value is
 * unchanged and errno is set appropriately.
 *
 * \return true if the number parsed successfully, false on error
 */
static inline bool
safe_strtoint(const char *str, int32_t *value)
{
	long ret;
	char *end;

	assert(str != NULL);

	errno = 0;
	ret = strtol(str, &end, 10);
	if (errno != 0) {
		return false;
	} else if (end == str || *end != '\0') {
		errno = EINVAL;
		return false;
	}

	if ((long)((int32_t)ret) != ret) {
		errno = ERANGE;
		return false;
	}
	*value = (int32_t)ret;

	return true;
}

/**
 * Exactly like asprintf(), but sets *str_out to NULL if it fails.
 *
 * If str_out is NULL, does nothing.
 */
static inline void __attribute__ ((format (printf, 2, 3)))
str_printf(char **str_out, const char *fmt, ...)
{
	char *msg;
	va_list ap;
	int ret;

	if (!str_out)
		return;

	va_start(ap, fmt);
	ret = vasprintf(&msg, fmt, ap);
	va_end(ap);

	if (ret >= 0)
		*str_out = msg;
	else
		*str_out = NULL;
}

static inline const char *
yesno(bool cond)
{
	return cond ? "yes" : "no";
}

#endif /* WESTON_STRING_HELPERS_H */
