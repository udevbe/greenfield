import SurfaceRole from './SurfaceRole'

export interface UserShellSurfaceRole extends SurfaceRole {
  requestActive(): void

  notifyInactive(): void
}

export function instanceOfUserShellSurfaceRole(object: any): object is UserShellSurfaceRole {
  return 'requestActive' in object && 'notifyInactive' in object
}
