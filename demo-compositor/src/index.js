import DesktopUserShell from './components/DesktopUserShell'
import { Session, Globals, init } from 'compositor-module'

window.DEBUG = false

async function main () {
  await init()
  const session = Session.create()
  const globals = Globals.create(session)
  DesktopUserShell.create(globals.seat, session)
  globals.register()
}
