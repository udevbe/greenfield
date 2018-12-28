'use strict'

const CompositorSession = require('./CompositorSession')

function main () {
  process.on('uncaughtException', (error) => console.error(error, error.stack))

  process.once('message', async (request, socket) => {
    const firstMessage = request[0]
    const compositorSessionId = firstMessage.compositorSessionId

    if (firstMessage.intention !== 'announce') {
      console.log(`[compositor-session-${compositorSessionId}] Expected message 'announce'. Instead got ${firstMessage.intention}.  Will exit.`)
      process.exit(0)
    }

    const headers = firstMessage.headers
    const method = firstMessage.method
    const head = request[1]

    const compositorSessionPromise = CompositorSession.create(compositorSessionId, headers, method, head, socket)

    process.on('message', async (request, socket) => {
      const message = request[0]
      const intention = message.intention
      if (intention === 'pair') {
        const appEndpointSessionId = message.endpointSessionId

        const headers = message.headers
        const method = message.method
        const head = request[1]

        const compositorSession = await compositorSessionPromise
        await compositorSession.pair(appEndpointSessionId, headers, method, head, socket)
      } else {
        console.log(`[compositor-session-${compositorSessionId}] Expected message 'pair'. Instead got ${message.intention}.  Will exit.`)
        process.exit(0)
      }
    })

    const compositorSession = await compositorSessionPromise

    const cleanUp = () => {
      compositorSession.destroy()
      process.exit(0)
    }

    process.on('SIGINT', cleanUp)
    process.on('SIGTERM', cleanUp)
    process.on('SIGBREAK', cleanUp)
    process.on('SIGHUP', cleanUp)

    compositorSession.onDestroy().then(() => {
      process.env.DEBUG && console.log(`[compositor-session-${compositorSessionId}] Destroyed. will exit.`)
      process.exit(0)
    })
  })
}

main()
