/*
 *
 *    Copyright © 2008-2013 Kristian Høgsberg
 *    Copyright © 2013      Rafael Antognolli
 *    Copyright © 2013      Jasper St. Pierre
 *    Copyright © 2010-2013 Intel Corporation
 *    Copyright © 2015-2017 Samsung Electronics Co., Ltd
 *    Copyright © 2015-2017 Red Hat Inc.
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a
 *    copy of this software and associated documentation files (the "Software"),
 *    to deal in the Software without restriction, including without limitation
 *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *    and/or sell copies of the Software, and to permit persons to whom the
 *    Software is furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the next
 *    paragraph) shall be included in all copies or substantial portions of the
 *    Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 *    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *    DEALINGS IN THE SOFTWARE.
 *
 */

import { Connection, WlMessage, uint, int, object, objectOptional, newObject, string, u, i, a } from '@gfld/common'
import * as Westfield from '.'
import { Proxy, Display } from '../westfield-runtime-client'

export interface XdgWmBaseEvents {
  /**
   *
   *	The ping event asks the client if it's still alive. Pass the
   *	serial specified in the event back to the compositor by sending
   *	a "pong" request back with the specified serial. See xdg_wm_base.ping.
   *
   *	Compositors can use this to determine if the client is still
   *	alive. It's unspecified what will happen if the client doesn't
   *	respond to the ping request, or in what timeframe. Clients should
   *	try to respond in a reasonable amount of time.
   *
   *	A compositor is free to ping in any way it wants, but a client must
   *	always respond to any xdg_wm_base object it created.
   *
   *
   * @since 1
   *
   */
  ping(serial: number): void
}

/**
 *
 *      The xdg_wm_base interface is exposed as a global object enabling clients
 *      to turn their wl_surfaces into windows in a desktop environment. It
 *      defines the basic functionality needed for clients and the compositor to
 *      create windows that can be dragged, resized, maximized, etc, as well as
 *      creating transient windows such as popup menus.
 *
 */
export class XdgWmBaseProxy extends Proxy {
  listener?: XdgWmBaseEvents
  /**
   * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
   */
  constructor(display: Display, connection: Connection, id: number) {
    super(display, connection, id)
  }

  /**
   *
   *	Destroy this xdg_wm_base object.
   *
   *	Destroying a bound xdg_wm_base object while there are surfaces
   *	still alive created by this xdg_wm_base object instance is illegal
   *	and will result in a protocol error.
   *
   * @since 1
   *
   */
  destroy(): void {
    super.destroy()
    this.marshall(this.id, 0, [])
  }

  /**
   *
   *	Create a positioner object. A positioner object is used to position
   *	surfaces relative to some parent surface. See the interface description
   *	and xdg_surface.get_popup for details.
   *
   * @since 1
   *
   */
  createPositioner(): Westfield.XdgPositionerProxy {
    return this.marshallConstructor(this.id, 1, Westfield.XdgPositionerProxy, [newObject()])
  }

  /**
   *
   *	This creates an xdg_surface for the given surface. While xdg_surface
   *	itself is not a role, the corresponding surface may only be assigned
   *	a role extending xdg_surface, such as xdg_toplevel or xdg_popup.
   *
   *	This creates an xdg_surface for the given surface. An xdg_surface is
   *	used as basis to define a role to a given surface, such as xdg_toplevel
   *	or xdg_popup. It also manages functionality shared between xdg_surface
   *	based surface roles.
   *
   *	See the documentation of xdg_surface for more details about what an
   *	xdg_surface is and how it is used.
   *
   * @since 1
   *
   */
  getXdgSurface(surface: Westfield.WlSurfaceProxy): Westfield.XdgSurfaceProxy {
    return this.marshallConstructor(this.id, 2, Westfield.XdgSurfaceProxy, [newObject(), object(surface)])
  }

  /**
   *
   *	A client must respond to a ping event with a pong request or
   *	the client may be deemed unresponsive. See xdg_wm_base.ping.
   *
   * @since 1
   *
   */
  pong(serial: number): void {
    this.marshall(this.id, 3, [uint(serial)])
  }
  async [0](message: WlMessage) {
    await this.listener?.ping(u(message))
  }
}
export const XdgWmBaseProtocolName = 'xdg_wm_base'

export enum XdgWmBaseError {
  /**
   * given wl_surface has another role
   */
  _role = 0,
  /**
   * xdg_wm_base was destroyed before children
   */
  _defunctSurfaces = 1,
  /**
   * the client tried to map or destroy a non-topmost popup
   */
  _notTheTopmostPopup = 2,
  /**
   * the client specified an invalid popup parent surface
   */
  _invalidPopupParent = 3,
  /**
   * the client provided an invalid surface state
   */
  _invalidSurfaceState = 4,
  /**
   * the client provided an invalid positioner
   */
  _invalidPositioner = 5,
}

