// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.



import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles/index'

import AppBar from '@material-ui/core/es/AppBar/index'
import Toolbar from '@material-ui/core/es/Toolbar/index'
import IconButton from '@material-ui/core/es/IconButton/index'

import MenuIcon from '@material-ui/icons/Menu'
import AppsIcon from '@material-ui/icons/Apps'

import ManagedSurface from './ManagedSurface'

import SettingsDrawer from './SettingsDrawer'
import LauncherMenu from './LauncherMenu'
import { WebAppLauncher, RemoteAppLauncher } from 'compositor-module'
import Logo from './Logo'
import RunningAppsContainer from './RunningAppsContainer'
import AppLauncherEntry from './AppLauncherEntry'

import gtk3demoIcon from '../store/remote-gtk3-demo/icon.svg'
import simpleWebGLIcon from '../store/simple-web-gl/icon.svg'
import simpleWebGLWebApp from '../store/simple-web-gl/simple-web-gl.js.webapp'
import simpleShmIcon from '../store/simple-web-shm/icon.svg'
import simpleShmWebApp from '../store/simple-web-shm/simple-web-shm.js.webapp'

const styles = {
  root: {
    flexGrow: 0
  },

  grow: {
    flexGrow: 1
  },

  menuButton: {
    marginLeft: -18,
    marginRight: 10
  }
}

const appLauncherEntries = [
  new AppLauncherEntry(
    'remote-gtk3-demo',
    'Remote GTK3 Demo',
    new URL(gtk3demoIcon, window.location.href),
    new URL('ws://localhost:8081'),
    'remote'
  ),
  new AppLauncherEntry(
    'simple-web-gl',
    'Simple Web GL',
    new URL(simpleWebGLIcon, window.location.href),
    new URL(simpleWebGLWebApp, window.location.href),
    'web'
  ),
  new AppLauncherEntry(
    'simple-web-shm',
    'Simple Web SHM',
    new URL(simpleShmIcon, window.location.href),
    new URL(simpleShmWebApp, window.location.href),
    'web'
  )
]

class TopPanel extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      runningAppLauncherEntries: [],
      drawer: false,
      launcherMenuAnchorEl: null
    }
    this.updateTopPanel = () => {
      this.setState(oldState => (
        { runningAppLauncherEntries: appLauncherEntries.filter(appLauncherEntry => appLauncherEntry.client !== null) }
      ))
    }
  }

  componentDidMount () {
    appLauncherEntries.forEach(appLauncherEntry => appLauncherEntry.clientListeners.push(this.updateTopPanel))
  }

  /**
   * @param {boolean}open
   * @private
   */
  _toggleDrawer (open) {
    this.setState(() => ({ drawer: open }))
  }

  /**
   * @param {Event}event
   * @private
   */
  _launcherMenuOpen (event) {
    const launcherMenuAnchorEl = event.currentTarget
    this.setState(() => ({ launcherMenuAnchorEl }))
  }

  _launcherMenuClose () {
    this.setState(() => ({ launcherMenuAnchorEl: null }))
  }

  render () {
    const {
      classes, managedSurfaces, activeManagedSurface, seat,
      webAppLauncher, remoteAppLauncher
    } = this.props

    const { drawer, launcherMenuAnchorEl, runningAppLauncherEntries } = this.state

    return (
      <AppBar className={classes.root} position='static' color='default'>
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color='inherit'
            aria-label='Menu'
            onClick={() => this._toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Logo
            fontSize='1.5rem'
            fontWeight='400'
          />
          <div className={classes.grow}>
            <RunningAppsContainer
              appLauncherEntries={runningAppLauncherEntries}
              managedSurfaces={managedSurfaces}
              activeManagedSurface={activeManagedSurface}
              seat={seat}
            />
          </div>
          <IconButton onClick={(event) => this._launcherMenuOpen(event)}>
            <AppsIcon />
          </IconButton>
        </Toolbar>
        <SettingsDrawer
          open={drawer}
          onClose={() => this._toggleDrawer(false)}
          seat={seat}
          appLauncherEntries={runningAppLauncherEntries}
        />
        <LauncherMenu
          id='launcher-menu'
          appLauncherEntries={appLauncherEntries}
          anchorEl={launcherMenuAnchorEl}
          onClose={() => this._launcherMenuClose()}
          webAppLauncher={webAppLauncher}
          remoteAppLauncher={remoteAppLauncher}
          managedSurfaces={managedSurfaces}
          seat={seat}
        />
      </AppBar>
    )
  }
}

TopPanel.propTypes = {
  classes: PropTypes.object.isRequired,

  seat: PropTypes.object.isRequired,
  activeManagedSurface: PropTypes.instanceOf(ManagedSurface),
  managedSurfaces: PropTypes.arrayOf(ManagedSurface).isRequired,
  webAppLauncher: PropTypes.instanceOf(WebAppLauncher).isRequired,
  remoteAppLauncher: PropTypes.instanceOf(RemoteAppLauncher).isRequired
}

export default withStyles(styles)(TopPanel)
