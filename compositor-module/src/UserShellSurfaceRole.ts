import SurfaceRole from './SurfaceRole'

export interface UserShellSurfaceRole extends SurfaceRole {
  requestActive(): void

  notifyInactive(): void
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isUserShellSurfaceRole(object: any): object is UserShellSurfaceRole {
  return 'requestActive' in object && 'notifyInactive' in object
}
