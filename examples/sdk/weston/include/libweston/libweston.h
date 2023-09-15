/*
 * Copyright © 2008-2011 Kristian Høgsberg
 * Copyright © 2012, 2017, 2018, 2021 Collabora, Ltd.
 * Copyright © 2017, 2018 General Electric Company
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

#ifndef _WAYLAND_SYSTEM_COMPOSITOR_H_
#define _WAYLAND_SYSTEM_COMPOSITOR_H_

#ifdef  __cplusplus
extern "C" {
#endif

#include <stdbool.h>
#include <stdint.h>
#include <time.h>
#include <pixman.h>
#include <xkbcommon/xkbcommon.h>

#define WL_HIDE_DEPRECATED
#include <wayland-server.h>

#include <libweston/matrix.h>
#include <libweston/zalloc.h>

struct weston_log_pacer {
	/** This must be set to zero before first use */
	bool initialized;
	struct timespec burst_start;
	unsigned int event_count;
	unsigned int max_burst;
	unsigned int reset_ms;
};

struct weston_geometry {
	int32_t x, y;
	int32_t width, height;
};

struct weston_position {
	int32_t x, y;
};

struct weston_size {
	int32_t width, height;
};

struct weston_transform {
	struct weston_matrix matrix;
	struct wl_list link;
};

/** 2D device coordinates normalized to [0, 1] range */
struct weston_point2d_device_normalized {
	double x;
	double y;
};

struct weston_surface;
struct weston_buffer;
struct shell_surface;
struct weston_seat;
struct weston_output;
struct input_method;
struct weston_pointer;
struct linux_dmabuf_buffer;
struct weston_recorder;
struct weston_pointer_constraint;
struct ro_anonymous_file;
struct weston_color_profile;
struct weston_color_transform;
struct pixel_format_info;
struct weston_output_capture_info;

enum weston_keyboard_modifier {
	MODIFIER_CTRL = (1 << 0),
	MODIFIER_ALT = (1 << 1),
	MODIFIER_SUPER = (1 << 2),
	MODIFIER_SHIFT = (1 << 3),
};

enum weston_keyboard_locks {
	WESTON_NUM_LOCK = (1 << 0),
	WESTON_CAPS_LOCK = (1 << 1),
};

enum weston_led {
	LED_NUM_LOCK = (1 << 0),
	LED_CAPS_LOCK = (1 << 1),
	LED_SCROLL_LOCK = (1 << 2),
};

enum weston_mode_aspect_ratio {
	/** The picture aspect ratio values, for the aspect_ratio field of
	 *  weston_mode. The values here, are taken from
	 *  DRM_MODE_PICTURE_ASPECT_* from drm_mode.h.
	 */
	WESTON_MODE_PIC_AR_NONE = 0,	/* DRM_MODE_PICTURE_ASPECT_NONE */
	WESTON_MODE_PIC_AR_4_3 = 1,	/* DRM_MODE_PICTURE_ASPECT_4_3 */
	WESTON_MODE_PIC_AR_16_9 = 2,	/* DRM_MODE_PICTURE_ASPECT_16_9 */
	WESTON_MODE_PIC_AR_64_27 = 3,	/* DRM_MODE_PICTURE_ASPECT_64_27 */
	WESTON_MODE_PIC_AR_256_135 = 4,	/* DRM_MODE_PICTURE_ASPECT_256_135*/
};

enum weston_surface_protection_mode {
	WESTON_SURFACE_PROTECTION_MODE_RELAXED,
	WESTON_SURFACE_PROTECTION_MODE_ENFORCED
};

struct weston_mode {
	uint32_t flags;
	enum weston_mode_aspect_ratio aspect_ratio;
	int32_t width, height;
	uint32_t refresh;
	struct wl_list link;
};

struct weston_animation {
	void (*frame)(struct weston_animation *animation,
		      struct weston_output *output,
		      const struct timespec *time);
	int frame_counter;
	struct wl_list link;
};

enum {
	WESTON_SPRING_OVERSHOOT,
	WESTON_SPRING_CLAMP,
	WESTON_SPRING_BOUNCE
};

struct weston_spring {
	double k;
	double friction;
	double current;
	double target;
	double previous;
	double min, max;
	struct timespec timestamp;
	uint32_t clip;
};

/* bit compatible with drm definitions. */
enum dpms_enum {
	WESTON_DPMS_ON,
	WESTON_DPMS_STANDBY,
	WESTON_DPMS_SUSPEND,
	WESTON_DPMS_OFF
};

/* enum for content protection requests/status
 *
 * This enum represents the content protection requests and statuses in
 * libweston and its enum values correspond to those of 'type' enum defined in
 * weston-content-protection protocol. The values should exactly match to the
 * values of the 'type' enum of the protocol.
 */

enum weston_hdcp_protection {
	WESTON_HDCP_DISABLE = 0,
	WESTON_HDCP_ENABLE_TYPE_0,
	WESTON_HDCP_ENABLE_TYPE_1
};

/** Weston test suite quirks
 *
 * There are some things that need a specific behavior when we run Weston in the
 * test suite. Tests can use this struct to select for certain behaviors.
 *
 * \sa compositor_setup
 * \ingroup testharness
 */
struct weston_testsuite_quirks {
	/** Force GL-renderer to do a full upload of wl_shm buffers. */
	bool gl_force_full_upload;
	/** Ensure GL shadow fb is used, and always repaint it fully. */
	bool gl_force_full_redraw_of_shadow_fb;
	/** Required enum weston_capability bit mask, otherwise skip run. */
	uint32_t required_capabilities;
};

/** Weston test suite data that is given to compositor
 *
 * It contains two members:
 *
 * 1. The struct weston_testsuite_quirks, which can be used by the tests to
 *    change certain behavior of Weston when running these tests.
 * 2. The void *test_private_data member which can be used by the testsuite of
 *    projects that uses libweston in order to give arbitrary test data to the
 *    compositor. Its type should be defined by the testsuite of the project.
 *
 * \sa compositor_setup
 * \ingroup testharness
 */
struct weston_testsuite_data {
	struct weston_testsuite_quirks test_quirks;
	void *test_private_data;
};

/** EOTF mode for outputs and heads
 *
 * A list of EOTF modes for driving displays, defined by CTA-861-G for
 * Dynamic Range and Mastering InfoFrame.
 *
 * On heads, a bitmask of one or more entries shows which modes are claimed
 * supported.
 *
 * On outputs, the mode to be used for driving the video sink.
 *
 * For traditional non-HDR sRGB, use WESTON_EOTF_MODE_SDR.
 */
enum weston_eotf_mode {
	/** Invalid EOTF mode, or none supported. */
	WESTON_EOTF_MODE_NONE			= 0,

	/** Traditional gamma, SDR luminance range */
	WESTON_EOTF_MODE_SDR			= 0x01,

	/** Traditional gamma, HDR luminance range */
	WESTON_EOTF_MODE_TRADITIONAL_HDR	= 0x02,

	/** Preceptual quantizer, SMPTE ST 2084 */
	WESTON_EOTF_MODE_ST2084			= 0x04,

	/** Hybrid log-gamma, ITU-R BT.2100 */
	WESTON_EOTF_MODE_HLG			= 0x08,
};

/** Bitmask of all defined EOTF modes */
#define WESTON_EOTF_MODE_ALL_MASK \
	((uint32_t)(WESTON_EOTF_MODE_SDR | WESTON_EOTF_MODE_TRADITIONAL_HDR | \
		    WESTON_EOTF_MODE_ST2084 | WESTON_EOTF_MODE_HLG))

/** CIE 1931 xy chromaticity coordinates */
struct weston_CIExy {
	float x;
	float y;
};

enum weston_hdr_metadata_type1_groups {
	/** weston_hdr_metadata_type1::primary is set */
	WESTON_HDR_METADATA_TYPE1_GROUP_PRIMARIES	= 0x01,

	/** weston_hdr_metadata_type1::white is set */
	WESTON_HDR_METADATA_TYPE1_GROUP_WHITE		= 0x02,

	/** weston_hdr_metadata_type1::maxDML is set */
	WESTON_HDR_METADATA_TYPE1_GROUP_MAXDML		= 0x04,

	/** weston_hdr_metadata_type1::minDML is set */
	WESTON_HDR_METADATA_TYPE1_GROUP_MINDML		= 0x08,

	/** weston_hdr_metadata_type1::maxCLL is set */
	WESTON_HDR_METADATA_TYPE1_GROUP_MAXCLL		= 0x10,

	/** weston_hdr_metadata_type1::maxFALL is set */
	WESTON_HDR_METADATA_TYPE1_GROUP_MAXFALL		= 0x20,

	/** all valid bits */
	WESTON_HDR_METADATA_TYPE1_GROUP_ALL_MASK	= 0x3f
};

/** HDR static metadata type 1
 *
 * The fields are defined by CTA-861-G except here they use float encoding.
 *
 * In Weston used only with HDR display modes.
 */
struct weston_hdr_metadata_type1 {
	/** Which fields are valid
	 *
	 * A bitmask of values from enum weston_hdr_metadata_type1_groups.
	 */
	uint32_t group_mask;

