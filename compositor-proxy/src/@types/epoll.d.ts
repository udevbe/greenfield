declare module 'epoll' {
  export interface Epoll {
    add(fd: number, events: number): void
    remove(fd: number): void
    close(): void
  }
  export const Epoll: {
    EPOLLERR: number
    EPOLLIN: number
    EPOLLPRI: number
    new (select: (err: number) => void): Epoll
  }
}
