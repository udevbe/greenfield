import SurfaceRole from './SurfaceRole'

export interface UserShellSurfaceRole<T> extends SurfaceRole<T> {
  requestActive(): void

  notifyInactive(): void
}

export function instanceOfUserShellSurfaceRole(object: any): object is UserShellSurfaceRole<any> {
  return 'requestActive' in object && 'notifyInactive' in object
}
