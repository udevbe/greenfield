declare module 'epoll' {
  export interface Epoll {
    add(fd: number, bleh: number): void
  }
  export const Epoll: {
    EPOLLERR: number
    EPOLLIN: number
    EPOLLPRI: number
    new (select: (err: number) => void): Epoll
  }
}
