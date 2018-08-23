'use strict'
global.DEBUG = true

const config = require('./config')

const express = require('express')
const http = require('http')
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('../../browser/build.config/webpack.config.dev')
const middleware = require('webpack-dev-middleware')
const ShimSession = require('./ShimSession')
const DesktopShellAppsController = require('./DesktopShellAppsController')

const controllers = {
  'apps': DesktopShellAppsController
}

function main () {
  process.on('uncaughtException', (error) => {
    console.error(error, error.stack)
  })

  console.warn('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  console.warn('!!! Running in DEVELOPMENT mode !!!')
  console.warn('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n')

  const compiler = webpack(webpackConfig)

  const app = express()

  app.use(middleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))
  const staticDirs = config['http-server']['static-dirs']
  staticDirs.forEach((staticDir) => {
    const httpPath = staticDir['http-path']
    const fsPath = staticDir['fs-path']

    app.use(httpPath, express.static(path.resolve(fsPath)))
  })
  app.use(require('webpack-hot-middleware')(compiler))

  const server = http.createServer()
  server.on('request', app)
  server.setTimeout(config['http-server']['socket-timeout'])

  let shimSessionPromise = null

  server.on('upgrade', async (request, socket, head) => {
    try {
      if (shimSessionPromise) {
        const shimSession = await shimSessionPromise
        // handle other non-session websocket connections
        const pathElements = request.url.split('/')
        pathElements.shift() // empty element
        const sessionId = pathElements.shift()
        console.log(`Development session id is ${sessionId}`)
        const controllerId = pathElements.shift()
        const controller = controllers[controllerId]
        if (controller) {
          controller.create(request, socket, pathElements, shimSession)
        }
      } else {
        shimSessionPromise = ShimSession.create(request, socket, head)
        const shimSession = await shimSessionPromise
        shimSession.localSession.onTerminate = () => {
          console.log('Development session terminated.')
        }
        shimSession.start()
        console.log('Development session started.')
      }
    } catch (error) {
      console.error(`${error}\n${error.stack}`)
    }
  })

  server.listen(config['http-server']['port'])
}

main()
