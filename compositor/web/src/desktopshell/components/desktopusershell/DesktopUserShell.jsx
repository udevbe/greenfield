import './style.css'
import { h, Component } from 'preact'
import TopPanel from '../toppanel/TopPanel'
import Workspace from '../workspace/Workspace'
import EntriesContainer from '../entriescontainer/EntriesContainer'
import ManagedSurfaceEntry from '../managedsurfaceentry/ManagedSurfaceEntry'
import ManagedSurfaceView from '../managedsurfaceview/ManagedSurfaceView'
import ManagedSurface from './ManagedSurface'

// TODO we probably want a more mvvm like structure here
class DesktopUserShell extends Component {
  /**
   * @param {Seat}seat
   */
  constructor ({ seat }) {
    super({ seat })
    /**
     * @type {{managedSurface: Array<ManagedSurface>, activeManagedSurface: ManagedSurface|null}}
     */
    this.state = {
      managedSurfaces: [],
      activeManagedSurface: null
    }

    this._activateManagedSurfaceOnPointerButton()
  }

  /**
   * Ask the user shell to start managing the given surface.
   * @param {Surface}surface
   * @return {ManagedSurface}
   * @override
   */
  manage (surface) {
    const { seat } = /** @type{{seat:Seat}} */this.props

    // create new managed surface
    const managedSurface = new ManagedSurface(surface)

    // listen for client keyboard resource creation and store it in the managed surface
    const keyboardResourceListener = (wlKeyboardResource) => {
      if (surface.resource.client === wlKeyboardResource.client) {
        managedSurface.wlKeyboardResource = wlKeyboardResource
        wlKeyboardResource.onDestroy().then(() => { managedSurface.wlKeyboardResource = null })

        const { activeManagedSurface } = /** @type{{activeManagedSurface: ManagedSurface|null}} */ this.state
        // if managed surface is active, give it keyboard focus
        if (activeManagedSurface === managedSurface) {
          managedSurface.giveKeyboardFocus()
        }
      }
    }
    seat.addKeyboardResourceListener(keyboardResourceListener)
    seat.keyboard.resources.forEach(keyboardResourceListener)

    // add the managed surface to state
    this.addManagedSurface(managedSurface)

    // remove managed surface from state if the underlying surface is destroyed
    surface.resource.onDestroy().then(() => {
      this.removeManagedSurface(managedSurface)
      seat.removeKeyboardResourceListener(keyboardResourceListener)
    })

    // register an activation listener and set active managed surface state if it received an activation event
    managedSurface.onActivation.push(() => this.setState(({ activeManagedSurface: previousActiveManagedSurface }) => {
      if (previousActiveManagedSurface !== managedSurface) {
        if (previousActiveManagedSurface.deactivate) {
          previousActiveManagedSurface.deactivate()
        }
        managedSurface.giveKeyboardFocus()
      }
      return { activeManagedSurface: managedSurface }
    }))

    return managedSurface
  }

  /**
   * Makes a surface active if a user clicks on it.
   * @private
   */
  _activateManagedSurfaceOnPointerButton () {
    const { seat, managedSurfaces, activeManagedSurface } =
      /** @type {{managedSurface: Array<ManagedSurface>, activeManagedSurface: ManagedSurface|null}} */this.props

    seat.pointer.onButtonPress().then(() => {
      if (seat.pointer.focus) {
        managedSurfaces.find(managedSurface => {
          return !managedSurface.view.destroyed &&
            seat.pointer.focus.surface === managedSurface.surface &&
            !(managedSurface !== activeManagedSurface) &&
            managedSurface.requestActivation
        }).requestActivation()
      }

      setTimeout(() => this._activateManagedSurfaceOnPointerButton())
    })
  }

  /**
   * @param {ManagedSurface}managedSurface
   */
  addManagedSurface (managedSurface) {
    this.setState(
      /**
       * @param {Array<ManagedSurface>}managedSurfaces
       * @return {{managedSurfaces: Array<ManagedSurface>}}
       */
      ({ managedSurfaces }) => {
        return {
          managedSurfaces: [...managedSurfaces, managedSurface]
        }
      })
  }

  /**
   * @param {ManagedSurface}managedSurface
   */
  removeManagedSurface (managedSurface) {
    this.setState(
      /**
       * @param {Array<ManagedSurface>}managedSurfaces
       * @return {{managedSurfaces: Array<ManagedSurface>}}
       */
      ({ managedSurfaces }) => {
        return {
          managedSurfaces: managedSurfaces.filter(element => element !== managedSurface)
        }
      })
  }

  /**
   * @param {Seat}seat
   * @param {Array<ManagedSurface>}managedSurfaces
   * @param {ManagedSurface}activeManagedSurface
   * @param context
   * @return {*}
   */
  render ({ seat }, { managedSurfaces, activeManagedSurface }, context) {
    return (
      <div className={'desktop-user-shell'}>
        <TopPanel>
          <EntriesContainer> {
            managedSurfaces.map(managedSurface =>
              <ManagedSurfaceEntry
                key={managedSurface.surface.resource.id}
                seat={seat}
                managedSurface={managedSurface}
                active={activeManagedSurface === managedSurface}
              />
            )}
          </EntriesContainer>
        </TopPanel>
        <Workspace> {
          managedSurfaces.map(managedSurface =>
            <ManagedSurfaceView
              key={managedSurface.surface.resource.id}
              seat={seat}
              managedSurface={managedSurface}
              active={activeManagedSurface === managedSurface}
            />
          )}
        </Workspace>
      </div>
    )
  }
}

export default DesktopUserShell
