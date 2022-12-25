/* We reuse some predefined, but otherwise useles atoms
 * as local type placeholders that never touch the X11 server,
 * to make weston_wm_window_read_properties() less exceptional.
 */
import { Atom } from 'xtsb'

export const TYPE_WM_PROTOCOLS = Atom.cutBuffer0
export const TYPE_MOTIF_WM_HINTS = Atom.cutBuffer1
export const TYPE_NET_WM_STATE = Atom.cutBuffer2
export const TYPE_WM_NORMAL_HINTS = Atom.cutBuffer3

export const MWM_HINTS_FUNCTIONS = 1 as const
export const MWM_HINTS_DECORATIONS = 2 as const
export const MWM_HINTS_INPUT_MODE = 4 as const
export const MWM_HINTS_STATUS = 8 as const

export const MWM_DECOR_ALL = 1 as const
export const MWM_DECOR_BORDER = 2 as const
export const MWM_DECOR_RESIZEH = 4 as const
export const MWM_DECOR_TITLE = 8 as const
export const MWM_DECOR_MENU = 16 as const
export const MWM_DECOR_MINIMIZE = 32 as const
export const MWM_DECOR_MAXIMIZE = 64 as const

export const MWM_DECOR_EVERYTHING = 126 as const

export const _NET_WM_MOVERESIZE_SIZE_TOPLEFT = 0 as const
export const _NET_WM_MOVERESIZE_SIZE_TOP = 1 as const
export const _NET_WM_MOVERESIZE_SIZE_TOPRIGHT = 2 as const
export const _NET_WM_MOVERESIZE_SIZE_RIGHT = 3 as const
export const _NET_WM_MOVERESIZE_SIZE_BOTTOMRIGHT = 4 as const
export const _NET_WM_MOVERESIZE_SIZE_BOTTOM = 5 as const
export const _NET_WM_MOVERESIZE_SIZE_BOTTOMLEFT = 6 as const
export const _NET_WM_MOVERESIZE_SIZE_LEFT = 7 as const
export const _NET_WM_MOVERESIZE_MOVE = 8 as const /* movement only */
export const _NET_WM_MOVERESIZE_SIZE_KEYBOARD = 9 as const /* size via keyboard */
export const _NET_WM_MOVERESIZE_MOVE_KEYBOARD = 10 as const /* move via keyboard */
export const _NET_WM_MOVERESIZE_CANCEL = 11 as const /* cancel operation */

export const topBarHeight = 25

export const SEND_EVENT_MASK = 0x80

export const MWM_FUNC_ALL = 1 as const
export const MWM_FUNC_RESIZE = 2 as const
export const MWM_FUNC_MOVE = 4 as const
export const MWM_FUNC_MINIMIZE = 8 as const
export const MWM_FUNC_MAXIMIZE = 16 as const
export const MWM_FUNC_CLOSE = 32 as const

export const MWM_INPUT_MODELESS = 0 as const
export const MWM_INPUT_PRIMARY_APPLICATION_MODAL = 1 as const
export const MWM_INPUT_SYSTEM_MODAL = 2 as const
export const MWM_INPUT_FULL_APPLICATION_MODAL = 3 as const
export const MWM_INPUT_APPLICATION_MODAL = MWM_INPUT_PRIMARY_APPLICATION_MODAL

export const MWM_TEAROFF_WINDOW = 1 as const

export const ICCCM_WITHDRAWN_STATE = 0 as const
export const ICCCM_NORMAL_STATE = 1 as const
export const ICCCM_ICONIC_STATE = 3 as const

export const _NET_WM_STATE_REMOVE = 0
export const _NET_WM_STATE_ADD = 1
export const _NET_WM_STATE_TOGGLE = 2

export const USPosition = 1
export const USSize = 2
export const PPosition = 4
export const PSize = 8
export const PMinSize = 16
export const PMaxSize = 32
export const PResizeInc = 64
export const PAspect = 128
export const PBaseSize = 256
export const PWinGravity = 512

export const InputHint = 1 //input
export const StateHint = 2 // initial_state
export const IconPixmapHint = 4 // icon_pixmap
export const IconWindowHint = 8 // icon_window
export const IconPositionHint = 16 // icon_x & icon_y
export const IconMaskHint = 32 //	icon_mask
export const WindowGroupHint = 64 //	window_group
export const MessageHint = 128 //	(this bit is obsolete)
export const UrgencyHint = 256 //	urgency