	/* EOTF is tracked externally with enum weston_eotf_mode */

	/** Chromaticities of the primaries, in any order */
	struct weston_CIExy primary[3];

	/** White point chromaticity */
	struct weston_CIExy white;

	/** Maximum display mastering luminance, 1 - 65535 cd/m² */
	float maxDML;

	/** Minimum display mastering luminance, 0.0001 - 6.5535 cd/m² */
	float minDML;

	/** Maximum content light level, 1 - 65535 cd/m² */
	float maxCLL;

	/** Maximum frame-average light level, 1 - 65535 cd/m² */
	float maxFALL;
};

enum weston_color_characteristics_groups {
	/** weston_color_characteristics::primary is set */
	WESTON_COLOR_CHARACTERISTICS_GROUP_PRIMARIES	= 0x01,

	/** weston_color_characteristics::white is set */
	WESTON_COLOR_CHARACTERISTICS_GROUP_WHITE	= 0x02,

	/** weston_color_characteristics::max_luminance is set */
	WESTON_COLOR_CHARACTERISTICS_GROUP_MAXL		= 0x04,

	/** weston_color_characteristics::min_luminance is set */
	WESTON_COLOR_CHARACTERISTICS_GROUP_MINL		= 0x08,

	/** weston_color_characteristics::maxFALL is set */
	WESTON_COLOR_CHARACTERISTICS_GROUP_MAXFALL	= 0x10,

	/** all valid bits */
	WESTON_COLOR_CHARACTERISTICS_GROUP_ALL_MASK	= 0x1f
};

/** Basic display color characteristics
 *
 * This is a simple description of a display or output (monitor) color
 * characteristics. The parameters can be found in EDID, with caveats. They
 * are particularly useful with HDR monitors.
 */
struct weston_color_characteristics {
	/** Which fields are valid
	 *
	 * A bitmask of values from enum weston_color_characteristics_groups.
	 */
	uint32_t group_mask;

	/* EOTF is tracked externally with enum weston_eotf_mode */

	/** Chromaticities of the primaries */
	struct weston_CIExy primary[3];

	/** White point chromaticity */
	struct weston_CIExy white;

	/** Display's desired maximum content peak luminance, cd/m² */
	float max_luminance;

	/** Display's desired minimum content luminance, cd/m² */
	float min_luminance;

	/** Display's desired maximum frame-average light level, cd/m² */
	float maxFALL;
};

/** Represents a head, usually a display connector
 *
 * \rst
 See :ref:`libweston-head`. \endrst
 *
 * \ingroup head
 */
struct weston_head {
	struct weston_compositor *compositor;	/**< owning compositor */
	struct weston_backend *backend;	/**< owning backend */
	struct wl_list compositor_link;	/**< in weston_compositor::head_list */
	struct wl_signal destroy_signal;	/**< destroy callbacks */

	struct weston_output *output;	/**< the output driving this head */
	struct wl_list output_link;	/**< in weston_output::head_list */

	struct wl_list resource_list;	/**< wl_output protocol objects */
	struct wl_global *global;	/**< wl_output global */

	struct wl_list xdg_output_resource_list; /**< xdg_output protocol objects */

	int32_t mm_width;		/**< physical image width in mm */
	int32_t mm_height;		/**< physical image height in mm */

	/** WL_OUTPUT_TRANSFORM enum to apply to match native orientation */
	uint32_t transform;

	char *make;			/**< monitor manufacturer (PNP ID) */
	char *model;			/**< monitor model */
	char *serial_number;		/**< monitor serial */
	uint32_t subpixel;		/**< enum wl_output_subpixel */
	bool connection_internal;	/**< embedded monitor (e.g. laptop) */
	bool device_changed;		/**< monitor information has changed */

	char *name;			/**< head name, e.g. connector name */
	bool connected;			/**< is physically connected */
	bool non_desktop;		/**< non-desktop display, e.g. HMD */
	uint32_t supported_eotf_mask;	/**< supported weston_eotf_mode bits */

	/** Current content protection status */
	enum weston_hdcp_protection current_protection;
};

/** Output properties derived from its color characteristics and profile
 *
 * These are constructed by a color manager.
 *
 * A weston_output_color_outcome owns (a reference to) everything it contains.
 *
 * \ingroup output
 * \internal
 */
struct weston_output_color_outcome {
	/** sRGB to output color space transformation */
	struct weston_color_transform *from_sRGB_to_output;

	/** sRGB to blending color space transformation */
	struct weston_color_transform *from_sRGB_to_blend;

	/** Blending to output color space transformation */
	struct weston_color_transform *from_blend_to_output;

	/** HDR Static Metadata Type 1 for WESTON_EOTF_MODE_ST2084 */
	struct weston_hdr_metadata_type1 hdr_meta;
};

/** Content producer for heads
 *
 * \rst
 See :ref:`libweston-output`. \endrst
 *
 * \ingroup output
 */
struct weston_output {
	uint32_t id;
	char *name;

	/** Matches the lifetime from the user perspective */
	struct wl_signal user_destroy_signal;

	void *renderer_state;

	struct wl_list link;
	struct weston_compositor *compositor;

	/* struct weston_paint_node::output_link */
	struct wl_list paint_node_list;

	/** From global to output buffer coordinates. */
	struct weston_matrix matrix;
	/** From output buffer to global coordinates. */
	struct weston_matrix inverse_matrix;

	struct wl_list animation_list;
	int32_t x, y, width, height;

	/** List of paint nodes in z-order, from top to bottom, maybe pruned
	 *
	 *  struct weston_paint_node::z_order_link
	 */
	struct wl_list paint_node_z_order_list;

	/** Output area in global coordinates, simple rect */
	pixman_region32_t region;

	/** True if damage has occurred since the last repaint for this output;
	 *  if set, a repaint will eventually occur. */
	bool repaint_needed;

	/** Used only between repaint_begin and repaint_cancel. */
	bool repainted;

	/** State of the repaint loop */
	enum {
		REPAINT_NOT_SCHEDULED = 0, /**< idle; no repaint will occur */
		REPAINT_BEGIN_FROM_IDLE, /**< start_repaint_loop scheduled */
		REPAINT_SCHEDULED, /**< repaint is scheduled to occur */
		REPAINT_AWAITING_COMPLETION, /**< last repaint not yet finished */
	} repaint_status;

	/** If repaint_status is REPAINT_SCHEDULED, contains the time the
	 *  next repaint should be run */
	struct timespec next_repaint;

	/** For cancelling the idle_repaint callback on output destruction. */
	struct wl_event_source *idle_repaint_source;

	struct wl_signal frame_signal;
	struct wl_signal destroy_signal;	/**< sent when disabled */
	int move_x, move_y;
	struct timespec frame_time; /* presentation timestamp */
	uint64_t msc;        /* media stream counter */
	int disable_planes;
	int destroying;
	struct wl_list feedback_list;
	struct weston_output_capture_info *capture_info;

	uint32_t transform;
	int32_t native_scale;
	int32_t current_scale;
	int32_t original_scale;

	struct weston_mode *native_mode;
	struct weston_mode *current_mode;
	struct weston_mode *original_mode;
	struct wl_list mode_list;

	struct wl_list head_list; /**< List of driven weston_heads */

	enum weston_hdcp_protection desired_protection;
	enum weston_hdcp_protection current_protection;
	bool allow_protection;

	struct weston_log_pacer repaint_delay_pacer;
	struct weston_log_pacer pixman_overdraw_pacer;

	int (*start_repaint_loop)(struct weston_output *output);
	int (*repaint)(struct weston_output *output, pixman_region32_t *damage);
	void (*destroy)(struct weston_output *output);
	void (*assign_planes)(struct weston_output *output);
	int (*switch_mode)(struct weston_output *output, struct weston_mode *mode);

	/* backlight values are on 0-255 range, where higher is brighter */
	int32_t backlight_current;
	void (*set_backlight)(struct weston_output *output, uint32_t value);
	void (*set_dpms)(struct weston_output *output, enum dpms_enum level);

	uint16_t gamma_size;
	void (*set_gamma)(struct weston_output *output,
			  uint16_t size,
			  uint16_t *r,
			  uint16_t *g,
			  uint16_t *b);

	bool enabled; /**< is in the output_list, not pending list */
	int scale;

	struct weston_color_profile *color_profile;
	bool from_blend_to_output_by_backend;
	enum weston_eotf_mode eotf_mode;
	struct weston_color_characteristics color_characteristics;

	struct weston_output_color_outcome *color_outcome;
	uint64_t color_outcome_serial;

	int (*enable)(struct weston_output *output);
	int (*disable)(struct weston_output *output);

	/** Attach a head in the backend
	 *
	 * @param output The output to attach to.
	 * @param head The head to attach.
	 * @return 0 on success, -1 on failure.
	 *
	 * Do anything necessary to account for a new head being attached to
	 * the output, and check any conditions possible. On failure, both
	 * the head and the output must be left as before the call.
	 *
	 * Libweston core will add the head to the head_list after a successful
	 * call.
	 */
	int (*attach_head)(struct weston_output *output,
			   struct weston_head *head);