/**
 *
 *      The xdg_positioner provides a collection of rules for the placement of a
 *      child surface relative to a parent surface. Rules can be defined to ensure
 *      the child surface remains within the visible area's borders, and to
 *      specify how the child surface changes its position, such as sliding along
 *      an axis, or flipping around a rectangle. These positioner-created rules are
 *      constrained by the requirement that a child surface must intersect with or
 *      be at least partially adjacent to its parent surface.
 *
 *      See the various requests for details about possible rules.
 *
 *      At the time of the request, the compositor makes a copy of the rules
 *      specified by the xdg_positioner. Thus, after the request is complete the
 *      xdg_positioner object can be destroyed or reused; further changes to the
 *      object will have no effect on previous usages.
 *
 *      For an xdg_positioner object to be considered complete, it must have a
 *      non-zero size set by set_size, and a non-zero anchor rectangle set by
 *      set_anchor_rect. Passing an incomplete xdg_positioner object when
 *      positioning a surface raises an error.
 *
 */
export class XdgPositionerProxy extends Proxy {
  /**
   * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
   */
  constructor(display: Display, connection: Connection, id: number) {
    super(display, connection, id)
  }

  /**
   *
   *	Notify the compositor that the xdg_positioner will no longer be used.
   *
   * @since 1
   *
   */
  destroy(): void {
    super.destroy()
    this.marshall(this.id, 0, [])
  }

  /**
   *
   *	Set the size of the surface that is to be positioned with the positioner
   *	object. The size is in surface-local coordinates and corresponds to the
   *	window geometry. See xdg_surface.set_window_geometry.
   *
   *	If a zero or negative size is set the invalid_input error is raised.
   *
   * @since 1
   *
   */
  setSize(width: number, height: number): void {
    this.marshall(this.id, 1, [int(width), int(height)])
  }

  /**
   *
   *	Specify the anchor rectangle within the parent surface that the child
   *	surface will be placed relative to. The rectangle is relative to the
   *	window geometry as defined by xdg_surface.set_window_geometry of the
   *	parent surface.
   *
   *	When the xdg_positioner object is used to position a child surface, the
   *	anchor rectangle may not extend outside the window geometry of the
   *	positioned child's parent surface.
   *
   *	If a negative size is set the invalid_input error is raised.
   *
   * @since 1
   *
   */
  setAnchorRect(x: number, y: number, width: number, height: number): void {
    this.marshall(this.id, 2, [int(x), int(y), int(width), int(height)])
  }

  /**
   *
   *	Defines the anchor point for the anchor rectangle. The specified anchor
   *	is used derive an anchor point that the child surface will be
   *	positioned relative to. If a corner anchor is set (e.g. 'top_left' or
   *	'bottom_right'), the anchor point will be at the specified corner;
   *	otherwise, the derived anchor point will be centered on the specified
   *	edge, or in the center of the anchor rectangle if no edge is specified.
   *
   * @since 1
   *
   */
  setAnchor(anchor: number): void {
    this.marshall(this.id, 3, [uint(anchor)])
  }

  /**
   *
   *	Defines in what direction a surface should be positioned, relative to
   *	the anchor point of the parent surface. If a corner gravity is
   *	specified (e.g. 'bottom_right' or 'top_left'), then the child surface
   *	will be placed towards the specified gravity; otherwise, the child
   *	surface will be centered over the anchor point on any axis that had no
   *	gravity specified.
   *
   * @since 1
   *
   */
  setGravity(gravity: number): void {
    this.marshall(this.id, 4, [uint(gravity)])
  }

  /**
   *
   *	Specify how the window should be positioned if the originally intended
   *	position caused the surface to be constrained, meaning at least
   *	partially outside positioning boundaries set by the compositor. The
   *	adjustment is set by constructing a bitmask describing the adjustment to
   *	be made when the surface is constrained on that axis.
   *
   *	If no bit for one axis is set, the compositor will assume that the child
   *	surface should not change its position on that axis when constrained.
   *
   *	If more than one bit for one axis is set, the order of how adjustments
   *	are applied is specified in the corresponding adjustment descriptions.
   *
   *	The default adjustment is none.
   *
   * @since 1
   *
   */
  setConstraintAdjustment(constraintAdjustment: number): void {
    this.marshall(this.id, 5, [uint(constraintAdjustment)])
  }

  /**
   *
   *	Specify the surface position offset relative to the position of the
   *	anchor on the anchor rectangle and the anchor on the surface. For
   *	example if the anchor of the anchor rectangle is at (x, y), the surface
   *	has the gravity bottom|right, and the offset is (ox, oy), the calculated
   *	surface position will be (x + ox, y + oy). The offset position of the
   *	surface is the one used for constraint testing. See
   *	set_constraint_adjustment.
   *
   *	An example use case is placing a popup menu on top of a user interface
   *	element, while aligning the user interface element of the parent surface
   *	with some user interface element placed somewhere in the popup surface.
   *
   * @since 1
   *
   */
  setOffset(x: number, y: number): void {
    this.marshall(this.id, 6, [int(x), int(y)])
  }
}
export const XdgPositionerProtocolName = 'xdg_positioner'

