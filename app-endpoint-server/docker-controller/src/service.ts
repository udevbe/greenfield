import { v4 as uuidv4 } from 'uuid'
import Docker, { Container } from 'dockerode'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

const XDG_RUNTIME_DIRECTORY = '/xdgruntime'

async function createXDGRuntimeVolume({
  labels,
}: {
  labels: {
    launchId: string
  }
}) {
  // create volume
  const { Name } = await docker.createVolume({
    DriverOpts: {
      Type: 'tmpfs',
      Device: 'tmpfs',
    },
    Labels: { ...labels, type: 'xdg-runtime' },
  })
  return Name as string
}

async function launchCompositorProxyContainer({
  xdgRuntimeVolume,
  compositorSessionId,
  labels,
}: {
  xdgRuntimeVolume: string
  compositorSessionId: string
  labels: {
    launchId: string
  }
}) {
  const container = await docker.createContainer({
    Image: 'udevbe/compositor-proxy:latest',
    AttachStderr: false,
    AttachStdin: false,
    AttachStdout: false,
    OpenStdin: false,
    StdinOnce: false,
    Tty: false,
    Env: [
      'XDG_SESSION_TYPE=wayland',
      `XDG_RUNTIME_DIR=${XDG_RUNTIME_DIRECTORY}`,
      `COMPOSITOR_SESSION_ID=${compositorSessionId}`,
    ],
    Labels: labels,
    HostConfig: {
      ReadonlyRootfs: true,
      PortBindings: '8081',
      Tmpfs: {
        '/tmp': 'rw,exec',
      },
      Mounts: [
        {
          Target: XDG_RUNTIME_DIRECTORY,
          Source: xdgRuntimeVolume,
          Type: 'volume',
          ReadOnly: false,
        },
      ],
    },
  })
  const containerInspectInfo = await container.inspect()

  if (!(containerInspectInfo.State.Running || containerInspectInfo.State.Restarting)) {
    await container.start()
  }
  container.wait().then(() => container.remove())

  return { container, containerInspectInfo }
}

async function launchAppContainer({
  image,
  userName,
  xdgRuntimeVolume,
  userHomeVolume,
  labels,
}: {
  image: string
  xdgRuntimeVolume: string
  userHomeVolume: string
  userName: string
  labels: {
    launchId: string
  }
}) {
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
    Labels: labels,
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
  const containerInspectInfo = await container.inspect()

  if (!(containerInspectInfo.State.Running || containerInspectInfo.State.Restarting)) {
    await container.start()
  }

  container.wait().then(() => container.remove())
  return { container, containerInspectInfo }
}

function watchAppContainer({
  appContainer,
  compositorContainer,
  xdgRuntimeVolume,
}: {
  appContainer: Container
  compositorContainer: Container
  xdgRuntimeVolume: string
}) {
  appContainer
    .wait()
    .then(() => compositorContainer.stop())
    .then(() => docker.getVolume(xdgRuntimeVolume).remove())
}

export async function launchAppImage({
  compositorSessionId,
  appimage,
  userName,
  userId,
}: {
  compositorSessionId: string
  appimage: string
  userName: string
  userId: string
}): Promise<{ locations: string[] }> {
  const launchId = uuidv4()
  const xdgRuntimeVolume = await createXDGRuntimeVolume({ labels: { launchId } })
  const {
    container: compositorContainer,
    containerInspectInfo: compositorContainerInspectInfo,
  } = await launchCompositorProxyContainer({
    xdgRuntimeVolume,
    compositorSessionId,
    labels: {
      launchId,
    },
  })
  const { container: appContainer } = await launchAppContainer({
    image: appimage,
    // FIXME get userid from keycloak jwt
    userName,
    xdgRuntimeVolume,
    userHomeVolume: userId,
    labels: {
      launchId,
    },
  })

  watchAppContainer({ appContainer, compositorContainer, xdgRuntimeVolume })

  const addresses = Object.values(compositorContainerInspectInfo.NetworkSettings.Ports).flat()
  const locations = addresses
    // FIXME distinguish between ws & wss
    .map((port) => `ws://${port.HostIp}:${port.HostPort}`)

  return {
    locations,
  }
}