	/** Detach a head in the backend
	 *
	 * @param output The output to detach from.
	 * @param head The head to detach.
	 *
	 * Do any clean-up necessary to detach this head from the output.
	 * The head has already been removed from the output's head_list.
	 */
	void (*detach_head)(struct weston_output *output,
			    struct weston_head *head);
};

enum weston_pointer_motion_mask {
	WESTON_POINTER_MOTION_ABS = 1 << 0,
	WESTON_POINTER_MOTION_REL = 1 << 1,
	WESTON_POINTER_MOTION_REL_UNACCEL = 1 << 2,
};

struct weston_pointer_motion_event {
	uint32_t mask;
	struct timespec time;
	double x;
	double y;
	double dx;
	double dy;
	double dx_unaccel;
	double dy_unaccel;
};

struct weston_pointer_axis_event {
	uint32_t axis;
	double value;
	bool has_discrete;
	int32_t discrete;
};

struct weston_pointer_grab;
struct weston_pointer_grab_interface {
	void (*focus)(struct weston_pointer_grab *grab);
	void (*motion)(struct weston_pointer_grab *grab,
		       const struct timespec *time,
		       struct weston_pointer_motion_event *event);
	void (*button)(struct weston_pointer_grab *grab,
		       const struct timespec *time,
		       uint32_t button, uint32_t state);
	void (*axis)(struct weston_pointer_grab *grab,
		     const struct timespec *time,
		     struct weston_pointer_axis_event *event);
	void (*axis_source)(struct weston_pointer_grab *grab, uint32_t source);
	void (*frame)(struct weston_pointer_grab *grab);
	void (*cancel)(struct weston_pointer_grab *grab);
};

struct weston_pointer_grab {
	const struct weston_pointer_grab_interface *interface;
	struct weston_pointer *pointer;
};

struct weston_keyboard_grab;
struct weston_keyboard_grab_interface {
	void (*key)(struct weston_keyboard_grab *grab,
		    const struct timespec *time, uint32_t key, uint32_t state);
	void (*modifiers)(struct weston_keyboard_grab *grab, uint32_t serial,
			  uint32_t mods_depressed, uint32_t mods_latched,
			  uint32_t mods_locked, uint32_t group);
	void (*cancel)(struct weston_keyboard_grab *grab);
};

struct weston_keyboard_grab {
	const struct weston_keyboard_grab_interface *interface;
	struct weston_keyboard *keyboard;
};

struct weston_touch_grab;
struct weston_touch_grab_interface {
	void (*down)(struct weston_touch_grab *grab,
			const struct timespec *time,
			int touch_id,
			wl_fixed_t sx,
			wl_fixed_t sy);
	void (*up)(struct weston_touch_grab *grab,
			const struct timespec *time,
			int touch_id);
	void (*motion)(struct weston_touch_grab *grab,
			const struct timespec *time,
			int touch_id,
			wl_fixed_t sx,
			wl_fixed_t sy);
	void (*frame)(struct weston_touch_grab *grab);
	void (*cancel)(struct weston_touch_grab *grab);
};

struct weston_touch_grab {
	const struct weston_touch_grab_interface *interface;
	struct weston_touch *touch;
};

struct weston_data_offer {
	struct wl_resource *resource;
	struct weston_data_source *source;
	struct wl_listener source_destroy_listener;
	uint32_t dnd_actions;
	enum wl_data_device_manager_dnd_action preferred_dnd_action;
	bool in_ask;
};

struct weston_data_source {
	struct wl_resource *resource;
	struct wl_signal destroy_signal;
	struct wl_array mime_types;
	struct weston_data_offer *offer;
	struct weston_seat *seat;
	bool accepted;
	bool actions_set;
	bool set_selection;
	uint32_t dnd_actions;
	enum wl_data_device_manager_dnd_action current_dnd_action;
	enum wl_data_device_manager_dnd_action compositor_action;

	void (*accept)(struct weston_data_source *source,
		       uint32_t serial, const char *mime_type);
	void (*send)(struct weston_data_source *source,
		     const char *mime_type, int32_t fd);
	void (*cancel)(struct weston_data_source *source);
};

struct weston_pointer_client {
	struct wl_list link;
	struct wl_client *client;
	struct wl_list pointer_resources;
	struct wl_list relative_pointer_resources;
};

struct weston_pointer {
	struct weston_seat *seat;

	struct wl_list pointer_clients;

	struct weston_view *focus;
	struct weston_pointer_client *focus_client;
	uint32_t focus_serial;
	struct wl_listener focus_view_listener;
	struct wl_listener focus_resource_listener;
	struct wl_signal focus_signal;
	struct wl_signal motion_signal;
	struct wl_signal destroy_signal;

	struct weston_view *sprite;
	struct wl_listener sprite_destroy_listener;
	int32_t hotspot_x, hotspot_y;

	struct weston_pointer_grab *grab;
	struct weston_pointer_grab default_grab;
	wl_fixed_t grab_x, grab_y;
	uint32_t grab_button;
	uint32_t grab_serial;
	struct timespec grab_time;

	wl_fixed_t x, y;
	wl_fixed_t sx, sy;
	uint32_t button_count;

	struct wl_listener output_destroy_listener;

	struct wl_list timestamps_list;
};

/** libinput style calibration matrix
 *
 * See https://wayland.freedesktop.org/libinput/doc/latest/absolute_axes.html
 * and libinput_device_config_calibration_set_matrix().
 */
struct weston_touch_device_matrix {
	float m[6];
};

struct weston_touch_device;

/** Operations for a calibratable touchscreen */
struct weston_touch_device_ops {
	/** Get the associated output if existing. */
	struct weston_output *(*get_output)(struct weston_touch_device *device);

	/** Get the name of the associated head if existing. */
	const char *
	(*get_calibration_head_name)(struct weston_touch_device *device);

	/** Retrieve the current calibration matrix. */
	void (*get_calibration)(struct weston_touch_device *device,
				struct weston_touch_device_matrix *cal);

	/** Set a new calibration matrix. */
	void (*set_calibration)(struct weston_touch_device *device,
				const struct weston_touch_device_matrix *cal);
};

enum weston_touch_mode {
	/** Normal touch event handling */
	WESTON_TOUCH_MODE_NORMAL,

	/** Prepare moving to WESTON_TOUCH_MODE_CALIB.
	 *
	 * Move to WESTON_TOUCH_MODE_CALIB as soon as no touches are down on
	 * any seat. Until then, all touch events are routed normally.
	 */
	WESTON_TOUCH_MODE_PREP_CALIB,

	/** Calibration mode
	 *
	 * Only a single weston_touch_device forwards events to the calibrator
	 * all other touch device cause a calibrator "wrong device" event to
	 * be sent.
	 */
	WESTON_TOUCH_MODE_CALIB,

	/** Prepare moving to WESTON_TOUCH_MODE_NORMAL.
	 *
	 * Move to WESTON_TOUCH_MODE_NORMAL as soon as no touches are down on
	 * any seat. Until then, touch events are routed as in
	 * WESTON_TOUCH_MODE_CALIB except "wrong device" events are not sent.
	 */
	WESTON_TOUCH_MODE_PREP_NORMAL
};

/** Represents a physical touchscreen input device */
struct weston_touch_device {
	char *syspath;			/**< unique name */

	struct weston_touch *aggregate;	/**< weston_touch this is part of */
	struct wl_list link;		/**< in weston_touch::device_list */
	struct wl_signal destroy_signal;	/**< destroy notifier */

	void *backend_data;		/**< backend-specific private */

	const struct weston_touch_device_ops *ops;
	struct weston_touch_device_matrix saved_calibration;
};

/** Represents a set of touchscreen devices aggregated under a seat */
struct weston_touch {
	struct weston_seat *seat;

	struct wl_list device_list;	/* struct weston_touch_device::link */

	struct wl_list resource_list;
	struct wl_list focus_resource_list;
	struct weston_view *focus;
	struct wl_listener focus_view_listener;
	struct wl_listener focus_resource_listener;
	uint32_t focus_serial;
	struct wl_signal focus_signal;
	bool pending_focus_reset;

	uint32_t num_tp;

	struct weston_touch_grab *grab;
	struct weston_touch_grab default_grab;
	int grab_touch_id;
	wl_fixed_t grab_x, grab_y;
	uint32_t grab_serial;
	struct timespec grab_time;

	struct wl_list timestamps_list;
};

void
weston_pointer_motion_to_abs(struct weston_pointer *pointer,
			     struct weston_pointer_motion_event *event,
			     wl_fixed_t *x, wl_fixed_t *y);

void
weston_pointer_send_motion(struct weston_pointer *pointer,
			   const struct timespec *time,
			   struct weston_pointer_motion_event *event);
bool
weston_pointer_has_focus_resource(struct weston_pointer *pointer);
void
weston_pointer_send_button(struct weston_pointer *pointer,
			   const struct timespec *time,
			   uint32_t button, uint32_t state_w);
void
weston_pointer_send_axis(struct weston_pointer *pointer,
			 const struct timespec *time,
			 struct weston_pointer_axis_event *event);
void
weston_pointer_send_axis_source(struct weston_pointer *pointer,
				uint32_t source);
void
weston_pointer_send_frame(struct weston_pointer *pointer);

