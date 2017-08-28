#!/usr/bin/env node

'use strict'

const express = require('express')
const http = require('http')
const Cookies = require('cookies')

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

  let idCount = 0
  const server = http.createServer((req, res) => {
    const cookies = new Cookies(req, res, {'keys': ['supersecretkey']})
    if (cookies.get('gr-id')) {
      return
    }
    if (req.url === '/') {
      const grSessionId = idCount++
      ensureFork(grSessionId)
      cookies.set('gr-id', grSessionId, {signed: true})
      res.writeHead(302, {'Location': '/'})
      return res.end()
    }
  })
  server.on('request', app)

  server.on('upgrade', (request, socket) => {
    const cookies = new Cookies(request, null, {'keys': ['supersecretkey']})
    const grSessionId = cookies.get('gr-id')
    let child = ensureFork(grSessionId)
    child.send({
      headers: request.headers,
      method: request.method
    }, socket)
  })

  server.listen(8080)
}

main()
