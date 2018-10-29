'use strict'

const AppEndpointCompositorPair = require('./AppEndpointCompositorPair')

function main () {
  process.on('uncaughtException', (error) => {
    console.error(error, error.stack)
  })

  const cleanUp = () => {
    process.exit(0)
  }

  process.on('SIGINT', cleanUp)
  process.on('SIGTERM', cleanUp)
  process.on('SIGBREAK', cleanUp)
  process.on('SIGHUP', cleanUp)

  process.once('message', async (message) => {
    const compositorSessionid = message.compositorSessionId
    try {
      const appEndpointCompositorPair = await AppEndpointCompositorPair.create(compositorSessionid)
      appEndpointCompositorPair.onDestroy().then(() => {
        cleanUp()
      })
    } catch (e) {
      console.error(`Failed to create app-endpoint for [compositor-session-${compositorSessionid}.`, e.message, e.stack)
      process.exit(-1)
    }
  })
}

main()
