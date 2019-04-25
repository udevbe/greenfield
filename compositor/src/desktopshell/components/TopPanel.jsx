import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles/index'

import AppBar from '@material-ui/core/es/AppBar/index'
import Toolbar from '@material-ui/core/es/Toolbar/index'
import IconButton from '@material-ui/core/es/IconButton/index'

import MenuIcon from '@material-ui/icons/Menu'
import AppsIcon from '@material-ui/icons/Apps'
import AccountCircle from '@material-ui/icons/AccountCircle'

import EntriesContainer from './EntriesContainer'
import Seat from '../../Seat'
import ManagedSurface from '../ManagedSurface'

import UserMenu from './UserMenu'
import SettingsDrawer from './SettingsDrawer'

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
      drawer: false,
      anchorEl: null
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
    const anchorEl = event.currentTarget
    this.setState(() => ({ anchorEl }))
  }

  _userMenuClose () {
    this.setState(() => ({ anchorEl: null }))
  }

  render () {
    const { classes, managedSurfaces, activeManagedSurface, seat, user } = this.props
    if (user === null) return null

    const { drawer, anchorEl } = this.state

    return (
      <AppBar className={classes.root} position='static' color='default'>
        <Toolbar variant={'dense'}>
          <IconButton
            className={classes.menuButton}
            color='inherit'
            aria-label='Menu'
            onClick={() => this._toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <div className={classes.grow}>
            <EntriesContainer
              managedSurfaces={managedSurfaces}
              activeManagedSurface={activeManagedSurface}
              seat={seat}
            />
          </div>
          <IconButton>
            <AppsIcon />
          </IconButton>
          <IconButton
            aria-owns={anchorEl ? 'user-menu' : undefined}
            aria-haspopup='true'
            onClick={(event) => this._userMenuOpen(event)}
            color='inherit'
          >
            <AccountCircle />
          </IconButton>
          <UserMenu
            id='user-menu'
            anchorEl={anchorEl}
            onClose={() => this._userMenuClose()}
          />
        </Toolbar>
        <SettingsDrawer
          open={drawer}
          onClose={() => this._toggleDrawer(false)}
          user={user}
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
  user: PropTypes.object
}

export default withStyles(styles)(TopPanel)