export enum XdgPositionerError {
  /**
   * invalid input provided
   */
  _invalidInput = 0,
}

export enum XdgPositionerAnchor {
  /**
   *
   */
  _none = 0,
  /**
   *
   */
  _top = 1,
  /**
   *
   */
  _bottom = 2,
  /**
   *
   */
  _left = 3,
  /**
   *
   */
  _right = 4,
  /**
   *
   */
  _topLeft = 5,
  /**
   *
   */
  _bottomLeft = 6,
  /**
   *
   */
  _topRight = 7,
  /**
   *
   */
  _bottomRight = 8,
}

export enum XdgPositionerGravity {
  /**
   *
   */
  _none = 0,
  /**
   *
   */
  _top = 1,
  /**
   *
   */
  _bottom = 2,
  /**
   *
   */
  _left = 3,
  /**
   *
   */
  _right = 4,
  /**
   *
   */
  _topLeft = 5,
  /**
   *
   */
  _bottomLeft = 6,
  /**
   *
   */
  _topRight = 7,
  /**
   *
   */
  _bottomRight = 8,
}

export enum XdgPositionerConstraintAdjustment {
  /**
   *
   */
  _none = 0,
  /**
   *
   */
  _slideX = 1,
  /**
   *
   */
  _slideY = 2,
  /**
   *
   */
  _flipX = 4,
  /**
   *
   */
  _flipY = 8,
  /**
   *
   */
  _resizeX = 16,
  /**
   *
   */
  _resizeY = 32,
}

export interface XdgSurfaceEvents {
  /**
   *
   *	The configure event marks the end of a configure sequence. A configure
   *	sequence is a set of one or more events configuring the state of the
   *	xdg_surface, including the final xdg_surface.configure event.
   *
   *	Where applicable, xdg_surface surface roles will during a configure
   *	sequence extend this event as a latched state sent as events before the
   *	xdg_surface.configure event. Such events should be considered to make up
   *	a set of atomically applied configuration states, where the
   *	xdg_surface.configure commits the accumulated state.
   *
   *	Clients should arrange their surface for the new states, and then send
   *	an ack_configure request with the serial sent in this configure event at
   *	some point before committing the new surface.
   *
   *	If the client receives multiple configure events before it can respond
   *	to one, it is free to discard all but the last event it received.
   *
   *
   * @since 1
   *
   */
  configure(serial: number): void
}

/**
 *
 *      An interface that may be implemented by a wl_surface, for
 *      implementations that provide a desktop-style user interface.
 *
 *      It provides a base set of functionality required to construct user
 *      interface elements requiring management by the compositor, such as
 *      toplevel windows, menus, etc. The types of functionality are split into
 *      xdg_surface roles.
 *
 *      Creating an xdg_surface does not set the role for a wl_surface. In order
 *      to map an xdg_surface, the client must create a role-specific object
 *      using, e.g., get_toplevel, get_popup. The wl_surface for any given
 *      xdg_surface can have at most one role, and may not be assigned any role
 *      not based on xdg_surface.
 *
 *      A role must be assigned before any other requests are made to the
 *      xdg_surface object.
 *
 *      The client must call wl_surface.commit on the corresponding wl_surface
 *      for the xdg_surface state to take effect.
 *
 *      Creating an xdg_surface from a wl_surface which has a buffer attached or
 *      committed is a client error, and any attempts by a client to attach or
 *      manipulate a buffer prior to the first xdg_surface.configure call must
 *      also be treated as errors.
 *
 *      Mapping an xdg_surface-based role surface is defined as making it
 *      possible for the surface to be shown by the compositor. Note that
 *      a mapped surface is not guaranteed to be visible once it is mapped.
 *
 *      For an xdg_surface to be mapped by the compositor, the following
 *      conditions must be met:
 *      (1) the client has assigned an xdg_surface-based role to the surface
 *      (2) the client has set and committed the xdg_surface state and the
 *	  role-dependent state to the surface
 *      (3) the client has committed a buffer to the surface
 *
 *      A newly-unmapped surface is considered to have met condition (1) out
 *      of the 3 required conditions for mapping a surface if its role surface
 *      has not been destroyed.
 *
 */
export class XdgSurfaceProxy extends Proxy {
  listener?: XdgSurfaceEvents
  /**
   * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
   */
  constructor(display: Display, connection: Connection, id: number) {
    super(display, connection, id)
  }

  /**
   *
   *	Destroy the xdg_surface object. An xdg_surface must only be destroyed
   *	after its role object has been destroyed.
   *
   * @since 1
   *
   */
  destroy(): void {
    super.destroy()
    this.marshall(this.id, 0, [])
  }

  /**
   *
   *	This creates an xdg_toplevel object for the given xdg_surface and gives
   *	the associated wl_surface the xdg_toplevel role.
   *
   *	See the documentation of xdg_toplevel for more details about what an
   *	xdg_toplevel is and how it is used.
   *
   * @since 1
   *
   */
  getToplevel(): Westfield.XdgToplevelProxy {
    return this.marshallConstructor(this.id, 1, Westfield.XdgToplevelProxy, [newObject()])
  }

