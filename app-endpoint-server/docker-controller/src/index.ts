import express, { Request, Response } from 'express'
import Docker from 'dockerode'
import apps from '../apps.json'

import jwt from 'jsonwebtoken'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

const expressApp = express()

const PORT = 8000
const XDG_RUNTIME_DIRECTORY = '/xdgruntime'

function getXdgRuntimeVolumeName(compositorSessionId: string) {
  return `xdg-runtime::${compositorSessionId}`
}

async function ensureCompositorProxyXDGRuntimeVolume(req: Request, res: Response) {
  const compositorSessionId = req.params['compositorSessionId']

  const xdgRuntimeVolumeName = getXdgRuntimeVolumeName(compositorSessionId)
  const xdgRuntimeVolume = docker.getVolume(xdgRuntimeVolumeName)
  const xdgRuntimeVolumeInspectInfo = await xdgRuntimeVolume.inspect().catch(() => undefined)
  if (xdgRuntimeVolumeInspectInfo) {
    // volume exists
  } else {
    // create volume
    await docker.createVolume({
      Name: xdgRuntimeVolumeName,
      DriverOpts: {
        Type: 'tmpfs',
        Device: 'tmpfs',
      },
    })
  }

  return xdgRuntimeVolumeName
}

async function ensureCompositorProxyContainer(req: Request, res: Response, xdgRuntimeVolumeName: string) {
  const compositorSessionId = req.params['compositorSessionId']

  let compositorContainer = docker.getContainer(`compositor-proxy::${compositorSessionId}`)
  let compositorContainerInspectInfo = await compositorContainer.inspect().catch(() => undefined)

  if (compositorContainerInspectInfo) {
    // container already exists
    res.statusCode = 200 // OK
  } else {
    // create container
    compositorContainer = await docker.createContainer({
      Image: 'udevbe/compositor-proxy:latest',
      AttachStderr: false,
      AttachStdin: false,
      AttachStdout: false,
      OpenStdin: false,
      StdinOnce: false,
      Tty: false,
      Env: ['XDG_SESSION_TYPE=wayland', `XDG_RUNTIME_DIR=${XDG_RUNTIME_DIRECTORY}`],
      Volumes: {},
      HostConfig: {
        ReadonlyRootfs: true,
        PortBindings: '8081',
        Tmpfs: {
          '/tmp': 'rw,exec',
        },
        Mounts: [
          {
            Target: XDG_RUNTIME_DIRECTORY,
            Source: xdgRuntimeVolumeName,
            Type: 'volume',
            ReadOnly: false,
          },
        ],
      },
    })
    compositorContainerInspectInfo = await compositorContainer.inspect()
    res.statusCode = 201 // Resource created
  }

  if (!(compositorContainerInspectInfo.State.Running || compositorContainerInspectInfo.State.Restarting)) {
    await compositorContainer.start()
  }

  const addresses = Object.values(compositorContainerInspectInfo.NetworkSettings.Ports).flat()
  addresses
    .map((port) => `ws://${port.HostIp}:${port.HostPort}`)
    .forEach((address) => res.setHeader('Location', address))
}

expressApp.put('/compositor/:compositorSessionId', async (req, res) => {
  const xdgRuntimeVolumeName = await ensureCompositorProxyXDGRuntimeVolume(req, res)
  await ensureCompositorProxyContainer(req, res, xdgRuntimeVolumeName)
  res.end()
})

async function launchAppContainer({
  image,
  userName,
  xdgRuntimeVolume,
  userHomeVolume,
}: {
  image: string
  xdgRuntimeVolume: string
  userHomeVolume: string
  userName: string
}) {
  // Create the container.
  // TODO log container output
  const container = await docker.createContainer({
    AttachStderr: false,
    AttachStdin: false,
    AttachStdout: false,
    Image: image,
    OpenStdin: false,
    StdinOnce: false,
    Tty: false,
    Env: [
      'GDK_BACKEND=wayland',
      'QT_QPA_PLATFORM=wayland',
      'XDG_SESSION_TYPE=wayland',
      `XDG_RUNTIME_DIR=${XDG_RUNTIME_DIRECTORY}`,
    ],
    HostConfig: {
      ReadonlyRootfs: true,
      Tmpfs: {
        '/tmp': 'rw,exec',
      },
      Mounts: [
        {
          Target: XDG_RUNTIME_DIRECTORY,
          Source: xdgRuntimeVolume,
          Type: 'volume',
          ReadOnly: true,
        },
        {
          Target: `/home/${userName}`,
          Source: `${userHomeVolume}`,
          Type: 'volume',
          ReadOnly: false,
        },
      ],
    },
  })

  // Start the container.
  await container.start()
  container.wait().then(() => container.remove())
}

expressApp.put('/compositor/:compositorSessionId/application/:applicationId', async (req, res) => {
  const { compositorSessionId, applicationId } = req.params
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) {
    return res.sendStatus(401)
  }

  try {
    // TODO provide secret
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)
    // TODO check if container is already running for user
    await launchAppContainer({
      image: apps[applicationId as keyof typeof apps].image,
      userName: payload['userName'] as string,
      xdgRuntimeVolume: getXdgRuntimeVolumeName(compositorSessionId),
      userHomeVolume: 'tbd',
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(403)
  }
})

expressApp.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
