import SurfaceRole from './SurfaceRole'

export interface UserShellSurfaceRole extends SurfaceRole {
  /**
   * true if surface was made active, false if not
   */
  requestActive(): boolean

  notifyInactive(): void
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isUserShellSurfaceRole(object: any): object is UserShellSurfaceRole {
  return 'requestActive' in object && 'notifyInactive' in object
}
