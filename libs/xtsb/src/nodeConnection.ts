import * as fs from 'node:fs'
import * as net from 'node:net'
import * as os from 'node:os'
import * as path from 'node:path'
import * as util from 'node:util'
import { authenticate } from './auth'
import { SetupConnection, XConnectionOptions, XConnectionSocket } from './connection'

interface ConnectionTypeToName {
  256: 'Local'
  65535: 'Wild'
  254: 'Netname'
  253: 'Krb5Principal'
  252: 'LocalHost'
  0: 'Internet'
  1: 'DECnet'
  2: 'Chaos'
  5: 'ServerInterpreted'
  6: 'Internet6'
}

const connectionTypeToName: ConnectionTypeToName = {
  256: 'Local',
  65535: 'Wild',
  254: 'Netname',
  253: 'Krb5Principal',
  252: 'LocalHost',
  0: 'Internet',
  1: 'DECnet',
  2: 'Chaos',
  5: 'ServerInterpreted',
  6: 'Internet6',
}

interface Cookie {
  type: keyof ConnectionTypeToName
  address: string
  display: string
  authName: string
  authData: string
}

async function readXauthority(xAuthority?: string): Promise<Uint8Array | null> {
  const fsReadFile = util.promisify(fs.readFile)
  const nixFilename = xAuthority || process.env.XAUTHORITY || path.join(os.homedir(), '.Xauthority')
  try {
    return await fsReadFile(nixFilename)
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      // TODO we could solve this with recursion instead of c/p the readFile logic here from before
      // Xming/windows uses %HOME%/Xauthority ( .Xauthority with no dot ) - try with this name
      const winFilename = process.env.XAUTHORITY ?? path.join(os.homedir(), 'Xauthority')
      try {
        return await fsReadFile(winFilename)
      } catch (err: any) {
        if (err.code === 'ENOENT') {
          return null
        } else {
          throw err
        }
      }
    } else {
      throw err
    }
  }
}

function parseXauth(buf: Uint8Array): Cookie[] {
  let offset = 0
  const auth: Cookie[] = []
  const cookieProperties: (keyof Omit<Cookie, 'type'>)[] = ['address', 'display', 'authName', 'authData']

  while (offset < buf.length) {
    const type = buf[offset + 1] | (buf[offset] << 8)
    if (!connectionTypeToName.hasOwnProperty(type)) {
      throw new Error('Unknown address type')
    }
    const cookie: Partial<Cookie> = {
      type: type as keyof ConnectionTypeToName,
    }

    offset += 2
    cookieProperties.forEach((property) => {
      const length = buf[offset + 1] | (buf[offset] << 8)
      offset += 2
      if (cookie.type === 0 && property === 'address') {
        // Internet
        // 4 bytes of ip addess, convert to w.x.y.z string
        cookie.address = [buf[offset], buf[offset + 1], buf[offset + 2], buf[offset + 3]]
          .map((octet) => octet.toString(10))
          .join('.')
      } else {
        let res = ''
        const end = offset + length
        let offzet = offset
        while (offzet < end) {
          res += String.fromCharCode(buf[offzet++])
        }
        cookie[property] = res
      }
      offset += length
    })
    auth.push(cookie as Cookie)
  }
  return auth
}

async function connectSocket(host: string, displayNum: string, socketPath?: string): Promise<net.Socket> {
  return new Promise((resolve, reject) => {
    const socket = socketPath
      ? net.createConnection(socketPath)
      : net.createConnection(6000 + parseInt(displayNum, 10), host)
    socket.on('ready', () => {
      // client.init(stream)
      resolve(socket)
    })
    socket.on('error', (err: any) => {
      if (socket.connecting && socketPath && err.code === 'ENOENT') {
        return connectSocket('localhost', displayNum)
      } else if (socket.connecting) {
        reject(err)
      } else {
        socket.destroy(err)
      }
    })
  })
}

function connectSocketFD(fd: number): net.Socket {
  const socket = new net.Socket({ fd })
  socket.on('error', (err: Error) => {
    socket.destroy(err)
  })
  return socket
}

