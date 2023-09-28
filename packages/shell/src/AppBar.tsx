import { AppContext, AppLauncher, CompositorClient, CompositorSurface } from '@gfld/compositor'
import { Signal } from '@preact/signals'
import { useCallback } from 'preact/compat'
import { JSX } from 'preact'
import { ClosedIcon, CloseIcon, ErrorIcon, FrozenIcon, LoadingIcon } from './Icons'

function handleCloseEntry(closedAppEntryProps: AppEntryProps, appEntries: Signal<AppEntryProps[]>) {
  appEntries.value = appEntries.value.filter((appEntryProps) => appEntryProps !== closedAppEntryProps)
}

function handleNewApp(appContext: AppContext, appEntryProps: AppEntryProps, appEntries: Signal<AppEntryProps[]>) {
  appEntryProps.appContext.value = appContext

  appContext.onStateChange = (state) => {
    if (state === 'terminated') {
      handleCloseEntry(appEntryProps, appEntries)
      return
    }
    appEntryProps.connectionState.value = state
  }
  appContext.onNameChanged = (name) => {
    appEntryProps.name.value = name
  }
  appContext.onClient = (client) => {
    appEntryProps.clients.value = [...appEntryProps.clients.value, client]
    client.onClose().then(() => {
      appEntryProps.clients.value = appEntryProps.clients.value.filter((otherClient) => otherClient !== client)
    })
  }
}

function createEmptyAppEntry(
  appEntries: Signal<AppEntryProps[]>,
  isChild: boolean,
  appLaunchURL: string,
): AppEntryProps {
  const appEntryProps: AppEntryProps = {
    onClose: () => {
      appEntryProps.appContext.value?.close()
      handleCloseEntry(appEntryProps, appEntries)
    },
    appContext: new Signal<AppContext | undefined>(undefined),
    connectionState: new Signal('empty'),
    name: new Signal(),
    clients: new Signal([]),
    unresponsive: new Signal(false),
    appLaunchURL,
    windows: new Signal([]),
    lastActiveWindow: new Signal(),
    isChild,
  }
  return appEntryProps
}