void
weston_pointer_set_focus(struct weston_pointer *pointer,
			 struct weston_view *view);

void
weston_pointer_clear_focus(struct weston_pointer *pointer);
void
weston_pointer_start_grab(struct weston_pointer *pointer,
			  struct weston_pointer_grab *grab);
void
weston_pointer_end_grab(struct weston_pointer *pointer);
void
weston_pointer_move(struct weston_pointer *pointer,
		    struct weston_pointer_motion_event *event);
void
weston_keyboard_set_focus(struct weston_keyboard *keyboard,
			  struct weston_surface *surface);
void
weston_keyboard_start_grab(struct weston_keyboard *device,
			   struct weston_keyboard_grab *grab);
void
weston_keyboard_end_grab(struct weston_keyboard *keyboard);
int
/*
 * 'mask' and 'value' should be a bitwise mask of one or more
 * valued of the weston_keyboard_locks enum.
 */
weston_keyboard_set_locks(struct weston_keyboard *keyboard,
			  uint32_t mask, uint32_t value);

void
weston_keyboard_send_key(struct weston_keyboard *keyboard,
			 const struct timespec *time, uint32_t key,
			 enum wl_keyboard_key_state state);
void
weston_keyboard_send_modifiers(struct weston_keyboard *keyboard,
			       uint32_t serial, uint32_t mods_depressed,
			       uint32_t mods_latched,
			       uint32_t mods_locked, uint32_t group);

void
weston_touch_set_focus(struct weston_touch *touch,
		       struct weston_view *view);
void
weston_touch_start_grab(struct weston_touch *touch,
			struct weston_touch_grab *grab);
void
weston_touch_end_grab(struct weston_touch *touch);

void
weston_touch_send_down(struct weston_touch *touch, const struct timespec *time,
		       int touch_id, wl_fixed_t x, wl_fixed_t y);
void
weston_touch_send_up(struct weston_touch *touch, const struct timespec *time,
		     int touch_id);
void
weston_touch_send_motion(struct weston_touch *touch,
			 const struct timespec *time, int touch_id,
			 wl_fixed_t x, wl_fixed_t y);
void
weston_touch_send_frame(struct weston_touch *touch);


void
weston_seat_set_selection(struct weston_seat *seat,
			  struct weston_data_source *source, uint32_t serial);

int
weston_pointer_start_drag(struct weston_pointer *pointer,
		       struct weston_data_source *source,
		       struct weston_surface *icon,
		       struct wl_client *client);
struct weston_xkb_info {
	struct xkb_keymap *keymap;
	struct ro_anonymous_file *keymap_rofile;
	int32_t ref_count;
	xkb_mod_index_t shift_mod;
	xkb_mod_index_t caps_mod;
	xkb_mod_index_t ctrl_mod;
	xkb_mod_index_t alt_mod;
	xkb_mod_index_t mod2_mod;
	xkb_mod_index_t mod3_mod;
	xkb_mod_index_t super_mod;
	xkb_mod_index_t mod5_mod;
	xkb_led_index_t num_led;
	xkb_led_index_t caps_led;
	xkb_led_index_t scroll_led;
};

struct weston_keyboard {
	struct weston_seat *seat;

	struct wl_list resource_list;
	struct wl_list focus_resource_list;
	struct weston_surface *focus;
	struct wl_listener focus_resource_listener;
	uint32_t focus_serial;
	struct wl_signal focus_signal;

	struct weston_keyboard_grab *grab;
	struct weston_keyboard_grab default_grab;
	uint32_t grab_key;
	uint32_t grab_serial;
	struct timespec grab_time;

	struct wl_array keys;

	struct {
		uint32_t mods_depressed;
		uint32_t mods_latched;
		uint32_t mods_locked;
		uint32_t group;
	} modifiers;

	struct weston_keyboard_grab input_method_grab;
	struct wl_resource *input_method_resource;

	struct weston_xkb_info *xkb_info;
	struct {
		struct xkb_state *state;
		enum weston_led leds;
	} xkb_state;
	struct xkb_keymap *pending_keymap;

	struct wl_list timestamps_list;
};

struct weston_seat {
	struct wl_list base_resource_list;

	struct wl_global *global;
	struct weston_pointer *pointer_state;
	struct weston_keyboard *keyboard_state;
	struct weston_touch *touch_state;
	int pointer_device_count;
	int keyboard_device_count;
	int touch_device_count;

	struct weston_output *output; /* constraint */

	struct wl_signal destroy_signal;
	struct wl_signal updated_caps_signal;

	struct weston_compositor *compositor;
	struct wl_list link;
	enum weston_keyboard_modifier modifier_state;
	struct weston_surface *saved_kbd_focus;
	struct wl_listener saved_kbd_focus_listener;
	bool use_saved_kbd_focus;
	struct wl_list drag_resource_list;

	uint32_t selection_serial;
	struct weston_data_source *selection_data_source;
	struct wl_listener selection_data_source_listener;
	struct wl_signal selection_signal;

	void (*led_update)(struct weston_seat *ws, enum weston_led leds);

	struct input_method *input_method;
	char *seat_name;
};

enum {
	WESTON_COMPOSITOR_ACTIVE,    /* normal rendering and events */
	WESTON_COMPOSITOR_IDLE,      /* shell->unlock called on activity */
	WESTON_COMPOSITOR_OFFSCREEN, /* no rendering, no frame events */
	WESTON_COMPOSITOR_SLEEPING   /* same as offscreen, but also set dpms
	                              * to off */
};

struct weston_layer_entry {
	struct wl_list link;
	struct weston_layer *layer;
};

/**
 * Higher value means higher in the stack.
 *
 * These values are based on well-known concepts in a classic desktop
 * environment. Third-party modules based on libweston are encouraged to use
 * them to integrate better with other projects.
 *
 * A fully integrated environment can use any value, based on these or not,
 * at their discretion.
 */
enum weston_layer_position {
	/*
	 * Special value to make the layer invisible and still rendered.
	 * This is used by compositors wanting e.g. minimized surfaces to still
	 * receive frame callbacks.
	 */
	WESTON_LAYER_POSITION_HIDDEN     = 0x00000000,

	/*
	 * There should always be a background layer with a surface covering
	 * the visible area.
	 *
	 * If the compositor handles the background itself, it should use
	 * BACKGROUND.
	 *
	 * If the compositor supports runtime-loadable modules to set the
	 * background, it should put a solid color surface at (BACKGROUND - 1)
	 * and modules must use BACKGROUND.
	 */
	WESTON_LAYER_POSITION_BACKGROUND = 0x00000002,

	/* For "desktop widgets" and applications like conky. */
	WESTON_LAYER_POSITION_BOTTOM_UI  = 0x30000000,

	/* For regular applications, only one layer should have this value
	 * to ensure proper stacking control. */
	WESTON_LAYER_POSITION_NORMAL     = 0x50000000,

	/* For desktop UI, like panels. */
	WESTON_LAYER_POSITION_UI         = 0x80000000,

	/* For fullscreen applications that should cover UI. */
	WESTON_LAYER_POSITION_FULLSCREEN = 0xb0000000,

	/* For special UI like on-screen keyboard that fullscreen applications
	 * will need. */
	WESTON_LAYER_POSITION_TOP_UI     = 0xe0000000,

	/* For the lock surface. */
	WESTON_LAYER_POSITION_LOCK       = 0xffff0000,

	/* Values reserved for libweston internal usage */
	WESTON_LAYER_POSITION_CURSOR     = 0xfffffffe,
	WESTON_LAYER_POSITION_FADE       = 0xffffffff,
};

struct weston_layer {
	struct weston_compositor *compositor;
	struct wl_list link; /* weston_compositor::layer_list */
	enum weston_layer_position position;
	pixman_box32_t mask;
	struct weston_layer_entry view_list;
};

struct weston_plane {
	struct weston_compositor *compositor;
	pixman_region32_t damage; /**< in global coords */
	pixman_region32_t clip;
	int32_t x, y;
	struct wl_list link;
};

struct weston_drm_format_array;

enum weston_capability {
	/* backend/renderer supports arbitrary rotation */
	WESTON_CAP_ROTATION_ANY			= 0x0001,

	/* screencaptures need to be y-flipped */
	WESTON_CAP_CAPTURE_YFLIP		= 0x0002,

	/* backend/renderer has a separate cursor plane */
	WESTON_CAP_CURSOR_PLANE			= 0x0004,

	/* backend supports setting arbitrary resolutions */
	WESTON_CAP_ARBITRARY_MODES		= 0x0008,

	/* renderer supports weston_view_set_mask() clipping */
	WESTON_CAP_VIEW_CLIP_MASK		= 0x0010,

	/* renderer supports explicit synchronization */
	WESTON_CAP_EXPLICIT_SYNC		= 0x0020,

	/* renderer supports color management operations */
	WESTON_CAP_COLOR_OPS			= 0x0040,
};