export async function getAuthenticationCookie(
  displayNum: string,
  authHost: string,
  socketFamily?: 'IPv4' | 'IPv6',
  xAuthority?: string,
): Promise<{ authName: string; authData: string }> {
  let family: number
  if (socketFamily === 'IPv4') {
    family = 0 // Internet
  } else if (socketFamily === 'IPv6') {
    family = 6 // Internet6
  } else {
    family = 256 // Local
  }

  const data = await readXauthority(xAuthority)

  if (!data) {
    return {
      authName: '',
      authData: '',
    }
  }
  const auth = parseXauth(data)
  for (const cookieNum in auth) {
    const cookie = auth[cookieNum]
    if (
      (connectionTypeToName[cookie.type] === 'Wild' || (cookie.type === family && cookie.address === authHost)) &&
      (cookie.display.length === 0 || cookie.display === displayNum)
    ) {
      return cookie
    }
  }
  // If no cookie is found, proceed without authentication
  return {
    authName: '',
    authData: '',
  }
}

export const nodeFDConnectionSetup: (fd: number) => SetupConnection = (fd) => async () => {
  const display = process.env.DISPLAY
  if (display === undefined) {
    throw new Error('No DISPLAY environment variable set.')
  }

  const displayMatch = display.match(/^(?:[^:]*?\/)?(.*):(\d+)(?:.(\d+))?$/)
  if (!displayMatch) {
    throw new Error('Cannot parse display')
  }
  const displayNum = displayMatch[2] ?? '0'

  const socket = connectSocketFD(fd)
  const xConnectionSocket: XConnectionSocket = {
    write(data: Uint8Array) {
      socket.write(data)
    },

    close() {
      socket.end()
    },
  }
  socket.on('data', (data) => xConnectionSocket.onData?.(data))

  const authHost = os.hostname()
  const cookie = await getAuthenticationCookie(displayNum, authHost)
  const setup = await authenticate(xConnectionSocket, displayNum, authHost, undefined, cookie)

  return { setup, xConnectionSocket }
}

export const nodeConnectionSetup: (options: XConnectionOptions) => SetupConnection = (options) => async () => {
  const display = options?.display ?? process.env.DISPLAY ?? ':0'
  const xAuthority = options?.xAuthority

  const displayMatch = display.match(/^(?:[^:]*?\/)?(.*):(\d+)(?:.(\d+))?$/)
  if (!displayMatch) {
    throw new Error('Cannot parse display')
  }

  const host = displayMatch[1]
  const displayNum = displayMatch[2] ?? '0'
  const screenNum = displayMatch[3] ?? '0'

  let socketPath: string | undefined
  // try local socket on non-windows platforms
  if (['cygwin', 'win32', 'win64'].indexOf(process.platform) < 0) {
    // FIXME check if mac is ok?
    // @ts-ignore
    if (process.platform === 'darwin' || process.platform === 'mac') {
      // socket path on OSX is /tmp/launch-(some id)/org.x:0
      if (display[0] === '/') {
        socketPath = display
      }
    } else if (!host) {
      socketPath = '/tmp/.X11-unix/X' + displayNum
    }
  }

  const socket = await connectSocket(host, displayNum, socketPath)
  const xConnectionSocket: XConnectionSocket = {
    write(data: Uint8Array) {
      socket.write(data)
    },

    close() {
      socket.end()
    },
  }
  socket.on('data', (data) => xConnectionSocket.onData?.(data))

  let authHost = socket.remoteAddress
  let socketFamily = socket.remoteFamily as 'IPv4' | 'IPv6' | undefined

  if (!authHost || authHost === '127.0.0.1' || authHost === '::1') {
    authHost = os.hostname()
    socketFamily = undefined
  }

  const cookie = await getAuthenticationCookie(displayNum, authHost, socketFamily, xAuthority)
  const setup = await authenticate(xConnectionSocket, displayNum, authHost, socketFamily, cookie)

  return { setup, xConnectionSocket }
}
