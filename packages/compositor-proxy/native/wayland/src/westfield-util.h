#ifndef WESTFIELD_WESTFIELD_UTIL_H
#define WESTFIELD_WESTFIELD_UTIL_H

#include <stdbool.h>
#include <stdarg.h>
#include <string.h>
#include <errno.h>

#define wfl_log(std, fmt, ...) \
    fprintf(std, fmt "\n", ##__VA_ARGS__)

#define wfl_log_errno(std, fmt, ...) \
	wfl_log(std, fmt ": %s", ##__VA_ARGS__, strerror(errno))


#endif //WESTFIELD_WESTFIELD_UTIL_H