  /**
   *
   *	This creates an xdg_popup object for the given xdg_surface and gives
   *	the associated wl_surface the xdg_popup role.
   *
   *	If null is passed as a parent, a parent surface must be specified using
   *	some other protocol, before committing the initial state.
   *
   *	See the documentation of xdg_popup for more details about what an
   *	xdg_popup is and how it is used.
   *
   * @since 1
   *
   */
  getPopup(
    parent: Westfield.XdgSurfaceProxy | undefined,
    positioner: Westfield.XdgPositionerProxy,
  ): Westfield.XdgPopupProxy {
    return this.marshallConstructor(this.id, 2, Westfield.XdgPopupProxy, [
      newObject(),
      objectOptional(parent),
      object(positioner),
    ])
  }

  /**
   *
   *	The window geometry of a surface is its "visible bounds" from the
   *	user's perspective. Client-side decorations often have invisible
   *	portions like drop-shadows which should be ignored for the
   *	purposes of aligning, placing and constraining windows.
   *
   *	The window geometry is double buffered, and will be applied at the
   *	time wl_surface.commit of the corresponding wl_surface is called.
   *
   *	When maintaining a position, the compositor should treat the (x, y)
   *	coordinate of the window geometry as the top left corner of the window.
   *	A client changing the (x, y) window geometry coordinate should in
   *	general not alter the position of the window.
   *
   *	Once the window geometry of the surface is set, it is not possible to
   *	unset it, and it will remain the same until set_window_geometry is
   *	called again, even if a new subsurface or buffer is attached.
   *
   *	If never set, the value is the full bounds of the surface,
   *	including any subsurfaces. This updates dynamically on every
   *	commit. This unset is meant for extremely simple clients.
   *
   *	The arguments are given in the surface-local coordinate space of
   *	the wl_surface associated with this xdg_surface.
   *
   *	The width and height must be greater than zero. Setting an invalid size
   *	will raise an error. When applied, the effective window geometry will be
   *	the set window geometry clamped to the bounding rectangle of the
   *	combined geometry of the surface of the xdg_surface and the associated
   *	subsurfaces.
   *
   * @since 1
   *
   */
  setWindowGeometry(x: number, y: number, width: number, height: number): void {
    this.marshall(this.id, 3, [int(x), int(y), int(width), int(height)])
  }

  /**
   *
   *	When a configure event is received, if a client commits the
   *	surface in response to the configure event, then the client
   *	must make an ack_configure request sometime before the commit
   *	request, passing along the serial of the configure event.
   *
   *	For instance, for toplevel surfaces the compositor might use this
   *	information to move a surface to the top left only when the client has
   *	drawn itself for the maximized or fullscreen state.
   *
   *	If the client receives multiple configure events before it
   *	can respond to one, it only has to ack the last configure event.
   *
   *	A client is not required to commit immediately after sending
   *	an ack_configure request - it may even ack_configure several times
   *	before its next surface commit.
   *
   *	A client may send multiple ack_configure requests before committing, but
   *	only the last request sent before a commit indicates which configure
   *	event the client really is responding to.
   *
   * @since 1
   *
   */
  ackConfigure(serial: number): void {
    this.marshall(this.id, 4, [uint(serial)])
  }
  async [0](message: WlMessage) {
    await this.listener?.configure(u(message))
  }
}
export const XdgSurfaceProtocolName = 'xdg_surface'

export enum XdgSurfaceError {
  /**
   *
   */
  _notConstructed = 1,
  /**
   *
   */
  _alreadyConstructed = 2,
  /**
   *
   */
  _unconfiguredBuffer = 3,
}

export interface XdgToplevelEvents {
  /**
   *
   *	This configure event asks the client to resize its toplevel surface or
   *	to change its state. The configured state should not be applied
   *	immediately. See xdg_surface.configure for details.
   *
   *	The width and height arguments specify a hint to the window
   *	about how its surface should be resized in window geometry
   *	coordinates. See set_window_geometry.
   *
   *	If the width or height arguments are zero, it means the client
   *	should decide its own window dimension. This may happen when the
   *	compositor needs to configure the state of the surface but doesn't
   *	have any information about any previous or expected dimension.
   *
   *	The states listed in the event specify how the width/height
   *	arguments should be interpreted, and possibly how it should be
   *	drawn.
   *
   *	Clients must send an ack_configure in response to this event. See
   *	xdg_surface.configure and xdg_surface.ack_configure for details.
   *
   *
   * @since 1
   *
   */
  configure(width: number, height: number, states: ArrayBuffer): void

  /**
   *
   *	The close event is sent by the compositor when the user
   *	wants the surface to be closed. This should be equivalent to
   *	the user clicking the close button in client-side decorations,
   *	if your application has any.
   *
   *	This is only a request that the user intends to close the
   *	window. The client may choose to ignore this request, or show
   *	a dialog to ask the user to save their data, etc.
   *
   *
   * @since 1
   *
   */
  close(): void
}

