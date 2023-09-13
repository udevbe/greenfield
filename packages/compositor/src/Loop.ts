export function queueCancellableMicrotask(handler: () => void): () => void {
  let canceled = false
  setTimeout(() => {
    if (canceled) {
      return
    }
    handler()
  })
  return () => {
    canceled = true
  }
}