/* Configuration struct for a backend.
 *
 * This struct carries the configuration for a backend, and it's
 * passed to the backend's init entry point. The backend will
 * likely want to subclass this in order to handle backend specific
 * data.
 *
 * \rststar
 * .. note:
 *
 *    Alternate designs were proposed (Feb 2016) for using opaque structures[1]
 *    and for section+key/value getter/setters[2].  The rationale for selecting
 *    the transparent structure design is based on several assumptions[3] which
 *    may require re-evaluating the design choice if they fail to hold.
 *
 *    1. https://lists.freedesktop.org/archives/wayland-devel/2016-February/026989.html
 *    2. https://lists.freedesktop.org/archives/wayland-devel/2016-February/026929.html
 *    3. https://lists.freedesktop.org/archives/wayland-devel/2016-February/027228.html
 *
 * \endrststar
 */
struct weston_backend_config {
	/** Major version for the backend-specific config struct
	 *
	 * This version must match exactly what the backend expects, otherwise
	 * the struct is incompatible.
	 */
	uint32_t struct_version;

	/** Minor version of the backend-specific config struct
	 *
	 * This must be set to sizeof(struct backend-specific config).
	 * If the value here is smaller than what the backend expects, the
	 * extra config members will assume their default values.
	 *
	 * A value greater than what the backend expects is incompatible.
	 */
	size_t struct_size;
};

struct weston_backend;

/** Callback for saving calibration
 *
 * \param compositor The compositor.
 * \param device The physical touch device to save for.
 * \param calibration The new calibration from a client.
 * \return -1 on failure, 0 on success.
 *
 * Failure will prevent taking the new calibration into use.
 */
typedef int (*weston_touch_calibration_save_func)(
	struct weston_compositor *compositor,
	struct weston_touch_device *device,
	const struct weston_touch_device_matrix *calibration);
struct weston_touch_calibrator;

struct weston_desktop_xwayland;
struct weston_desktop_xwayland_interface;
struct weston_debug_compositor;
struct weston_color_manager;
struct weston_dmabuf_feedback;
struct weston_dmabuf_feedback_format_table;
struct weston_renderer;

/** Main object, container-like structure which aggregates all other objects.
 *
 * \ingroup compositor
 */
struct weston_compositor {
	struct wl_signal destroy_signal;

	struct wl_display *wl_display;
	struct weston_desktop_xwayland *xwayland;
	const struct weston_desktop_xwayland_interface *xwayland_interface;

	/* surface signals */
	struct wl_signal create_surface_signal;
	struct wl_signal activate_signal;
	struct wl_signal transform_signal;

	struct wl_signal kill_signal;
	struct wl_signal idle_signal;
	struct wl_signal wake_signal;

	struct wl_signal show_input_panel_signal;
	struct wl_signal hide_input_panel_signal;
	struct wl_signal update_input_panel_signal;

	struct wl_signal seat_created_signal;
	struct wl_signal output_created_signal;
	struct wl_signal output_destroyed_signal;
	struct wl_signal output_moved_signal;
	struct wl_signal output_resized_signal; /* callback argument: resized output */

	/* Signal for output changes triggered by configuration from frontend
	 * or head state changes from backend.
	 */
	struct wl_signal output_heads_changed_signal; /* arg: weston_output */

	struct wl_signal session_signal;
	bool session_active;

	struct weston_layer fade_layer;
	struct weston_layer cursor_layer;

	struct wl_list pending_output_list;
	struct wl_list output_list;
	struct wl_list head_list;	/* struct weston_head::compositor_link */
	struct wl_list seat_list;
	struct wl_list layer_list;	/* struct weston_layer::link */
	struct wl_list view_list;	/* struct weston_view::link */
	struct wl_list plane_list;
	struct wl_list key_binding_list;
	struct wl_list modifier_binding_list;
	struct wl_list button_binding_list;
	struct wl_list touch_binding_list;
	struct wl_list axis_binding_list;
	struct wl_list debug_binding_list;

	uint32_t state;
	struct wl_event_source *idle_source;
	uint32_t idle_inhibit;
	int idle_time;			/* timeout, s */
	struct wl_event_source *repaint_timer;

	const struct weston_pointer_grab_interface *default_pointer_grab;

	/* Repaint state. */
	struct weston_plane primary_plane;
	uint32_t capabilities; /* combination of enum weston_capability */

	struct weston_color_manager *color_manager;
	struct weston_renderer *renderer;
	const struct pixel_format_info *read_format;

	struct weston_backend *backend;
	struct weston_launcher *launcher;

	struct weston_dmabuf_feedback *default_dmabuf_feedback;
	struct weston_dmabuf_feedback_format_table *dmabuf_feedback_format_table;

	struct wl_list plugin_api_list; /* struct weston_plugin_api::link */

	uint32_t output_id_pool;
	bool output_flow_dirty;

	struct xkb_rule_names xkb_names;
	struct xkb_context *xkb_context;
	struct weston_xkb_info *xkb_info;

	int32_t kb_repeat_rate;
	int32_t kb_repeat_delay;

	bool vt_switching;

	clockid_t presentation_clock;
	int32_t repaint_msec;
	struct timespec last_repaint_start;

	unsigned int activate_serial;

	struct wl_global *pointer_constraints;

	int exit_code;

	void *user_data;
	void (*exit)(struct weston_compositor *c);

	/* Whether to let the compositor run without any input device. */
	bool require_input;

	/* Test suite data */
	struct weston_testsuite_data test_data;

	/* Signal for a backend to inform a frontend about possible changes
	 * in head status.
	 */
	struct wl_signal heads_changed_signal;
	struct wl_event_source *heads_changed_source;

	/* Touchscreen calibrator support: */
	enum weston_touch_mode touch_mode;
	struct wl_global *touch_calibration;
	weston_touch_calibration_save_func touch_calibration_save;
	struct weston_layer calibrator_layer;
	struct weston_touch_calibrator *touch_calibrator;

	struct weston_log_context *weston_log_ctx;
	struct weston_log_scope *debug_scene;
	struct weston_log_scope *timeline;
	struct weston_log_scope *libseat_debug;

	struct content_protection *content_protection;

	struct weston_log_pacer unmapped_surface_or_view_pacer;
	struct weston_log_pacer presentation_clock_failure_pacer;

	/** Screenshooting global state, see output-capture.c */
	struct {
		struct wl_global *weston_capture_v1;
		struct wl_signal ask_auth;
	} output_capture;
};

struct weston_solid_buffer_values {
	float r, g, b, a;
};

struct weston_buffer {
	struct wl_resource *resource;
	struct wl_signal destroy_signal;
	struct wl_listener destroy_listener;

	enum {
		WESTON_BUFFER_SHM,
		WESTON_BUFFER_DMABUF,
		WESTON_BUFFER_RENDERER_OPAQUE,
		WESTON_BUFFER_SOLID,
	} type;

	union {
		struct wl_shm_buffer *shm_buffer;
		void *dmabuf;
		void *legacy_buffer;
		struct weston_solid_buffer_values solid;
	};

	int32_t width, height;
	uint32_t busy_count;
	uint32_t passive_count;
	enum {
		ORIGIN_TOP_LEFT, /* buffer content starts at (0,0) */
		ORIGIN_BOTTOM_LEFT, /* buffer content starts at (0, height) */
	} buffer_origin;
	bool direct_display;

	void *renderer_private;
	void *backend_private;

	const struct pixel_format_info *pixel_format;
	uint64_t format_modifier;
};

enum weston_buffer_reference_type {
	BUFFER_REF_NONE,
	BUFFER_MAY_BE_ACCESSED,
	BUFFER_WILL_NOT_BE_ACCESSED,
};

struct weston_buffer_reference {
	struct weston_buffer *buffer;
	enum weston_buffer_reference_type type;
};

struct weston_buffer_viewport {
	struct {
		/* wl_surface.set_buffer_transform */
		uint32_t transform;

		/* wl_surface.set_scaling_factor */
		int32_t scale;

		/*
		 * If src_width != wl_fixed_from_int(-1),
		 * then and only then src_* are used.
		 */
		wl_fixed_t src_x, src_y;
		wl_fixed_t src_width, src_height;
	} buffer;

	struct {
		/*
		 * If width == -1, the size is inferred from the buffer.
		 */
		int32_t width, height;
	} surface;

	int changed;
};

struct weston_buffer_release {
	/* The associated zwp_linux_buffer_release_v1 resource. */
	struct wl_resource *resource;
	/* How many weston_buffer_release_reference objects point to this
	 * object. */
	uint32_t ref_count;
	/* The fence fd, if any, associated with this release. If the fence fd
	 * is -1 then this is considered an immediate release. */
	int fence_fd;
};

struct weston_buffer_release_reference {
	struct weston_buffer_release *buffer_release;
	/* Listener for the destruction of the wl_resource associated with the
	 * referenced buffer_release object. */
	struct wl_listener destroy_listener;
};

struct weston_region {
	struct wl_resource *resource;
	pixman_region32_t region;
};