/**
 *
 *      This interface defines an xdg_surface role which allows a surface to,
 *      among other things, set window-like properties such as maximize,
 *      fullscreen, and minimize, set application-specific metadata like title and
 *      id, and well as trigger user interactive operations such as interactive
 *      resize and move.
 *
 *      Unmapping an xdg_toplevel means that the surface cannot be shown
 *      by the compositor until it is explicitly mapped again.
 *      All active operations (e.g., move, resize) are canceled and all
 *      attributes (e.g. title, state, stacking, ...) are discarded for
 *      an xdg_toplevel surface when it is unmapped.
 *
 *      Attaching a null buffer to a toplevel unmaps the surface.
 *
 */
export class XdgToplevelProxy extends Proxy {
  listener?: XdgToplevelEvents
  /**
   * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
   */
  constructor(display: Display, connection: Connection, id: number) {
    super(display, connection, id)
  }

  /**
   *
   *	This request destroys the role surface and unmaps the surface;
   *	see "Unmapping" behavior in interface section for details.
   *
   * @since 1
   *
   */
  destroy(): void {
    super.destroy()
    this.marshall(this.id, 0, [])
  }

  /**
   *
   *	Set the "parent" of this surface. This surface should be stacked
   *	above the parent surface and all other ancestor surfaces.
   *
   *	Parent windows should be set on dialogs, toolboxes, or other
   *	"auxiliary" surfaces, so that the parent is raised when the dialog
   *	is raised.
   *
   *	Setting a null parent for a child window removes any parent-child
   *	relationship for the child. Setting a null parent for a window which
   *	currently has no parent is a no-op.
   *
   *	If the parent is unmapped then its children are managed as
   *	though the parent of the now-unmapped parent has become the
   *	parent of this surface. If no parent exists for the now-unmapped
   *	parent then the children are managed as though they have no
   *	parent surface.
   *
   * @since 1
   *
   */
  setParent(parent: Westfield.XdgToplevelProxy | undefined): void {
    this.marshall(this.id, 1, [objectOptional(parent)])
  }

  /**
   *
   *	Set a short title for the surface.
   *
   *	This string may be used to identify the surface in a task bar,
   *	window list, or other user interface elements provided by the
   *	compositor.
   *
   *	The string must be encoded in UTF-8.
   *
   * @since 1
   *
   */
  setTitle(title: string): void {
    this.marshall(this.id, 2, [string(title)])
  }

  /**
   *
   *	Set an application identifier for the surface.
   *
   *	The app ID identifies the general class of applications to which
   *	the surface belongs. The compositor can use this to group multiple
   *	surfaces together, or to determine how to launch a new application.
   *
   *	For D-Bus activatable applications, the app ID is used as the D-Bus
   *	service name.
   *
   *	The compositor shell will try to group application surfaces together
   *	by their app ID. As a best practice, it is suggested to select app
   *	ID's that match the basename of the application's .desktop file.
   *	For example, "org.freedesktop.FooViewer" where the .desktop file is
   *	"org.freedesktop.FooViewer.desktop".
   *
   *	See the desktop-entry specification [0] for more details on
   *	application identifiers and how they relate to well-known D-Bus
   *	names and .desktop files.
   *
   *	[0] http://standards.freedesktop.org/desktop-entry-spec/
   *
   * @since 1
   *
   */
  setAppId(appId: string): void {
    this.marshall(this.id, 3, [string(appId)])
  }

  /**
   *
   *	Clients implementing client-side decorations might want to show
   *	a context menu when right-clicking on the decorations, giving the
   *	user a menu that they can use to maximize or minimize the window.
   *
   *	This request asks the compositor to pop up such a window menu at
   *	the given position, relative to the local surface coordinates of
   *	the parent surface. There are no guarantees as to what menu items
   *	the window menu contains.
   *
   *	This request must be used in response to some sort of user action
   *	like a button press, key press, or touch down event.
   *
   * @since 1
   *
   */
  showWindowMenu(seat: Westfield.WlSeatProxy, serial: number, x: number, y: number): void {
    this.marshall(this.id, 4, [object(seat), uint(serial), int(x), int(y)])
  }

  /**
   *
   *	Start an interactive, user-driven move of the surface.
   *
   *	This request must be used in response to some sort of user action
   *	like a button press, key press, or touch down event. The passed
   *	serial is used to determine the type of interactive move (touch,
   *	pointer, etc).
   *
   *	The server may ignore move requests depending on the state of
   *	the surface (e.g. fullscreen or maximized), or if the passed serial
   *	is no longer valid.
   *
   *	If triggered, the surface will lose the focus of the device
   *	(wl_pointer, wl_touch, etc) used for the move. It is up to the
   *	compositor to visually indicate that the move is taking place, such as
   *	updating a pointer cursor, during the move. There is no guarantee
   *	that the device focus will return when the move is completed.
   *
   * @since 1
   *
   */
  move(seat: Westfield.WlSeatProxy, serial: number): void {
    this.marshall(this.id, 5, [object(seat), uint(serial)])
  }