function launchNewWebApp(appLauncher: AppLauncher, url: URL, appEntries: Signal<AppEntryProps[]>) {
  const appURL = new URL(url.href.replace('web', 'http'))
  const appEntryProps = createEmptyAppEntry(appEntries, false, appURL.href.replace(/^https?:\/\//, ''))
  appEntries.value = [appEntryProps, ...appEntries.value]

  appEntryProps.connectionState.value = 'connecting'

  const appContext = appLauncher.launch(appURL, () => {})
  appEntryProps.appContext.value = appContext

  appEntryProps.connectionState.value = appContext.state
  handleNewApp(appContext, appEntryProps, appEntries)
}

function launchNewRemoteApp(appLauncher: AppLauncher, url: URL, appEntries: Signal<AppEntryProps[]>) {
  const appURL = new URL(url.href.replace('rem', 'http'))
  appURL.username = ''
  appURL.password = ''
  const appEntryProps = createEmptyAppEntry(appEntries, false, appURL.href.replace(/^https?:\/\//, ''))
  appEntries.value = [appEntryProps, ...appEntries.value]

  appEntryProps.connectionState.value = 'connecting'

  const appContext = appLauncher.launch(new URL(url.href.replace('rem', 'http')), (childAppContext) => {
    const emptyChildAppEntry = createEmptyAppEntry(appEntries, true, `${url.host}`)
    // TODO put the child next to the parent?
    appEntries.value = [emptyChildAppEntry, ...appEntries.value]
    handleNewApp(childAppContext, emptyChildAppEntry, appEntries)
  })

  appEntryProps.connectionState.value = appContext.state
  handleNewApp(appContext, appEntryProps, appEntries)
}

export type AppBarProps = Readonly<{
  remoteAppLauncher: AppLauncher
  webAppLauncher: AppLauncher
  appEntries: Signal<AppEntryProps[]>
}>

export function AppBar(props: AppBarProps) {
  return (
    <div class="flex w-full flex-col">
      <div class="flex w-full flex-wrap space-x-1 p-1">
        <AppLaunchInput
          onLaunchNew={(url) => {
            if (url.protocol === 'rem:' || url.protocol === 'rems:') {
              launchNewRemoteApp(props.remoteAppLauncher, url, props.appEntries)
            } else if (url.protocol === 'web:' || url.protocol === 'webs:') {
              launchNewWebApp(props.webAppLauncher, url, props.appEntries)
            } else {
              // TODO error with unsupported URL
            }
          }}
        />
      </div>
      <div class="flex w-full flex-wrap space-x-1 pl-1 pr-1">
        {props.appEntries.value.map((appEntry) => (
          <AppEntry {...appEntry} key={appEntry} />
        ))}
      </div>
    </div>
  )
}

export type AppInputProps = Readonly<{
  onLaunchNew: (url: URL) => void
}>

function AppLaunchInput(props: AppInputProps) {
  const onKeyPress = useCallback((event: KeyboardEvent) => {
    if (
      event.key === 'Enter' &&
      event.target &&
      event.target instanceof HTMLInputElement &&
      event.target.value.trim() !== ''
    ) {
      const connectionURL = event.target.value
      const url = new URL(connectionURL)
      event.target.value = ''
      props.onLaunchNew(url)
    }
  }, [])

  return (
    <div class="flex min-w-[12rem] max-w-[100%] shrink grow basis-4 content-center rounded-full border-2 border-slate-300 bg-slate-300 text-sm leading-none focus-within:border-2 focus-within:border-sky-600 focus-within:bg-slate-100 hover:bg-slate-100">
      <div class="grid min-w-[1.5rem] place-content-center">{/*<NetworkIcon />*/}</div>
      <input
        class="mr-2 w-full shrink grow truncate bg-transparent p-0.5 pl-1 leading-snug outline-0 text-black placeholder-gray-600"
        type="text"
        onKeyPress={onKeyPress}
        placeholder="Type a web:// or rem:// URL"
        name="remote"
        onfocusin={selectAllOnFocus}
      />
    </div>
  )
}

function selectAllOnFocus(ev: JSX.TargetedFocusEvent<HTMLInputElement>) {
  ev.currentTarget.select()
}

export type Window = CompositorSurface & { title: Signal<string | undefined> }

export type AppEntryProps = Readonly<{
  appContext: Signal<AppContext | undefined>
  connectionState: Signal<AppContext['state'] | 'empty'>
  name: Signal<AppContext['name'] | undefined>
  onClose: () => void
  clients: Signal<CompositorClient[]>
  unresponsive: Signal<boolean>
  appLaunchURL: string
  windows: Signal<Window[]>
  lastActiveWindow: Signal<Window | undefined>
  isChild: boolean
}>

function AppEntry(props: AppEntryProps) {
  if (props.isChild && props.windows.value.length === 0) {
    return null
  }

  return (
    <div class="flex pointer-events-none min-w-[26rem] basis-4 rounded-full border-2 border-slate-300 transition duration-150 ease-in-out hover:border-rose-500 text-sm leading-none text-gray-900">
      <div class="grid min-w-[1.5rem] place-content-center">
        <ConnectionStateIcon state={props.connectionState} unresponsive={props.unresponsive} />
      </div>
      <div class="flex min-w-[22rem] shrink grow items-stretch p-1">
        <div class="flex min-w-[12rem] shrink grow flex-col justify-center pr-1">
          <span class="truncate text-left font-semibold">
            {props.lastActiveWindow.value?.title.value ?? props.name.value ?? props.appLaunchURL}
          </span>
        </div>
        <div class="flex min-w-[10rem] shrink grow flex-col justify-center">
          <span class="truncate text-right text-xs font-light leading-none">{props.appLaunchURL}</span>
        </div>
      </div>
      <div class="pointer-events-none grid min-w-[1.5rem] place-content-center">
        <button
          class="pointer-events-auto rounded-full stroke-current transition duration-150 ease-in-out hover:bg-rose-500"
          onClick={props.onClose}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}

function ConnectionStateIcon(props: {
  state: AppEntryProps['connectionState']
  unresponsive: AppEntryProps['unresponsive']
}) {
  switch (props.state.value) {
    case 'connecting':
      return <LoadingIcon />
    case 'error':
      return <ErrorIcon />
    case 'closed':
      return <ClosedIcon />
    default:
      return props.unresponsive.value ? <FrozenIcon /> : null
  }
}