/* Using weston_view transformations
 *
 * To add a transformation to a view, create a struct weston_transform, and
 * add it to the list view->geometry.transformation_list. Whenever you
 * change the list, anything under view->geometry, or anything in the
 * weston_transforms linked into the list, you must call
 * weston_view_geometry_dirty().
 *
 * The order in the list defines the order of transformations. Let the list
 * contain the transformation matrices M1, ..., Mn as head to tail. The
 * transformation is applied to view-local coordinate vector p as
 *    P = Mn * ... * M2 * M1 * p
 * to produce the global coordinate vector P. The total transform
 *    Mn * ... * M2 * M1
 * is cached in view->transform.matrix, and the inverse of it in
 * view->transform.inverse.
 *
 * The list always contains view->transform.position transformation, which
 * is the translation by view->geometry.x and y.
 *
 * If you want to apply a transformation in local coordinates, add your
 * weston_transform to the head of the list. If you want to apply a
 * transformation in global coordinates, add it to the tail of the list.
 *
 * If view->geometry.parent is set, the total transformation of this
 * view will be the parent's total transformation and this transformation
 * combined:
 *    Mparent * Mn * ... * M2 * M1
 */

struct weston_view {
	struct weston_surface *surface;
	struct wl_list surface_link;
	struct wl_signal destroy_signal;

	/* struct weston_paint_node::view_link */
	struct wl_list paint_node_list;

	struct wl_list link;             /* weston_compositor::view_list */
	struct weston_layer_entry layer_link; /* part of geometry */
	struct weston_plane *plane;

	/* For weston_layer inheritance from another view */
	struct weston_view *parent_view;

	unsigned int click_to_activate_serial;

	pixman_region32_t clip;          /* See weston_view_damage_below() */
	float alpha;                     /* part of geometry, see below */

	/* Surface geometry state, mutable.
	 * If you change anything, call weston_surface_geometry_dirty().
	 * That includes the transformations referenced from the list.
	 */
	struct {
		float x, y; /* surface translation on display */

		/* struct weston_transform */
		struct wl_list transformation_list;

		/* managed by weston_view_set_transform_parent() */
		struct weston_view *parent;
		struct wl_listener parent_destroy_listener;
		struct wl_list child_list; /* geometry.parent_link */
		struct wl_list parent_link;

		/* managed by weston_view_set_mask() */
		bool scissor_enabled;
		pixman_region32_t scissor; /* always a simple rect */
	} geometry;

	/* State derived from geometry state, read-only.
	 * This is updated by weston_view_update_transform().
	 */
	struct {
		int dirty;

		/* Approximations in global coordinates:
		 * - boundingbox is guaranteed to include the whole view in
		 *   the smallest possible single rectangle.
		 * - opaque is guaranteed to be fully opaque, though not
		 *   necessarily include all opaque areas.
		 */
		pixman_region32_t boundingbox;
		pixman_region32_t opaque;

		/* Regardless of enabled status, matrix and inverse are
		 * updated by weston_view_update_transform(), and are
		 * used for coordinate conversion between the view
		 * and global spaces.
		 */
		int enabled;
		struct weston_matrix matrix;
		struct weston_matrix inverse;

		struct weston_transform position; /* matrix from x, y */
	} transform;

	/*
	 * The primary output for this view.
	 * Used for picking the output for driving internal animations on the
	 * view, inheriting the primary output for related views in shells, etc.
	 */
	struct weston_output *output;
	struct wl_listener output_destroy_listener;

	/*
	 * A more complete representation of all outputs this surface is
	 * displayed on.
	 */
	uint32_t output_mask;

	/* Per-surface Presentation feedback flags, controlled by backend. */
	uint32_t psf_flags;

	bool is_mapped;
};

struct weston_surface_state {
	/* wl_surface.attach */
	int newly_attached;
	struct weston_buffer *buffer;
	struct wl_listener buffer_destroy_listener;

	int32_t sx;
	int32_t sy;

	/* wl_surface.damage */
	pixman_region32_t damage_surface;
	/* wl_surface.damage_buffer */
	pixman_region32_t damage_buffer;

	/* wl_surface.set_opaque_region */
	pixman_region32_t opaque;

	/* wl_surface.set_input_region */
	pixman_region32_t input;

	/* wl_surface.frame */
	struct wl_list frame_callback_list;

	/* presentation.feedback */
	struct wl_list feedback_list;

	/* wl_surface.set_buffer_transform */
	/* wl_surface.set_scaling_factor */
	/* wp_viewport.set_source */
	/* wp_viewport.set_destination */
	struct weston_buffer_viewport buffer_viewport;

	/* zwp_surface_synchronization_v1.set_acquire_fence */
	int acquire_fence_fd;

	/* zwp_surface_synchronization_v1.get_release */
	struct weston_buffer_release_reference buffer_release_ref;

	/* weston_protected_surface.set_type */
	enum weston_hdcp_protection desired_protection;

	/* weston_protected_surface.enforced/relaxed */
	enum weston_surface_protection_mode protection_mode;
};

struct weston_surface_activation_data {
	struct weston_surface *surface;
	struct weston_seat *seat;
};

struct weston_pointer_constraint {
	struct wl_list link;

	struct weston_surface *surface;
	struct weston_view *view;
	struct wl_resource *resource;
	struct weston_pointer_grab grab;
	struct weston_pointer *pointer;
	uint32_t lifetime;

	pixman_region32_t region;
	pixman_region32_t region_pending;
	bool region_is_pending;

	wl_fixed_t hint_x;
	wl_fixed_t hint_y;
	wl_fixed_t hint_x_pending;
	wl_fixed_t hint_y_pending;
	bool hint_is_pending;

	struct wl_listener pointer_destroy_listener;
	struct wl_listener surface_destroy_listener;
	struct wl_listener surface_commit_listener;
	struct wl_listener surface_activate_listener;
};

struct weston_surface {
	struct wl_resource *resource;
	struct wl_signal destroy_signal; /* callback argument: this surface */
	struct weston_compositor *compositor;
	struct wl_signal commit_signal;

	/* struct weston_paint_node::surface_link */
	struct wl_list paint_node_list;

	/** Damage in local coordinates from the client, for tex upload. */
	pixman_region32_t damage;

	pixman_region32_t opaque;        /* part of geometry, see below */
	pixman_region32_t input;
	int32_t width, height;
	int32_t ref_count;

	/* Not for long-term storage.  This exists for book-keeping while
	 * iterating over surfaces and views
	 */
	bool touched;

	void *renderer_state;

	struct wl_list views;

	/*
	 * Which output to vsync this surface to.
	 * Used to determine whether to send or queue frame events, and for
	 * other client-visible syncing/throttling tied to the output
	 * repaint cycle.
	 */
	struct weston_output *output;

	/*
	 * A more complete representation of all outputs this surface is
	 * displayed on.
	 */
	uint32_t output_mask;

	struct wl_list frame_callback_list;
	struct wl_list feedback_list;

	struct weston_buffer_reference buffer_ref;
	struct weston_buffer_viewport buffer_viewport;
	int32_t width_from_buffer; /* before applying viewport */
	int32_t height_from_buffer;
	bool keep_buffer; /* for backends to prevent early release */

	/* wp_viewport resource for this surface */
	struct wl_resource *viewport_resource;

	/* All the pending state, that wl_surface.commit will apply. */
	struct weston_surface_state pending;

	/* Matrices representing of the full transformation between
	 * buffer and surface coordinates.  These matrices are updated
	 * using the weston_surface_build_buffer_matrix function. */
	struct weston_matrix buffer_to_surface_matrix;
	struct weston_matrix surface_to_buffer_matrix;

	/*
	 * If non-NULL, this function will be called on
	 * wl_surface::commit after a new buffer has been set up for
	 * this surface. The integer params are the sx and sy
	 * parameters supplied to wl_surface::attach.
	 */
	void (*committed)(struct weston_surface *es, int32_t sx, int32_t sy);
	void *committed_private;
	int (*get_label)(struct weston_surface *surface, char *buf, size_t len);

	/* Parent's list of its sub-surfaces, weston_subsurface:parent_link.
	 * Contains also the parent itself as a dummy weston_subsurface,
	 * if the list is not empty.
	 */
	struct wl_list subsurface_list; /* weston_subsurface::parent_link */
	struct wl_list subsurface_list_pending; /* ...::parent_link_pending */

	/*
	 * For tracking protocol role assignments. Different roles may
	 * have the same configure hook, e.g. in shell.c. Configure hook
	 * may get reset, this will not.
	 * XXX: map configure functions 1:1 to roles, and never reset it,
	 * and replace role_name with configure.
	 */
	const char *role_name;

	bool is_mapped;
	bool is_opaque;

	/* An list of per seat pointer constraints. */
	struct wl_list pointer_constraints;

	/* zwp_surface_synchronization_v1 resource for this surface */
	struct wl_resource *synchronization_resource;
	int acquire_fence_fd;
	struct weston_buffer_release_reference buffer_release_ref;

	struct weston_dmabuf_feedback *dmabuf_feedback;

	enum weston_hdcp_protection desired_protection;
	enum weston_hdcp_protection current_protection;
	enum weston_surface_protection_mode protection_mode;
};

struct weston_subsurface {
	struct wl_resource *resource;

	/* guaranteed to be valid and non-NULL */
	struct weston_surface *surface;
	struct wl_listener surface_destroy_listener;

	/* can be NULL */
	struct weston_surface *parent;
	struct wl_listener parent_destroy_listener;
	struct wl_list parent_link;
	struct wl_list parent_link_pending;