  /**
   *
   *	Start a user-driven, interactive resize of the surface.
   *
   *	This request must be used in response to some sort of user action
   *	like a button press, key press, or touch down event. The passed
   *	serial is used to determine the type of interactive resize (touch,
   *	pointer, etc).
   *
   *	The server may ignore resize requests depending on the state of
   *	the surface (e.g. fullscreen or maximized).
   *
   *	If triggered, the client will receive configure events with the
   *	"resize" state enum value and the expected sizes. See the "resize"
   *	enum value for more details about what is required. The client
   *	must also acknowledge configure events using "ack_configure". After
   *	the resize is completed, the client will receive another "configure"
   *	event without the resize state.
   *
   *	If triggered, the surface also will lose the focus of the device
   *	(wl_pointer, wl_touch, etc) used for the resize. It is up to the
   *	compositor to visually indicate that the resize is taking place,
   *	such as updating a pointer cursor, during the resize. There is no
   *	guarantee that the device focus will return when the resize is
   *	completed.
   *
   *	The edges parameter specifies how the surface should be resized,
   *	and is one of the values of the resize_edge enum. The compositor
   *	may use this information to update the surface position for
   *	example when dragging the top left corner. The compositor may also
   *	use this information to adapt its behavior, e.g. choose an
   *	appropriate cursor image.
   *
   * @since 1
   *
   */
  resize(seat: Westfield.WlSeatProxy, serial: number, edges: number): void {
    this.marshall(this.id, 6, [object(seat), uint(serial), uint(edges)])
  }

  /**
   *
   *	Set a maximum size for the window.
   *
   *	The client can specify a maximum size so that the compositor does
   *	not try to configure the window beyond this size.
   *
   *	The width and height arguments are in window geometry coordinates.
   *	See xdg_surface.set_window_geometry.
   *
   *	Values set in this way are double-buffered. They will get applied
   *	on the next commit.
   *
   *	The compositor can use this information to allow or disallow
   *	different states like maximize or fullscreen and draw accurate
   *	animations.
   *
   *	Similarly, a tiling window manager may use this information to
   *	place and resize client windows in a more effective way.
   *
   *	The client should not rely on the compositor to obey the maximum
   *	size. The compositor may decide to ignore the values set by the
   *	client and request a larger size.
   *
   *	If never set, or a value of zero in the request, means that the
   *	client has no expected maximum size in the given dimension.
   *	As a result, a client wishing to reset the maximum size
   *	to an unspecified state can use zero for width and height in the
   *	request.
   *
   *	Requesting a maximum size to be smaller than the minimum size of
   *	a surface is illegal and will result in a protocol error.
   *
   *	The width and height must be greater than or equal to zero. Using
   *	strictly negative values for width and height will result in a
   *	protocol error.
   *
   * @since 1
   *
   */
  setMaxSize(width: number, height: number): void {
    this.marshall(this.id, 7, [int(width), int(height)])
  }

  /**
   *
   *	Set a minimum size for the window.
   *
   *	The client can specify a minimum size so that the compositor does
   *	not try to configure the window below this size.
   *
   *	The width and height arguments are in window geometry coordinates.
   *	See xdg_surface.set_window_geometry.
   *
   *	Values set in this way are double-buffered. They will get applied
   *	on the next commit.
   *
   *	The compositor can use this information to allow or disallow
   *	different states like maximize or fullscreen and draw accurate
   *	animations.
   *
   *	Similarly, a tiling window manager may use this information to
   *	place and resize client windows in a more effective way.
   *
   *	The client should not rely on the compositor to obey the minimum
   *	size. The compositor may decide to ignore the values set by the
   *	client and request a smaller size.
   *
   *	If never set, or a value of zero in the request, means that the
   *	client has no expected minimum size in the given dimension.
   *	As a result, a client wishing to reset the minimum size
   *	to an unspecified state can use zero for width and height in the
   *	request.
   *
   *	Requesting a minimum size to be larger than the maximum size of
   *	a surface is illegal and will result in a protocol error.
   *
   *	The width and height must be greater than or equal to zero. Using
   *	strictly negative values for width and height will result in a
   *	protocol error.
   *
   * @since 1
   *
   */
  setMinSize(width: number, height: number): void {
    this.marshall(this.id, 8, [int(width), int(height)])
  }

  /**
   *
   *	Maximize the surface.
   *
   *	After requesting that the surface should be maximized, the compositor
   *	will respond by emitting a configure event with the "maximized" state
   *	and the required window geometry. The client should then update its
   *	content, drawing it in a maximized state, i.e. without shadow or other
   *	decoration outside of the window geometry. The client must also
   *	acknowledge the configure when committing the new content (see
   *	ack_configure).
   *
   *	It is up to the compositor to decide how and where to maximize the
   *	surface, for example which output and what region of the screen should
   *	be used.
   *
   *	If the surface was already maximized, the compositor will still emit
   *	a configure event with the "maximized" state.
   *
   *	If the surface is in a fullscreen state, this request has no direct
   *	effect. It will alter the state the surface is returned to when
   *	unmaximized if not overridden by the compositor.
   *
   * @since 1
   *
   */
  setMaximized(): void {
    this.marshall(this.id, 9, [])
  }

