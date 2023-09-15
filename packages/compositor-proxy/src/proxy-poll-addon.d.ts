declare namespace nodePoll {
  export type PollHandle = unknown

  export function startPoll(fd: number, handlePollEvent: (status: number, events: number) => void): PollHandle

  export function stopPoll(pollHandle: PollHandle)
}

export = nodePoll