	struct {
		int32_t x;
		int32_t y;
		int set;
	} position;

	int has_cached_data;
	struct weston_surface_state cached;
	struct weston_buffer_reference cached_buffer_ref;

	/* Sub-surface has been reordered; need to apply damage. */
	bool reordered;

	int synchronized;

	/* Used for constructing the view tree */
	struct wl_list unused_views;
};

struct protected_surface {
	struct weston_surface *surface;
	struct wl_listener surface_destroy_listener;
	struct wl_list link;
	struct wl_resource *protection_resource;
	struct content_protection *cp_backptr;
};

struct content_protection {
	struct weston_compositor *compositor;
	struct wl_listener destroy_listener;
	struct weston_log_scope *debug;
	struct wl_list protected_list;
	struct wl_event_source *surface_protection_update;
};


enum weston_key_state_update {
	STATE_UPDATE_AUTOMATIC,
	STATE_UPDATE_NONE,
};

enum weston_activate_flag {
	WESTON_ACTIVATE_FLAG_NONE = 0,
	WESTON_ACTIVATE_FLAG_CONFIGURE = 1 << 0,
	WESTON_ACTIVATE_FLAG_CLICKED = 1 << 1,
};

void
weston_version(int *major, int *minor, int *micro);

void
weston_view_set_output(struct weston_view *view, struct weston_output *output);

void
weston_view_update_transform(struct weston_view *view);

void
weston_view_geometry_dirty(struct weston_view *view);

void
weston_view_to_global_float(struct weston_view *view,
			    float sx, float sy, float *x, float *y);

void
weston_view_from_global(struct weston_view *view,
			int32_t x, int32_t y, int32_t *vx, int32_t *vy);
void
weston_view_from_global_fixed(struct weston_view *view,
			      wl_fixed_t x, wl_fixed_t y,
			      wl_fixed_t *vx, wl_fixed_t *vy);

void
weston_view_activate_input(struct weston_view *view,
		           struct weston_seat *seat,
		           uint32_t flags);

void
notify_modifiers(struct weston_seat *seat, uint32_t serial);

void
weston_layer_entry_insert(struct weston_layer_entry *list,
			  struct weston_layer_entry *entry);
void
weston_layer_entry_remove(struct weston_layer_entry *entry);
void
weston_layer_init(struct weston_layer *layer,
		  struct weston_compositor *compositor);
void
weston_layer_fini(struct weston_layer *layer);
void
weston_layer_set_position(struct weston_layer *layer,
			  enum weston_layer_position position);
void
weston_layer_unset_position(struct weston_layer *layer);

void
weston_layer_set_mask(struct weston_layer *layer, int x, int y, int width, int height);

void
weston_layer_set_mask_infinite(struct weston_layer *layer);

bool
weston_layer_mask_is_infinite(struct weston_layer *layer);

/* An invalid flag in presented_flags to catch logic errors. */
#define WP_PRESENTATION_FEEDBACK_INVALID (1U << 31)

void
weston_output_schedule_repaint(struct weston_output *output);
void
weston_compositor_schedule_repaint(struct weston_compositor *compositor);
void
weston_compositor_damage_all(struct weston_compositor *compositor);
void
weston_compositor_wake(struct weston_compositor *compositor);
void
weston_compositor_sleep(struct weston_compositor *compositor);
struct weston_view *
weston_compositor_pick_view(struct weston_compositor *compositor,
			    wl_fixed_t x, wl_fixed_t y);

struct weston_binding;
typedef void (*weston_key_binding_handler_t)(struct weston_keyboard *keyboard,
					     const struct timespec *time,
					     uint32_t key,
					     void *data);
struct weston_binding *
weston_compositor_add_key_binding(struct weston_compositor *compositor,
				  uint32_t key,
				  enum weston_keyboard_modifier modifier,
				  weston_key_binding_handler_t binding,
				  void *data);
struct weston_binding *
weston_compositor_add_debug_binding(struct weston_compositor *compositor,
				    uint32_t key,
				    weston_key_binding_handler_t binding,
				    void *data);

typedef void (*weston_modifier_binding_handler_t)(struct weston_keyboard *keyboard,
					          enum weston_keyboard_modifier modifier,
					          void *data);
struct weston_binding *
weston_compositor_add_modifier_binding(struct weston_compositor *compositor,
				       enum weston_keyboard_modifier modifier,
				       weston_modifier_binding_handler_t binding,
				       void *data);

typedef void (*weston_button_binding_handler_t)(struct weston_pointer *pointer,
						const struct timespec *time,
						uint32_t button,
						void *data);
struct weston_binding *
weston_compositor_add_button_binding(struct weston_compositor *compositor,
				     uint32_t button,
				     enum weston_keyboard_modifier modifier,
				     weston_button_binding_handler_t binding,
				     void *data);

typedef void (*weston_touch_binding_handler_t)(struct weston_touch *touch,
					       const struct timespec *time,
					       void *data);
struct weston_binding *
weston_compositor_add_touch_binding(struct weston_compositor *compositor,
				    enum weston_keyboard_modifier modifier,
				    weston_touch_binding_handler_t binding,
				    void *data);

typedef void (*weston_axis_binding_handler_t)(struct weston_pointer *pointer,
					      const struct timespec *time,
					      struct weston_pointer_axis_event *event,
					      void *data);
struct weston_binding *
weston_compositor_add_axis_binding(struct weston_compositor *compositor,
			           uint32_t axis,
			           enum weston_keyboard_modifier modifier,
			           weston_axis_binding_handler_t binding,
				   void *data);

void
weston_binding_destroy(struct weston_binding *binding);

void
weston_install_debug_key_binding(struct weston_compositor *compositor,
				 uint32_t mod);

void
weston_compositor_set_default_pointer_grab(struct weston_compositor *compositor,
			const struct weston_pointer_grab_interface *interface);

struct weston_surface *
weston_surface_create(struct weston_compositor *compositor);

struct weston_view *
weston_view_create(struct weston_surface *surface);

struct weston_buffer_reference *
weston_buffer_create_solid_rgba(struct weston_compositor *compositor,
				float r, float g, float b, float a);

void
weston_surface_attach_solid(struct weston_surface *surface,
			    struct weston_buffer_reference *buffer_ref,
			    int w, int h);

void
weston_buffer_destroy_solid(struct weston_buffer_reference *buffer_ref);

bool
weston_surface_has_content(struct weston_surface *surface);

void
weston_view_destroy(struct weston_view *view);

void
weston_view_set_position(struct weston_view *view,
			 float x, float y);

void
weston_view_set_transform_parent(struct weston_view *view,
				 struct weston_view *parent);

void
weston_view_set_mask(struct weston_view *view,
		     int x, int y, int width, int height);

void
weston_view_set_mask_infinite(struct weston_view *view);

bool
weston_view_is_mapped(struct weston_view *view);

void
weston_view_schedule_repaint(struct weston_view *view);

bool
weston_surface_is_mapped(struct weston_surface *surface);

void
weston_surface_set_size(struct weston_surface *surface,
			int32_t width, int32_t height);

void
weston_surface_damage(struct weston_surface *surface);

void
weston_view_damage_below(struct weston_view *view);

void
weston_view_unmap(struct weston_view *view);

void
weston_surface_map(struct weston_surface *surface);

void
weston_surface_unmap(struct weston_surface *surface);

struct weston_surface *
weston_surface_get_main_surface(struct weston_surface *surface);

int
weston_surface_set_role(struct weston_surface *surface,
			const char *role_name,
			struct wl_resource *error_resource,
			uint32_t error_code);
const char *
weston_surface_get_role(struct weston_surface *surface);

void
weston_surface_set_label_func(struct weston_surface *surface,
			      int (*desc)(struct weston_surface *,
					  char *, size_t));

void
weston_surface_get_content_size(struct weston_surface *surface,
				int *width, int *height);

struct weston_geometry
weston_surface_get_bounding_box(struct weston_surface *surface);

int
weston_surface_copy_content(struct weston_surface *surface,
			    void *target, size_t size,
			    int src_x, int src_y,
			    int width, int height);

struct weston_buffer *
weston_buffer_from_resource(struct weston_compositor *ec,
			    struct wl_resource *resource);

void
weston_compositor_get_time(struct timespec *time);

void
weston_compositor_destroy(struct weston_compositor *ec);

struct weston_compositor *
weston_compositor_create(struct wl_display *display,
			 struct weston_log_context *log_ctx, void *user_data,
			 const struct weston_testsuite_data *test_data);

void *
weston_compositor_get_test_data(struct weston_compositor *ec);

bool
weston_compositor_add_destroy_listener_once(struct weston_compositor *compositor,
					    struct wl_listener *listener,
					    wl_notify_func_t destroy_handler);

enum weston_compositor_backend {
	WESTON_BACKEND_DRM,
	WESTON_BACKEND_HEADLESS,
	WESTON_BACKEND_RDP,
	WESTON_BACKEND_VNC,
	WESTON_BACKEND_WAYLAND,
	WESTON_BACKEND_X11,
};

int
weston_compositor_load_backend(struct weston_compositor *compositor,
			       enum weston_compositor_backend backend,
			       struct weston_backend_config *config_base);
