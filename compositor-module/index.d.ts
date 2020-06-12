// Type definitions for greenfield-compositor 0.0.1
// Project: Greenfield
// Definitions by: Erik De Rijcke

export interface Session {
    userShell: UserShellApi
    globals: Globals
}

export interface SessionClass {
    create(): Session
}

// export interface CompositorSurfaceState {
//     title?: string
//     appId?: string
//     mapped?: boolean
//     active?: boolean
//     unresponsive?: boolean
//     minimized?: boolean
//     key?: string
//     lastActive?: number
//     type?: 'remote' | 'local'
// }

// export interface CompositorClient {
//     variant: 'web' | 'remote'
//     id: string
// }

// export interface CompositorSurface {
//     id: string
//     clientId: string
// }

// export type nrmlvo = {
//     name: string
//     rules: string
//     model: string
//     layout: string
//     variant: string
//     options: string
// }

export interface Keyboard {
    defaultNrmlvo: nrmlvo
    nrmlvoEntries: nrmlvo[]
}

export interface Seat {
    keyboard: Keyboard
}

export interface Globals {
    register(): void

    unregister(): void

    seat: Seat
}

// export interface ApplicationClient {
//     id: string
//     variant: 'web' | 'remote'
// }

// export interface UserSeatState {
//     pointerGrab: CompositorSurface
//     keyboardFocus: CompositorSurface
// }

// export interface UserConfiguration {
//     scrollFactor: number
//     keyboardLayoutName?: string
// }

// export interface UserShellApiEvents {
//     createApplicationClient(applicationClient: ApplicationClient): void
//
//     destroyApplicationClient(applicationClient: ApplicationClient): void
//
//     createUserSurface(
//         userSurface: CompositorSurface,
//         state: CompositorSurfaceState
//     ): void
//
//     notify(variant: string, message: string): void
//
//     updateUserSurface(
//         userSurface: CompositorSurface,
//         state: CompositorSurfaceState
//     ): void
//
//     destroyUserSurface(userSurface: CompositorSurface): void
//
//     updateUserSeat(userSeatState: UserSeatState): void
//
//     sceneRefresh(sceneId: string): void
// }

// export interface ButtonEvent {
//     x: number
//     y: number
//     timestamp: number
//     buttonCode: number
//     released: boolean
//     buttons: number
//     sceneId: string
// }

// export interface AxisEvent {
//     deltaMode: number
//     DOM_DELTA_LINE: number
//     DOM_DELTA_PAGE: number
//     DOM_DELTA_PIXEL: number
//     deltaX: number
//     deltaY: number
//     timestamp: number
//     sceneId: string
// }

// export interface KeyEvent {
//     code: number
//     timestamp: number
//     down: boolean
// }

// export interface UserShellApiInputActions {
//     pointerMove(buttonEvent: ButtonEvent): void
//
//     buttonUp(buttonEvent: ButtonEvent): void
//
//     buttonDown(buttonEvent: ButtonEvent): void
//
//     axis(axisEvent: AxisEvent): void
//
//     key(keyEvent: KeyEvent): void
// }

// export interface UserShellApiActions {
//     input: UserShellApiInputActions
//
//     raise(userSurface: CompositorSurface, sceneId: string): void
//
//     requestActive(userSurface: CompositorSurface): void
//
//     notifyInactive(userSurface: CompositorSurface): void
//
//     initScene(sceneId: string, canvas: HTMLCanvasElement): void
//
//     refreshScene(sceneId: string): Promise<void>
//
//     setSceneConfiguration(
//         sceneId: string,
//         sceneConfig: { width: number; height: number }
//     ): void
//
//     destroyScene(sceneId: string): void
//
//     createView(userSurface: CompositorSurface, sceneId: string): void
//
//     setKeyboardFocus(userSurface: CompositorSurface): void
//
//     setUserConfiguration(userConfiguration: Partial<UserConfiguration>): void
//
//     closeClient(applicationClient: Pick<ApplicationClient, 'id'>): void
// }

export interface WebAppSocket {
    onWebAppWorker(webWorker): Client
}

export interface WebAppSocketClass {
    create(session: Session): WebAppSocket
}

export interface UserShellApi {
    events: UserShellApiEvents
    actions: UserShellApiActions
}

export type Client = {}

export interface RemoteSocket {
    onWebSocket(webSocket: WebSocket): Promise<Client>
}

export interface RemoteSocketClass {
    create(session: Session): RemoteSocket
}

export interface RemoteAppLauncher {
    launch(appEndpointURL: URL, remoteAppId: string): Promise<Client>
}

export interface RemoteAppLauncherClass {
    create(session: Session, remoteSocket: RemoteSocket): RemoteAppLauncher
}

export interface WebAppLauncher {
    launch(webAppURL: URL): Promise<Client>
}

export interface WebAppLauncherClass {
    create(webAppSocket: WebAppSocket): WebAppLauncher
}

export interface CreateButtonEventFromMouseEventFunc {
    (
        mouseEvent: MouseEvent,
        released: boolean | null,
        sceneId: string
    ): ButtonEvent
}

export interface CreateAxisEventFromWheelEventFunc {
    (wheelEvent: WheelEvent, sceneId: string): AxisEvent
}

export interface CreateKeyEventFromKeyboardEventFunc {
    (keyboardEvent: KeyboardEvent, down: boolean): KeyEvent
}

export interface InitFunc {
    (): Promise<void>
}

export const initWasm: InitFunc
export const RemoteAppLauncher: RemoteAppLauncherClass
export const RemoteSocket: RemoteSocketClass
export const Session: SessionClass
export const WebAppLauncher: WebAppLauncherClass
export const WebAppSocket: WebAppSocketClass
export const createButtonEventFromMouseEvent: CreateButtonEventFromMouseEventFunc
export const createAxisEventFromWheelEvent: CreateAxisEventFromWheelEventFunc
export const createKeyEventFromKeyboardEvent: CreateKeyEventFromKeyboardEventFunc
