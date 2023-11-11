import { Configschema, createLogger } from '@gfld/compositor-proxy'
import { createServer } from 'node:http'
import { ChildProcess, fork } from 'node:child_process'
import { ToSessionProcessMessage } from './SessionProcess.js'
import { Socket } from 'node:net'
import { authRequest, handleGET, handleOptions } from './main-controller.js'
import { args } from './main-args.js'
import { inspect } from 'node:util'
import path from 'node:path'

process.on('uncaughtException', (e) => {
  logger.error('\tname: ' + e.name + ' message: ' + e.message)
  logger.error('error object stack: ')
  logger.error(e.stack ?? '')
})

const logger = createLogger('main')

const sessionProcesses: Record<string, ChildProcess> = {}

function main() {
  logger.info(`Starting compositor proxy with args: ${inspect(args)}`)

  const config: Configschema = {
    server: {
      http: {
        allowOrigin: args['allow-origin'],
        bindIP: args['bind-ip'],
        bindPort: +args['bind-port'],
      },
    },
    public: {
      baseURL: args['base-url'],
    },
    encoder: {
      h264Encoder: args['encoder'],
      renderDevice: args['render-device'],
    },
  }

  const server = createServer({ noDelay: true })

  server.on('upgrade', (request, socket: Socket) => {
    const url = new URL(request.url ?? '', `http://${request.headers.host}`)
    const compositorSessionId = url.searchParams.get('compositorSessionId')
    if (compositorSessionId === null) {
      socket.end()
      return
    }

    const childProcess = sessionProcesses[compositorSessionId]
    if (childProcess === undefined) {
      socket.end()
      return
    }

    socket.pause()
    const wsUpgrade: ToSessionProcessMessage = {
      type: 'wsUpgrade',
      payload: {
        request: {
          headers: request.headers,
          url: request.url,
          method: request.method,
        },
      },
    }
    childProcess.send(wsUpgrade, socket as Socket)
  })

  server.on('request', (request, response) => {
    const url = new URL(request.url ?? '', `http://${request.headers.host}`)
    if (request.method === 'OPTIONS') {
      handleOptions(config, request, response, url)
      return
    }

    if (request.method === 'GET') {
      const caps = authRequest(request, response, url)
      if (caps === undefined) {
        return
      }

      const { compositorSessionId } = caps

      let childProcess = sessionProcesses[compositorSessionId]
      if (childProcess === undefined) {
        logger.info('No proxy session exists for this compositor, spawning a new one.')
        childProcess = fork(path.join(__dirname, './SessionProcess'))

        childProcess.once('exit', (code, signal) => {
          logger.info(`Proxy session exited: ${signal || code}`)
          delete sessionProcesses[compositorSessionId]
        })
        childProcess.once('error', (err) => {
          logger.error(`Proxy session error: ${err.message}`)
          delete sessionProcesses[compositorSessionId]
        })
        sessionProcesses[compositorSessionId] = childProcess
        childProcess.once('spawn', () => {
          const start: ToSessionProcessMessage = {
            type: 'start',
            payload: {
              compositorSessionId,
              config,
            },
          }
          childProcess.send(start)
          handleGET(childProcess, compositorSessionId, config, request, response, url, args['applications'])
        })
      } else {
        handleGET(childProcess, compositorSessionId, config, request, response, url, args['applications'])
      }

      return
    }

    response
      .writeHead(405, 'Method Not Allowed', {
        Allow: 'GET,OPTIONS',
      })
      .end()
  })

  const port = config.server.http.bindPort
  const host = config.server.http.bindIP

  server.on('listening', () => {
    process.on('SIGTERM', () => {
      logger.info('Received SIGTERM. Closing connections.')
      server.closeAllConnections()
      // TODO gracefully terminate child processes
      logger.info('All Connections closed. Goodbye.')
      process.exit()
    })

    logger.info(`Compositor proxy started. Listening on ${host}:${port}`)
  })
  server.on('error', (err) => {
    logger.error(err.message)
  })
  server.listen(port, host)
}

main()
