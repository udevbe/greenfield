import httpProxy from 'http-proxy'
import http from 'http'
import fetch from 'node-fetch'
import url from 'url'

const uuidRegEx = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
const proxy = httpProxy.createProxyServer({ ws: true })

async function handleAnyRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  if (req.url === undefined) {
    res.statusCode = 400
    return
  }

  const wsURL = url.parse(req.url, true)
  const compositorSessionId = wsURL.query['compositorSessionId']

  if (typeof compositorSessionId !== 'string') {
    res.statusCode = 400
    res.end('Only a single compositorSessionId query parameter is allowed.')
    return
  }

  if (uuidRegEx.test(compositorSessionId)) {
    // TODO make docker-controller hostname configurable?
    const result = await fetch(`http://docker-controller/compositor/${compositorSessionId}`, {
      method: 'PUT',
      redirect: 'follow',
    })
    const targetWebsocketURL = result.headers.get('Location')
    if (result.status >= 200 && result.status < 300 && targetWebsocketURL) {
      proxy.web(req, res, { forward: targetWebsocketURL })
    } else {
      res.statusCode = 504
      res.end(`Proxy compositor did not respond successfully.\n${result.statusText}: ${await result.text()}`)
    }
  } else {
    res.statusCode = 400
    res.end('compositorSessionId query parameter is not a valid uuidv4.')
    return
  }
}

function main() {
  const httpServer = http.createServer(handleAnyRequest)
  httpServer.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head)
  })

  httpServer.listen(8015)
}

main()
