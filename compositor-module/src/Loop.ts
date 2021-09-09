export function queueCancellableMicrotask(handler: () => void): () => void {
  let canceled = false
  queueMicrotask(() => {
    if (canceled) {
      return
    }
    handler()
  })
  return () => {
    canceled = true
  }
}
