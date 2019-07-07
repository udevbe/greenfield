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

'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles/index'

import AppBar from '@material-ui/core/es/AppBar/index'
import Toolbar from '@material-ui/core/es/Toolbar/index'
import IconButton from '@material-ui/core/es/IconButton/index'

import MenuIcon from '@material-ui/icons/Menu'
import AppsIcon from '@material-ui/icons/Apps'
import AccountCircle from '@material-ui/icons/AccountCircle'

import Seat from '../../Seat'
import ManagedSurface from '../ManagedSurface'

import UserMenu from './UserMenu'
import SettingsDrawer from './SettingsDrawer'
import LauncherMenu from './LauncherMenu'
import WebAppLauncher from '../../WebAppLauncher'
import RemoteAppLauncher from '../../RemoteAppLauncher'
import Logo from './Logo'
import RunningAppsContainer from './RunningAppsContainer'
import auth from '../Auth'
import AppLauncherEntry from '../AppLauncherEntry'

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

class TopPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      appLauncherEntries: [],
      runningAppLauncherEntries: [],
      appLauncherEntriesLoading: false,
      drawer: false,
      userMenuAnchorEl: null,
      launcherMenuAnchorEl: null
    }

    this._snapshotUnsubscribe = null
  }

  async componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.user === prevProps.user) {
      return
    }

    const { user } = this.props
    if (user) {
      this.setState(() => ({ appLauncherEntriesLoading: true }))
      const appLauncherEntriesCollectionRef = auth.app.firestore().collection('users').doc(user.uid).collection('appLauncherEntries')
      this._snapshotUnsubscribe = appLauncherEntriesCollectionRef.onSnapshot(snapshot => this._setAppLauncherEntriesFromFirebaseDocs(snapshot.docs))

      const appLauncherEntriesCollection = await appLauncherEntriesCollectionRef.get()
      // TODO initial data has been fetched, don't show loading state
      this._setAppLauncherEntriesFromFirebaseDocs(appLauncherEntriesCollection.docs)
    }
  }

  /**
   * @param {QueryDocumentSnapshot[]}docs
   * @private
   */
  _setAppLauncherEntriesFromFirebaseDocs (docs) {
    const appLauncherEntries =
      docs.map(doc => {
        const { id, title, icon, url, type } = doc.data()
        return new AppLauncherEntry(id, title, new URL(icon), new URL(url), type)
      })
    appLauncherEntries.forEach(appLauncherEntry => appLauncherEntry.clientListeners.push(() => {
      if (appLauncherEntry.client) {
        this.setState(oldState => ({ runningAppLauncherEntries: [appLauncherEntry, ...oldState.runningAppLauncherEntries] }))
      } else {
        this.setState(oldState => ({ runningAppLauncherEntries: oldState.runningAppLauncherEntries.filter(runningAppLauncherEntry => runningAppLauncherEntry !== appLauncherEntry) }))
      }
    }))

    this.setState(() => ({ appLauncherEntries, appLauncherEntriesLoading: false }))
  }

  componentWillUnmount () {
    if (this._snapshotUnsubscribe) {
      this._snapshotUnsubscribe()
    }
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
  _userMenuOpen (event) {
    const userMenuAnchorEl = event.currentTarget
    this.setState(() => ({ userMenuAnchorEl }))
  }

  _userMenuClose () {
    this.setState(() => ({ userMenuAnchorEl: null }))
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
      classes, managedSurfaces, activeManagedSurface, seat, user,
      webAppLauncher, remoteAppLauncher
    } = this.props
    if (user === null) return null

    const { drawer, userMenuAnchorEl, launcherMenuAnchorEl, appLauncherEntries, runningAppLauncherEntries } = this.state

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
          <IconButton
            aria-owns={userMenuAnchorEl ? 'user-menu' : undefined}
            aria-haspopup='true'
            onClick={(event) => this._userMenuOpen(event)}
            color='inherit'
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
        <UserMenu
          id='user-menu'
          anchorEl={userMenuAnchorEl}
          onClose={() => this._userMenuClose()}
          user={user}
        />
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
          user={user}
          managedSurfaces={managedSurfaces}
          seat={seat}
        />
      </AppBar>
    )
  }
}

TopPanel.propTypes = {
  classes: PropTypes.object.isRequired,

  seat: PropTypes.instanceOf(Seat).isRequired,
  activeManagedSurface: PropTypes.instanceOf(ManagedSurface),
  managedSurfaces: PropTypes.arrayOf(ManagedSurface).isRequired,
  user: PropTypes.object,
  webAppLauncher: PropTypes.instanceOf(WebAppLauncher).isRequired,
  remoteAppLauncher: PropTypes.instanceOf(RemoteAppLauncher).isRequired
}

export default withStyles(styles)(TopPanel)
