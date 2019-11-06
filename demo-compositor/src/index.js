import * as serviceWorker from './serviceWorker'
import DesktopUserShell from './components/DesktopUserShell'
import { Session, Globals } from 'compositor-module'

window.DEBUG = false

async function main () {
  const session = await Session.create()
  const globals = Globals.create(session)
  DesktopUserShell.create(globals.seat, session)
  globals.register()
}

main().then(() => {
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister()
})

