import './style.css'
import ReactDOM from 'react-dom'
import React from 'react'
import PropTypes from 'prop-types'

import CssBaseline from '@material-ui/core/es/CssBaseline'

import TopPanel from '../toppanel/TopPanel'
import Workspace from '../workspace/Workspace'
import ManagedSurface from './ManagedSurface'
import Overlay from '../overlay/Overlay'
import Logo from '../logo/Logo'
import Login from '../login/Login'
import auth from '../../Auth'
import Seat from '../../../Seat'
import UserShell from '../../../UserShell'

// TODO we probably want a more mvvm like structure here
class DesktopUserShell extends React.PureComponent {
  /**
   * @param {Seat}seat
   * @return {UserShell}
   */
  static create (seat) {
    const userShell = new UserShell()
    const shellContainer = document.createElement('div')
    shellContainer.setAttribute('id', 'shell-container')
    document.body.appendChild(shellContainer)
    const desktopUserShell = <DesktopUserShell seat={seat} userShell={userShell} />
    ReactDOM.render(desktopUserShell, shellContainer)

    return userShell
  }

  /**
   * @param {{seat:Seat, userShell: UserShell}}props
   */
  constructor (props) {
    super(props)
    /**
     * @type {{managedSurface: Array<ManagedSurface>, activeManagedSurface: ManagedSurface|null, user: firebase.User|null}}
     */
    this.state = {
      managedSurfaces: [],
      activeManagedSurface: null,
      user: auth.user
    }

    if (auth.user) {
      this._waitForLogout()
    } else {
      this._waitForLogin()
    }

    props.userShell.manage = (surface, activeCallback, inactivateCallback) => this.manage(surface, activeCallback, inactivateCallback)
    this._activateManagedSurfaceOnPointerButton()
  }

  _waitForLogin () {
    auth.whenLogin().then((user) => {
      this.setState(() => ({ user }))
      this._waitForLogout()
    })
  }

  _waitForLogout () {
    auth.whenLogout().then(() => {
      this.setState(() => ({ user: null }))
      this._waitForLogin()
    })
  }

  /**
   * Ask the user shell to start managing the given surface.
   * @param {Surface}surface
   * @param {function}activeCallback  Registers a callback that will be fired when the user shell wants to make a surface active (ie give it input)
   * @param {function}inactivateCallback Registers callback that notifies if a surface is no longer active (ie no longer receives input)
   * @return {UserShellSurface}
   * @override
   */
  manage (surface, activeCallback, inactivateCallback) {
    const { seat } = /** @type{{seat:Seat}} */this.props

    // create new managed surface
    const managedSurface = new ManagedSurface(surface)
    managedSurface.onActivationRequest = activeCallback
    managedSurface.onInactive = inactivateCallback

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
    this._addManagedSurface(managedSurface)

    // remove managed surface from state if the underlying surface is destroyed
    surface.resource.onDestroy().then(() => {
      this._removeManagedSurface(managedSurface)
      seat.removeKeyboardResourceListener(keyboardResourceListener)
    })

    // register an activation listener and set active managed surface state if it received an activation event
    managedSurface.onActivation.push(() => this.setState(({ activeManagedSurface: previousActiveManagedSurface }) => {
      if (previousActiveManagedSurface !== managedSurface) {
        if (previousActiveManagedSurface && previousActiveManagedSurface.deactivate) {
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
    const { seat } = /** @type {{seat: Seat}} */this.props

    seat.pointer.onButtonPress().then(() => {
      if (seat.pointer.focus) {
        const { managedSurfaces, activeManagedSurface } =
          /** @type {{managedSurface: Array<ManagedSurface>, activeManagedSurface: ManagedSurface|null}} */this.state
        const targetManagedSurface = managedSurfaces.find(managedSurface => {
          return !managedSurface.view.destroyed &&
            seat.pointer.focus.surface === managedSurface.surface &&
            managedSurface !== activeManagedSurface &&
            managedSurface.requestActivation
        })

        if (targetManagedSurface) {
          targetManagedSurface.requestActivation(targetManagedSurface)
        }
      }
      setTimeout(() => this._activateManagedSurfaceOnPointerButton())
    })
  }

  /**
   * @param {ManagedSurface}managedSurface
   * @private
   */
  _addManagedSurface (managedSurface) {
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
   * @private
   */
  _removeManagedSurface (managedSurface) {
    this.setState(
      /**
       * @param {Array<ManagedSurface>}managedSurfaces
       * @param {ManagedSurface}activeManagedSurface
       * @return {{managedSurfaces: Array<ManagedSurface>}}
       */
      ({ managedSurfaces, activeManagedSurface }) => {
        return {
          activeManagedSurface: activeManagedSurface === managedSurface ? null : activeManagedSurface,
          managedSurfaces: managedSurfaces.filter(element => element.surface !== managedSurface.surface)
        }
      })
  }

  render () {
    const { seat } = /** @type{{seat:Seat}} */this.props
    const { managedSurfaces, activeManagedSurface, user } =
      /** @type {{managedSurface: Array<ManagedSurface>, activeManagedSurface: ManagedSurface|null, user:firebase.User}} */this.state
    return (
      <>
        <CssBaseline />
        <Overlay off={!!user}>
          <Logo />
          <Login id={'auth-container'} />
        </Overlay>
        <TopPanel
          user={user}
          managedSurfaces={managedSurfaces}
          activeManagedSurface={activeManagedSurface}
          seat={seat}
        />
        <Workspace
          managedSurfaces={managedSurfaces}
          activeManagedSurface={activeManagedSurface}
          seat={seat}
        />
      </>
    )
  }
}

DesktopUserShell.propTypes = {
  seat: PropTypes.instanceOf(Seat).isRequired,
  userShell: PropTypes.instanceOf(UserShell).isRequired
}

export default DesktopUserShell
