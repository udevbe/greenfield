#!/usr/bin/env node

'use strict'

const express = require('express')
const http = require('http')

const childProcess = require('child_process')
const path = require('path')

const forks = {}

function ensureFork (grSessionId) {
  let child = forks[grSessionId]
  if (child == null) {
    child = childProcess.fork(path.join(__dirname, 'forkIndex.js'))
    child.on('exit', () => {
      delete forks[grSessionId]
    })
    forks[grSessionId] = child
  }
  return child
}

function main () {
  const app = express()
  app.use(express.static('/home/zubzub/git/greenfield/browser/public'))

  const server = http.createServer()
  server.on('request', app)

  server.on('upgrade', (request, socket, head) => {
    let child = ensureFork(request.url.substring(1))
    child.send([{
      headers: request.headers,
      method: request.method
    }, head], socket)
  })

  server.listen(8080)
}

main()