  /**
   *
   *	Unmaximize the surface.
   *
   *	After requesting that the surface should be unmaximized, the compositor
   *	will respond by emitting a configure event without the "maximized"
   *	state. If available, the compositor will include the window geometry
   *	dimensions the window had prior to being maximized in the configure
   *	event. The client must then update its content, drawing it in a
   *	regular state, i.e. potentially with shadow, etc. The client must also
   *	acknowledge the configure when committing the new content (see
   *	ack_configure).
   *
   *	It is up to the compositor to position the surface after it was
   *	unmaximized; usually the position the surface had before maximizing, if
   *	applicable.
   *
   *	If the surface was already not maximized, the compositor will still
   *	emit a configure event without the "maximized" state.
   *
   *	If the surface is in a fullscreen state, this request has no direct
   *	effect. It will alter the state the surface is returned to when
   *	unmaximized if not overridden by the compositor.
   *
   * @since 1
   *
   */
  unsetMaximized(): void {
    this.marshall(this.id, 10, [])
  }

  /**
   *
   *	Make the surface fullscreen.
   *
   *	After requesting that the surface should be fullscreened, the
   *	compositor will respond by emitting a configure event with the
   *	"fullscreen" state and the fullscreen window geometry. The client must
   *	also acknowledge the configure when committing the new content (see
   *	ack_configure).
   *
   *	The output passed by the request indicates the client's preference as
   *	to which display it should be set fullscreen on. If this value is NULL,
   *	it's up to the compositor to choose which display will be used to map
   *	this surface.
   *
   *	If the surface doesn't cover the whole output, the compositor will
   *	position the surface in the center of the output and compensate with
   *	with border fill covering the rest of the output. The content of the
   *	border fill is undefined, but should be assumed to be in some way that
   *	attempts to blend into the surrounding area (e.g. solid black).
   *
   *	If the fullscreened surface is not opaque, the compositor must make
   *	sure that other screen content not part of the same surface tree (made
   *	up of subsurfaces, popups or similarly coupled surfaces) are not
   *	visible below the fullscreened surface.
   *
   * @since 1
   *
   */
  setFullscreen(output: Westfield.WlOutputProxy | undefined): void {
    this.marshall(this.id, 11, [objectOptional(output)])
  }

  /**
   *
   *	Make the surface no longer fullscreen.
   *
   *	After requesting that the surface should be unfullscreened, the
   *	compositor will respond by emitting a configure event without the
   *	"fullscreen" state.
   *
   *	Making a surface unfullscreen sets states for the surface based on the following:
   *	* the state(s) it may have had before becoming fullscreen
   *	* any state(s) decided by the compositor
   *	* any state(s) requested by the client while the surface was fullscreen
   *
   *	The compositor may include the previous window geometry dimensions in
   *	the configure event, if applicable.
   *
   *	The client must also acknowledge the configure when committing the new
   *	content (see ack_configure).
   *
   * @since 1
   *
   */
  unsetFullscreen(): void {
    this.marshall(this.id, 12, [])
  }

  /**
   *
   *	Request that the compositor minimize your surface. There is no
   *	way to know if the surface is currently minimized, nor is there
   *	any way to unset minimization on this surface.
   *
   *	If you are looking to throttle redrawing when minimized, please
   *	instead use the wl_surface.frame event for this, as this will
   *	also work with live previews on windows in Alt-Tab, Expose or
   *	similar compositor features.
   *
   * @since 1
   *
   */
  setMinimized(): void {
    this.marshall(this.id, 13, [])
  }
  async [0](message: WlMessage) {
    await this.listener?.configure(i(message), i(message), a(message))
  }

  async [1](_message: WlMessage) {
    await this.listener?.close()
  }
}
export const XdgToplevelProtocolName = 'xdg_toplevel'

export enum XdgToplevelResizeEdge {
  /**
   *
   */
  _none = 0,
  /**
   *
   */
  _top = 1,
  /**
   *
   */
  _bottom = 2,
  /**
   *
   */
  _left = 4,
  /**
   *
   */
  _topLeft = 5,
  /**
   *
   */
  _bottomLeft = 6,
  /**
   *
   */
  _right = 8,
  /**
   *
   */
  _topRight = 9,
  /**
   *
   */
  _bottomRight = 10,
}

export enum XdgToplevelState {
  /**
   * the surface is maximized
   */
  _maximized = 1,
  /**
   * the surface is fullscreen
   */
  _fullscreen = 2,
  /**
   * the surface is being resized
   */
  _resizing = 3,
  /**
   * the surface is now activated
   */
  _activated = 4,
}

export interface XdgPopupEvents {
  /**
   *
   *	This event asks the popup surface to configure itself given the
   *	configuration. The configured state should not be applied immediately.
   *	See xdg_surface.configure for details.
   *
   *	The x and y arguments represent the position the popup was placed at
   *	given the xdg_positioner rule, relative to the upper left corner of the
   *	window geometry of the parent surface.
   *
   *
   * @since 1
   *
   */
  configure(x: number, y: number, width: number, height: number): void

