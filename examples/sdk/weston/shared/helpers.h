/*
 * Copyright © 2015 Samsung Electronics Co., Ltd
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
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

#ifndef WESTON_HELPERS_H
#define WESTON_HELPERS_H

#include <stdint.h>

#ifdef  __cplusplus
extern "C" {
#endif

/**
 * @file
 * Simple misc helper macros.
 */

/**
 * Compile-time computation of number of items in a hardcoded array.
 *
 * @param a the array being measured.
 * @return the number of items hardcoded into the array.
 */
#ifndef ARRAY_LENGTH
#define ARRAY_LENGTH(a) (sizeof (a) / sizeof (a)[0])
#endif

/**
 * Compile-time copy of hardcoded arrays.
 *
 * @param dst the array to copy to.
 * @param src the source array.
 */
#ifndef ARRAY_COPY
#define ARRAY_COPY(dst, src) \
do { \
	static_assert(ARRAY_LENGTH(src) == ARRAY_LENGTH(dst), \
		      "src and dst sizes must match"); \
	static_assert(sizeof(src) == sizeof(dst), \
		      "src and dst sizes must match"); \
	memcpy((dst), (src), sizeof(src)); \
} while (0)
#endif

/**
 * Returns the smaller of two values.
 *
 * @param x the first item to compare.
 * @param y the second item to compare.
 * @return the value that evaluates to lesser than the other.
 */
#ifndef MIN
#define MIN(x,y) (((x) < (y)) ? (x) : (y))
#endif

/**
 * Returns the bigger of two values.
 *
 * @param x the first item to compare.
 * @param y the second item to compare.
 * @return the value that evaluates to more than the other.
 */
#ifndef MAX
#define MAX(x,y) (((x) > (y)) ? (x) : (y))
#endif

/**
 * Returns a pointer to the containing struct of a given member item.
 *
 * To demonstrate, the following example retrieves a pointer to
 * `example_container` given only its `destroy_listener` member:
 *
 * @code
 * struct example_container {
 *     struct wl_listener destroy_listener;
 *     // other members...
 * };
 *
 * void example_container_destroy(struct wl_listener *listener, void *data)
 * {
 *     struct example_container *ctr;
 *
 *     ctr = wl_container_of(listener, ctr, destroy_listener);
 *     // destroy ctr...
 * }
 * @endcode
 *
 * @param ptr A valid pointer to the contained item.
 *
 * @param type A pointer to the type of content that the list item
 * stores. Type does not need be a valid pointer; a null or
 * an uninitialised pointer will suffice.
 *
 * @param member The named location of ptr within the sample type.
 *
 * @return The container for the specified pointer.
 */
#ifndef container_of
#define container_of(ptr, type, member) ({				\
	const __typeof__( ((type *)0)->member ) *__mptr = (ptr);	\
	(type *)( (char *)__mptr - offsetof(type,member) );})
#endif

/**
 * Build-time static assertion support
 *
 * A build-time equivalent to assert(), will generate a compilation error
 * if the supplied condition does not evaluate true.
 *
 * The following example demonstrates use of static_assert to ensure that
 * arrays which are supposed to mirror each other have a consistent
 * size.
 *
 * This is only a fallback definition; support must be provided by the
 * compiler itself.
 *
 * @code
 * int small[4];
 * long expanded[4];
 *
 * static_assert(ARRAY_LENGTH(small) == ARRAY_LENGTH(expanded),
 *               "size mismatch between small and expanded arrays");
 * for (i = 0; i < ARRAY_LENGTH(small); i++)
 *     expanded[i] = small[4];
 * @endcode
 *
 * @param cond Expression to check for truth
 * @param msg Message to print on failure
 */
#ifndef static_assert
# ifdef _Static_assert
#  define static_assert(cond, msg) _Static_assert(cond, msg)
# else
#  define static_assert(cond, msg)
# endif
#endif

/** Ensure argument is of given type */
#ifndef TYPEVERIFY
#define TYPEVERIFY(type, arg) ({		\
	typeof(arg) tmp___ = (arg);		\
	(void)((type)0 == tmp___);		\
	tmp___; })
#endif

/** Private symbol export for tests
 *
 * Symbols tagged with this are private libweston functions that are exported
 * only for the test suite to allow unit testing. Nothing else internal or
 * external to libweston is allowed to use these exports.
 *
 * Therefore, the ABI exported with this tag is completely unversioned, and
 * is allowed to break at any time without any indication or version bump.
 * This may happen in all git branches, including stable release branches.
 */
#define WESTON_EXPORT_FOR_TESTS __attribute__ ((visibility("default")))

static inline uint64_t
u64_from_u32s(uint32_t hi, uint32_t lo)
{
	return ((uint64_t)hi << 32) + lo;
}

#ifdef  __cplusplus
}
#endif

#endif /* WESTON_HELPERS_H */
