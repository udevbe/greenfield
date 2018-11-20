'use strict'

const { service: serviceConfig } = require('./config')
const express = require('express')
const http = require('http')
const childProcess = require('child_process')
const path = require('path')

const WebSocket = require('ws')

const AppEndpoint = require('./AppEndpoint')
const appEndpointWebSocketServer = new WebSocket.Server({
  noServer: true,
  handshakeTimeout: 2000
})

const intentionHandlers = {
  announceCompositor: announceCompositor,
  announceAppEndpointDaemon: announceAppEndpointDaemon,
  pairAppEndpoint: pairAppEndpoint
}

/**
 * @type {Object.<string, ChildProcess>}
 */
const compositorSessionForks = {}
/**
 * @type {Object.<string, AppEndpoint>}
 */
const appEndpoints = {}
const uuidRegEx = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

/**
 * @param {string} compositorSessionId
 * @return {ChildProcess}
 */
function createCompositorSessionFork (compositorSessionId) {
  let child = compositorSessionForks[compositorSessionId]
  if (child == null) {
    // uncomment next line for debugging support in the child process
    // process.execArgv.push('--inspect-brk=0')

    console.log(`[compositor-service] Creating new child process for [compositor-session-${compositorSessionId}].`)
    const configPath = process.argv[2]
    child = childProcess.fork(path.join(__dirname, 'compositorSessionIndex.js'), configPath == null ? [] : [`${configPath}`])
    process.env.DEBUG && console.log(`[compositor-service] Child [${child.pid}] created.`)

    const removeChild = () => {
      process.env.DEBUG && console.log(`[compositor-service] Child [${child.pid}] removed.`)
      delete compositorSessionForks[compositorSessionId]
    }

    child.on('exit', removeChild)
    child.on('SIGINT', function () {
      process.env.DEBUG && console.log(`[compositor-service] Child [${child.pid}] received SIGINT.`)
      child.exit()
    })
    child.on('SIGTERM', function () {
      global.DEBUG && console.log(`[compositor-service] Child [${child.pid}] received SIGTERM.`)
      child.exit()
    })

    compositorSessionForks[compositorSessionId] = child
  } else {
    // TODO error out as there already exists a compositor session fork for this compositor session id.
  }
  return child
}

/**
 * @param {IncomingMessage}request
 * @param {Socket}socket
 * @param {Buffer}head
 * @param {string[]}pathElements
 */
function announceCompositor (request, socket, head, pathElements) {
  const compositorSessionId = pathElements.shift() // a UUID

  if (compositorSessionId && uuidRegEx.test(compositorSessionId)) {
    // fork a new process that will handle all things related to this compositor instance.
    let compositorSessionFork = createCompositorSessionFork(compositorSessionId)
    compositorSessionFork.send([{
      headers: request.headers,
      method: request.method,
      pathElements: pathElements,
      intention: 'announce',
      compositorSessionId: compositorSessionId
    }, head], socket)

    Object.values(appEndpoints).forEach(appEndpoint => {
      appEndpoint.announceCompositors(compositorSessionId)
    })
    // TODO listen for compositor destruction & send a denounce to app endpoints
  } else {
    socket.destroy(`Expected valid UUID in path for 'announceCompositor' intention, instead got: '${compositorSessionId}'.`)
  }
}

/**
 * @param {IncomingMessage}request
 * @param {Socket}socket
 * @param {Buffer}head
 * @param {string[]}pathElements
 */
function announceAppEndpointDaemon (request, socket, head, pathElements) {
  const appEndpointId = pathElements.shift() // a UUID
  if (appEndpointId && uuidRegEx.test(appEndpointId)) {
    appEndpointWebSocketServer.handleUpgrade(request, socket, head, (ws) => {
      process.env.DEBUG && console.log(`[compositor-service] Web socket is open for [app-endpoint-${appEndpointId}].`)

      const appEndpoint = AppEndpoint.create(ws)
      appEndpoints[appEndpointId] = appEndpoint
      appEndpoint.onDestroy().then(() => {
        delete appEndpoints.endpointId
      })

      appEndpoint.announceCompositors(...Object.keys(compositorSessionForks))
    })
  } else {
    socket.destroy(`Expected valid UUID in path for 'announceAppEndpoint' intention, instead got: '${appEndpointId}'.`)
  }
}

/**
 * @param {IncomingMessage}request
 * @param {Socket}socket
 * @param {Buffer}head
 * @param {string[]}pathElements
 */
function pairAppEndpoint (request, socket, head, pathElements) {
  const endpointSessionId = pathElements.shift() // a UUID
  const compositorSessionId = pathElements.shift() // a UUID

  if (endpointSessionId && uuidRegEx.test(compositorSessionId) &&
    compositorSessionId && uuidRegEx.test(compositorSessionId)) {
    const compositorSessionFork = compositorSessionForks[compositorSessionId]
    if (compositorSessionFork) {
      compositorSessionFork.send([{
        headers: request.headers,
        method: request.method,
        intention: 'pair',
        endpointSessionId: endpointSessionId
      }, head], socket)
    } else {
      socket.destroy('Compositor session id does not resolve to a valid compositor session.')
    }
  } else {
    socket.destroy(`Expected valid UUIDs in path for 'pairAppEndpoint' intention, instead got endpoint session id: '${endpointSessionId} and compositor session id: ${compositorSessionId}'.`)
  }
}

/**
 * @param {IncomingMessage}request
 * @param {Socket}socket
 * @param {Buffer}head
 */
function handleHttpUpgradeRequest (request, socket, head) {
  process.env.DEBUG && console.log(`[compositor-service] Received web socket upgrade request. Delegating to compositor session child process.`)
  const pathElements = request.url.split('/')
  pathElements.shift() // empty element
  const intention = pathElements.shift()

  const intentionHandler = intentionHandlers[intention]
  if (intentionHandler) { // 'announceAppEndpointDaemon', 'pairAppEndpoint', 'announceCompositor'
    intentionHandler(request, socket, head, pathElements)
  } else {
    socket.destroy(`Unknown intention ${intention}.`)
  }
}

function main () {
  console.log(`[compositor-service] >>> running in ${process.env.DEBUG ? 'DEBUG' : 'PRODUCTION'} mode <<<`)
  express.static.mime.define({ 'application/wasm': ['wasm'] })
  const app = express()
  app.use(express.static(path.join(__dirname, process.env.DEV ? '../../web/dev' : '../../web/dist')))

  const server = http.createServer()
  server.on('request', app)
  server.setTimeout(serviceConfig['http-server']['socket-timeout'])

  server.on('upgrade', (request, socket, head) => {
    handleHttpUpgradeRequest(request, socket, head)
  })

  const cleanUp = () => {
    process.env.DEBUG && console.log('[compositor-service] Exit. Cleaning up compositor session children.')
    Object.values(compositorSessionForks).forEach((child) => {
      console.log(`[compositor-service] Sending child [${child.pid}] SIGKILL`)
      child.disconnect()
      child.kill('SIGKILL')
    })
  }

  process.on('exit', cleanUp)
  process.on('SIGINT', () => {
    console.log('[compositor-service] Received SIGINT')
    process.exit()
  })
  process.on('SIGTERM', () => {
    console.log('[compositor-service] Received SIGTERM')
    process.exit()
  })

  server.listen(serviceConfig['http-server']['port'])
}

main()