  /**
   *
   *	The popup_done event is sent out when a popup is dismissed by the
   *	compositor. The client should destroy the xdg_popup object at this
   *	point.
   *
   *
   * @since 1
   *
   */
  popupDone(): void
}

/**
 *
 *      A popup surface is a short-lived, temporary surface. It can be used to
 *      implement for example menus, popovers, tooltips and other similar user
 *      interface concepts.
 *
 *      A popup can be made to take an explicit grab. See xdg_popup.grab for
 *      details.
 *
 *      When the popup is dismissed, a popup_done event will be sent out, and at
 *      the same time the surface will be unmapped. See the xdg_popup.popup_done
 *      event for details.
 *
 *      Explicitly destroying the xdg_popup object will also dismiss the popup and
 *      unmap the surface. Clients that want to dismiss the popup when another
 *      surface of their own is clicked should dismiss the popup using the destroy
 *      request.
 *
 *      The parent surface must have either the xdg_toplevel or xdg_popup surface
 *      role.
 *
 *      A newly created xdg_popup will be stacked on top of all previously created
 *      xdg_popup surfaces associated with the same xdg_toplevel.
 *
 *      The parent of an xdg_popup must be mapped (see the xdg_surface
 *      description) before the xdg_popup itself.
 *
 *      The x and y arguments passed when creating the popup object specify
 *      where the top left of the popup should be placed, relative to the
 *      local surface coordinates of the parent surface. See
 *      xdg_surface.get_popup. An xdg_popup must intersect with or be at least
 *      partially adjacent to its parent surface.
 *
 *      The client must call wl_surface.commit on the corresponding wl_surface
 *      for the xdg_popup state to take effect.
 *
 */
export class XdgPopupProxy extends Proxy {
  listener?: XdgPopupEvents
  /**
   * Do not construct proxies directly. Instead use one of the factory methods from other proxies.
   */
  constructor(display: Display, connection: Connection, id: number) {
    super(display, connection, id)
  }

  /**
   *
   *	This destroys the popup. Explicitly destroying the xdg_popup
   *	object will also dismiss the popup, and unmap the surface.
   *
   *	If this xdg_popup is not the "topmost" popup, a protocol error
   *	will be sent.
   *
   * @since 1
   *
   */
  destroy(): void {
    super.destroy()
    this.marshall(this.id, 0, [])
  }

  /**
   *
   *	This request makes the created popup take an explicit grab. An explicit
   *	grab will be dismissed when the user dismisses the popup, or when the
   *	client destroys the xdg_popup. This can be done by the user clicking
   *	outside the surface, using the keyboard, or even locking the screen
   *	through closing the lid or a timeout.
   *
   *	If the compositor denies the grab, the popup will be immediately
   *	dismissed.
   *
   *	This request must be used in response to some sort of user action like a
   *	button press, key press, or touch down event. The serial number of the
   *	event should be passed as 'serial'.
   *
   *	The parent of a grabbing popup must either be an xdg_toplevel surface or
   *	another xdg_popup with an explicit grab. If the parent is another
   *	xdg_popup it means that the popups are nested, with this popup now being
   *	the topmost popup.
   *
   *	Nested popups must be destroyed in the reverse order they were created
   *	in, e.g. the only popup you are allowed to destroy at all times is the
   *	topmost one.
   *
   *	When compositors choose to dismiss a popup, they may dismiss every
   *	nested grabbing popup as well. When a compositor dismisses popups, it
   *	will follow the same dismissing order as required from the client.
   *
   *	The parent of a grabbing popup must either be another xdg_popup with an
   *	active explicit grab, or an xdg_popup or xdg_toplevel, if there are no
   *	explicit grabs already taken.
   *
   *	If the topmost grabbing popup is destroyed, the grab will be returned to
   *	the parent of the popup, if that parent previously had an explicit grab.
   *
   *	If the parent is a grabbing popup which has already been dismissed, this
   *	popup will be immediately dismissed. If the parent is a popup that did
   *	not take an explicit grab, an error will be raised.
   *
   *	During a popup grab, the client owning the grab will receive pointer
   *	and touch events for all their surfaces as normal (similar to an
   *	"owner-events" grab in X11 parlance), while the top most grabbing popup
   *	will always have keyboard focus.
   *
   * @since 1
   *
   */
  grab(seat: Westfield.WlSeatProxy, serial: number): void {
    this.marshall(this.id, 1, [object(seat), uint(serial)])
  }
  async [0](message: WlMessage) {
    await this.listener?.configure(i(message), i(message), i(message), i(message))
  }

  async [1](message: WlMessage) {
    await this.listener?.popupDone()
  }
}
export const XdgPopupProtocolName = 'xdg_popup'

export enum XdgPopupError {
  /**
   * tried to grab after being mapped
   */
  _invalidGrab = 0,
}