void
weston_compositor_exit(struct weston_compositor *ec);
void *
weston_compositor_get_user_data(struct weston_compositor *compositor);
void
weston_compositor_exit_with_code(struct weston_compositor *compositor,
				 int exit_code);
void
weston_output_add_destroy_listener(struct weston_output *output,
				   struct wl_listener *listener);
struct wl_listener *
weston_output_get_destroy_listener(struct weston_output *output,
				   wl_notify_func_t notify);
int
weston_compositor_set_xkb_rule_names(struct weston_compositor *ec,
				     struct xkb_rule_names *names);

/* String literal of spaces, the same width as the timestamp. */
#define STAMP_SPACE "               "

/**
 * \ingroup wlog
 */
typedef int (*log_func_t)(const char *fmt, va_list ap);
void
weston_log_set_handler(log_func_t log, log_func_t cont);
int
weston_log(const char *fmt, ...)
	__attribute__ ((format (printf, 1, 2)));
int
weston_log_continue(const char *fmt, ...)
	__attribute__ ((format (printf, 1, 2)));

void
weston_log_paced(struct weston_log_pacer *pacer, unsigned int max_burst,
		 unsigned int reset_ms, const char *fmt, ...)
	__attribute__ ((format (printf, 4, 5)));

enum weston_screenshooter_outcome {
	WESTON_SCREENSHOOTER_SUCCESS,
	WESTON_SCREENSHOOTER_NO_MEMORY,
	WESTON_SCREENSHOOTER_BAD_BUFFER
};

typedef void (*weston_screenshooter_done_func_t)(void *data,
				enum weston_screenshooter_outcome outcome);
int
weston_screenshooter_shoot(struct weston_output *output, struct weston_buffer *buffer,
			   weston_screenshooter_done_func_t done, void *data) WL_DEPRECATED;
struct weston_recorder *
weston_recorder_start(struct weston_output *output, const char *filename);
void
weston_recorder_stop(struct weston_recorder *recorder);

struct weston_view_animation;
typedef	void (*weston_view_animation_done_func_t)(struct weston_view_animation *animation, void *data);

void
weston_view_animation_destroy(struct weston_view_animation *animation);

struct weston_view_animation *
weston_zoom_run(struct weston_view *view, float start, float stop,
		weston_view_animation_done_func_t done, void *data);

struct weston_view_animation *
weston_fade_run(struct weston_view *view,
		float start, float end, float k,
		weston_view_animation_done_func_t done, void *data);

struct weston_view_animation *
weston_move_scale_run(struct weston_view *view, int dx, int dy,
		      float start, float end, bool reverse,
		      weston_view_animation_done_func_t done, void *data);

struct weston_view_animation *
weston_move_run(struct weston_view *view, int dx, int dy,
		float start, float end, bool reverse,
		weston_view_animation_done_func_t done, void *data);

void
weston_fade_update(struct weston_view_animation *fade, float target);

struct weston_view_animation *
weston_stable_fade_run(struct weston_view *front_view, float start,
		       struct weston_view *back_view, float end,
		       weston_view_animation_done_func_t done, void *data);

struct weston_view_animation *
weston_slide_run(struct weston_view *view, float start, float stop,
		 weston_view_animation_done_func_t done, void *data);

struct weston_surface *
weston_surface_ref(struct weston_surface *surface);

void
weston_surface_unref(struct weston_surface *surface);

int
weston_output_mode_switch_to_temporary(struct weston_output *output,
				       struct weston_mode *mode,
				       int32_t scale);
int
weston_output_mode_switch_to_native(struct weston_output *output);

int
weston_backend_init(struct weston_compositor *c,
		    struct weston_backend_config *config_base);
int
weston_module_init(struct weston_compositor *compositor);

void *
weston_load_module(const char *name, const char *entrypoint, const char *module_dir);

size_t
weston_module_path_from_env(const char *name, char *path, size_t path_len);

int
weston_parse_transform(const char *transform, uint32_t *out);

const char *
weston_transform_to_string(uint32_t output_transform);

struct weston_keyboard *
weston_seat_get_keyboard(struct weston_seat *seat);

struct weston_pointer *
weston_seat_get_pointer(struct weston_seat *seat);

struct weston_touch *
weston_seat_get_touch(struct weston_seat *seat);

void
weston_seat_set_keyboard_focus(struct weston_seat *seat,
			       struct weston_surface *surface);

void
weston_keyboard_send_keymap(struct weston_keyboard *kbd,
			    struct wl_resource *resource);

int
weston_compositor_load_xwayland(struct weston_compositor *compositor);

int
weston_compositor_load_color_manager(struct weston_compositor *compositor);

bool
weston_head_is_connected(struct weston_head *head);

bool
weston_head_is_enabled(struct weston_head *head);

bool
weston_head_is_device_changed(struct weston_head *head);

bool
weston_head_is_non_desktop(struct weston_head *head);

void
weston_head_reset_device_changed(struct weston_head *head);

const char *
weston_head_get_name(struct weston_head *head);

struct weston_output *
weston_head_get_output(struct weston_head *head);

uint32_t
weston_head_get_transform(struct weston_head *head);

void
weston_head_detach(struct weston_head *head);

void
weston_head_add_destroy_listener(struct weston_head *head,
				 struct wl_listener *listener);

struct wl_listener *
weston_head_get_destroy_listener(struct weston_head *head,
				 wl_notify_func_t notify);

void
weston_head_set_content_protection_status(struct weston_head *head,
					  enum weston_hdcp_protection status);

struct weston_head *
weston_compositor_iterate_heads(struct weston_compositor *compositor,
				struct weston_head *iter);

void
weston_compositor_add_heads_changed_listener(struct weston_compositor *compositor,
					     struct wl_listener *listener);

struct weston_output *
weston_compositor_find_output_by_name(struct weston_compositor *compositor,
				      const char *name);

struct weston_output *
weston_compositor_create_output(struct weston_compositor *compositor,
				struct weston_head *head, const char *name);

void
weston_output_destroy(struct weston_output *output);

int
weston_output_attach_head(struct weston_output *output,
			  struct weston_head *head);

struct weston_head *
weston_output_iterate_heads(struct weston_output *output,
			    struct weston_head *iter);

void
weston_output_set_scale(struct weston_output *output,
			int32_t scale);

void
weston_output_set_transform(struct weston_output *output,
			    uint32_t transform);

bool
weston_output_set_color_profile(struct weston_output *output,
				struct weston_color_profile *cprof);

void
weston_output_set_eotf_mode(struct weston_output *output,
			    enum weston_eotf_mode eotf_mode);

enum weston_eotf_mode
weston_output_get_eotf_mode(const struct weston_output *output);

void
weston_output_set_color_characteristics(struct weston_output *output,
					const struct weston_color_characteristics *cc);

const struct weston_color_characteristics *
weston_output_get_color_characteristics(struct weston_output *output);

void
weston_output_init(struct weston_output *output,
		   struct weston_compositor *compositor,
		   const char *name);

void
weston_output_move(struct weston_output *output, int x, int y);

int
weston_output_enable(struct weston_output *output);

void
weston_output_disable(struct weston_output *output);

uint32_t
weston_output_get_supported_eotf_modes(struct weston_output *output);

void
weston_compositor_flush_heads_changed(struct weston_compositor *compositor);

struct weston_head *
weston_head_from_resource(struct wl_resource *resource);

struct weston_head *
weston_output_get_first_head(struct weston_output *output);

void
weston_output_allow_protection(struct weston_output *output,
			       bool allow_protection);

bool
weston_output_contains_point(struct weston_output *output,
			     int32_t x, int32_t y);

int
weston_compositor_enable_touch_calibrator(struct weston_compositor *compositor,
				weston_touch_calibration_save_func save);

struct weston_log_context *
weston_log_ctx_create(void);

void
weston_log_ctx_destroy(struct weston_log_context *log_ctx);

int
weston_compositor_enable_content_protection(struct weston_compositor *compositor);

void
weston_timeline_refresh_subscription_objects(struct weston_compositor *wc,
					     void *object);

struct weston_color_profile *
weston_color_profile_ref(struct weston_color_profile *cprof);

void
weston_color_profile_unref(struct weston_color_profile *cprof);

const char *
weston_color_profile_get_description(struct weston_color_profile *cprof);

struct weston_color_profile *
weston_compositor_load_icc_file(struct weston_compositor *compositor,
				const char *path);

/** Describes who is trying to capture and which output */
struct weston_output_capture_client {
	struct wl_client *client;
	struct weston_output *output;
};

/** Arguments asking to authorize a screenshot/capture
 *
 * \sa weston_compositor_add_screenshot_authority
 */
struct weston_output_capture_attempt {
	const struct weston_output_capture_client *const who;

	/** Set to true to authorize the screenshot. */
	bool authorized;
	/** Set to true to deny the screenshot. */
	bool denied;
};

void
weston_compositor_add_screenshot_authority(struct weston_compositor *compositor,
					   struct wl_listener *listener,
					   void (*auth)(struct wl_listener *l,
					   		struct weston_output_capture_attempt *att));

#ifdef  __cplusplus
}
#endif

#endif
