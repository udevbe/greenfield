const canvas = document.getElementById('foo') as HTMLCanvasElement
const context = canvas.getContext('bitmaprenderer')
if (context === null) {
  throw new Error('bitmaprenderer not supported.')
}

const worker = new Worker(new URL('./worker.ts', import.meta.url), {
  type: 'module',
})
worker.onerror = (ev) => {
  console.log(ev)
}

window.addEventListener('message', (ev) => {
  console.log('received message from parent window')
  const messageChannelPort = ev.ports[0]
  worker.postMessage(messageChannelPort, [messageChannelPort])
})
