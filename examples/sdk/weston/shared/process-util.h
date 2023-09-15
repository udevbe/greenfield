/*
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

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include <wayland-util.h>

#include "os-compatibility.h"
#include "string-helpers.h"

/**
 * A container for file descriptors and their string representations, designed
 * to be used when forking child processes.
 *
 * fds[0] is generally used as the file descriptor held within the parent
 * process to communicate with the child, and fds[1] as the child's counterpart.
 *
 * str1[] is used as a string representation of fds[1].
 */
struct fdstr {
	char str1[12];
	int fds[2];
};

void
fdstr_update_str1(struct fdstr *s);

void
fdstr_set_fd1(struct fdstr *s, int fd);

bool
fdstr_clear_cloexec_fd1(struct fdstr *s);

void
fdstr_close_all(struct fdstr *s);


/**
 * A container for environment variables and/or process arguments, designed to
 * be used when forking child processes, as setenv() and anything which
 * allocates memory cannot be used between fork() and exec().
 */
struct custom_env {
	struct wl_array envp;
	bool env_finalized;
	struct wl_array argp;
	bool arg_finalized;
};

void
custom_env_init_from_environ(struct custom_env *env);

void
custom_env_fini(struct custom_env *env);

void
custom_env_set_env_var(struct custom_env *env, const char *name, const char *value);

void
custom_env_add_arg(struct custom_env *env, const char *arg);

void
custom_env_add_from_exec_string(struct custom_env *env, const char *exec_str);

char *const *
custom_env_get_envp(struct custom_env *env);

char *const *
custom_env_get_argp(struct custom_env *env);
