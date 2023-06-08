import { AppContext, AppLauncher, CompositorClient, CompositorSurface } from '../../src'
import { Signal } from '@preact/signals'
import { useCallback } from 'preact/compat'
import { JSX } from 'preact'
import { AddIcon, ClosedIcon, CloseIcon, ErrorIcon, FrozenIcon, LoadingIcon } from './Icons'

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
  defaultInputValue?: string,
): AppEntryProps {
  const appEntryProps: AppEntryProps = {
    onLaunchNew: (url: URL) => {
      launchNewApp(appLauncher, url, appEntryProps, appEntries)
    },
    onClose: () => {
      appEntryProps.appContext.value?.close()
      handleCloseEntry(appEntryProps, appEntries)
    },
    appContext: new Signal<AppContext | undefined>(undefined),
    connectionState: new Signal('empty'),
    name: new Signal(''),
    clients: new Signal([]),
    unresponsive: new Signal(false),
    defaultInputValue,
    windows: new Signal([]),
    lastActiveWindow: new Signal(),
    isChild,
  }
  return appEntryProps
}

function launchNewApp(
  appLauncher: AppLauncher,
  url: URL,
  appEntryProps: AppEntryProps,
  appEntries: Signal<AppEntryProps[]>,
) {
  let targetAppEntryProps: AppEntryProps
  if (appEntryProps.appContext.value === undefined) {
    targetAppEntryProps = appEntryProps
  } else {
    targetAppEntryProps = createEmptyAppEntry(appLauncher, appEntries, false, url.href)
    appEntries.value = [targetAppEntryProps, ...appEntries.value]
  }
  targetAppEntryProps.connectionState.value = 'connecting'

  const appContext = appLauncher.launch(url, (childAppContext) => {
    const emptyChildAppEntry = createEmptyAppEntry(appLauncher, appEntries, true, url.href)
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
  const addAppEntry = useCallback(() => {
    const appEntryProps = createEmptyAppEntry(props.appLauncher, props.appEntries, false)
    props.appEntries.value = [appEntryProps, ...props.appEntries.value]
  }, [props.appLauncher, props.appEntries])

  return (
    <div class="flex w-full flex-wrap space-x-1">
      <button
        class="grid min-h-[1.75rem] min-w-[1.5rem] place-content-center rounded-full transition duration-500 ease-in-out hover:bg-gray-600"
        onClick={addAppEntry}
      >
        <div class="stroke-gray-100">
          <AddIcon />
        </div>
      </button>
      {props.appEntries.value.map((appEntry) => (
        <AppEntry {...appEntry} key={appEntry} />
      ))}
    </div>
  )
}

function selectAllOnFocus(ev: JSX.TargetedFocusEvent<HTMLInputElement>) {
  ev.currentTarget.select()
}

export type Window = CompositorSurface & { title: Signal<string> }

export type AppEntryProps = Readonly<{
  appContext: Signal<AppContext | undefined>
  connectionState: Signal<AppContext['state'] | 'empty'>
  name: Signal<AppContext['name']>
  onLaunchNew: (url: URL) => void
  onClose: () => void
  clients: Signal<CompositorClient[]>
  unresponsive: Signal<boolean>
  defaultInputValue?: string
  windows: Signal<Window[]>
  lastActiveWindow: Signal<Window | undefined>
  isChild: boolean
}>

function AppEntry(props: AppEntryProps) {
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
          : `http://${connectionURL}`,
      )
      event.target.title = url.href
      props.onLaunchNew(url)
    }
  }, [])

  if (props.isChild && props.windows.value.length === 0) {
    return null
  }

  return (
    <div class="flex min-w-[12rem] max-w-[100%] shrink grow basis-4 content-center rounded-full border-2 border-gray-200 bg-gray-200 text-sm leading-none focus-within:border-2 focus-within:border-amber-600">
      <div class="grid min-w-[1.5rem] place-content-center pl-0.5">
        <ConnectionStateIcon state={props.connectionState} unresponsive={props.unresponsive} />
      </div>
      <input
        class="w-full shrink grow truncate bg-gray-200 p-0.5 leading-snug outline-0"
        type="text"
        onKeyPress={onKeyPress}
        placeholder="type a URL"
        name="remote"
        onfocusin={selectAllOnFocus}
        title={props.defaultInputValue}
        defaultValue={props.defaultInputValue}
      />
      <div class="flex max-w-[10rem] shrink grow flex-col justify-center pl-2 pr-1">
        <span class="truncate text-right">{props.lastActiveWindow.value?.title ?? props.name}</span>
      </div>
      <div class="grid min-w-[1.5rem] place-content-center pr-0.5">
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
