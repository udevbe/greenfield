import { AppContext, AppLauncher, CompositorClient, CompositorSurface } from '../../src'
import { Signal } from '@preact/signals'
import { useCallback } from 'preact/compat'
import { JSX } from 'preact'
import { ClosedIcon, CloseIcon, ErrorIcon, FrozenIcon, LoadingIcon, NetworkIcon } from './Icons'

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
  appLauncher: AppLauncher,
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

function launchNewApp(appLauncher: AppLauncher, url: URL, appEntries: Signal<AppEntryProps[]>) {
  const targetAppEntryProps = createEmptyAppEntry(appLauncher, appEntries, false, url.href.replace(/^https?:\/\//, ''))
  appEntries.value = [targetAppEntryProps, ...appEntries.value]

  targetAppEntryProps.connectionState.value = 'connecting'

  const appContext = appLauncher.launch(url, (childAppContext) => {
    const emptyChildAppEntry = createEmptyAppEntry(appLauncher, appEntries, true, `${url.host}`)
    // TODO put the child next to the parent?
    appEntries.value = [emptyChildAppEntry, ...appEntries.value]
    handleNewApp(childAppContext, emptyChildAppEntry, appEntries)
  })

  targetAppEntryProps.connectionState.value = appContext.state
  handleNewApp(appContext, targetAppEntryProps, appEntries)
}

export type AppBarProps = Readonly<{
  appLauncher: AppLauncher
  appEntries: Signal<AppEntryProps[]>
}>

export function AppBar(props: AppBarProps) {
  return (
    <div class="flex w-full flex-col">
      <div class="flex w-full flex-wrap space-x-1 p-1">
        <AppLaunchInput
          onLaunchNew={(url) => {
            launchNewApp(props.appLauncher, url, props.appEntries)
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
      const url = new URL(
        connectionURL.startsWith('http://') || connectionURL.startsWith('https://')
          ? connectionURL
          : `${location.protocol}//${connectionURL}`,
      )
      event.target.value = ''
      props.onLaunchNew(url)
    }
  }, [])

  return (
    <div class="flex min-w-[12rem] max-w-[100%] shrink grow basis-4 content-center rounded-full border-2 border-gray-200 bg-gray-200 text-sm leading-none focus-within:border-2 focus-within:border-amber-600 hover:bg-gray-300">
      <div class="grid min-w-[1.5rem] place-content-center">
        <NetworkIcon />
      </div>
      <input
        class="mr-2 w-full shrink grow truncate bg-transparent p-0.5 pl-1 leading-snug outline-0 "
        type="text"
        onKeyPress={onKeyPress}
        placeholder="type an app URL"
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
    <div class="flex min-w-[20rem] basis-4 rounded-full border-2 border-gray-200 bg-gray-200 text-sm leading-none hover:bg-gray-300">
      <div class="grid min-w-[1.5rem] place-content-center">
        <ConnectionStateIcon state={props.connectionState} unresponsive={props.unresponsive} />
      </div>
      <button class="flex min-w-[14rem] shrink grow items-stretch p-1">
        <div class="flex min-w-[7rem] shrink grow flex-col justify-center pr-1">
          <span class="truncate text-left">
            {props.lastActiveWindow.value?.title.value ?? props.name.value ?? props.appLaunchURL}
          </span>
        </div>
        <div class="flex min-w-[7rem] shrink grow flex-col justify-center">
          <span class="truncate text-right text-xs leading-none">{props.appLaunchURL}</span>
        </div>
      </button>
      <div class="grid min-w-[1.5rem] place-content-center">
        {props.connectionState.value !== 'open' || props.unresponsive.value ? (
          <button
            class="rounded-full stroke-current transition duration-150 ease-in-out hover:bg-gray-400"
            onClick={props.onClose}
          >
            <CloseIcon />
          </button>
        ) : null}
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
