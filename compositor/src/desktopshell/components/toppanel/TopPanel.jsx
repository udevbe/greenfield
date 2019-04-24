import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/es/AppBar'
import Toolbar from '@material-ui/core/es/Toolbar'
import IconButton from '@material-ui/core/es/IconButton'
import Drawer from '@material-ui/core/es/Drawer'
import Divider from '@material-ui/core/es/Divider/Divider'
import Avatar from '@material-ui/core/es/Avatar'
import Menu from '@material-ui/core/es/Menu'
import MenuList from '@material-ui/core/es/MenuList/MenuList'
import MenuItem from '@material-ui/core/es/MenuItem/MenuItem'
import ListItemText from '@material-ui/core/es/ListItemText'
import SvgIcon from '@material-ui/core/es/SvgIcon'

import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'

import EntriesContainer from '../entriescontainer/EntriesContainer.jsx'
import Seat from '../../../Seat'
import ManagedSurface from '../desktopusershell/ManagedSurface'

import auth from '../../Auth'

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
  },

  avatar: {
    margin: 10
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

  _handleLogout () {
    auth.signOut()
    this._userMenuClose()
  }

  _userMenuClose () {
    this.setState(() => ({ anchorEl: null }))
  }

  render () {
    const { classes, managedSurfaces, activeManagedSurface, seat, user } = this.props
    if (user === null) return null

    const { drawer, anchorEl } = this.state

    const dislayName = user.isAnonymous ? 'Anonymous User' : user.displayName
    let avatar = null
    if (user.isAnonymous) {
      avatar =
        <Avatar className={classes.avatar}>
          {'AU'}
        </Avatar>
    } else if (user.photoURL === null) {
      avatar =
        <Avatar className={classes.avatar}>
          {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
        </Avatar>
    } else {
      avatar =
        <Avatar className={classes.avatar} src={user.photoURL} />
    }

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
          <IconButton
            aria-owns={anchorEl ? 'user-menu' : undefined}
            aria-haspopup='true'
            onClick={(event) => this._userMenuOpen(event)}
            color='inherit'
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id='user-menu'
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => this._userMenuClose()}
            modal
          >
            {/* <MenuItem onClick={this.handleClose}>Profile</MenuItem> */}
            {/* <MenuItem onClick={this.handleClose}>My account</MenuItem> */}
            <MenuItem onClick={() => this._handleLogout()}>
              <SvgIcon>
                <path
                  d={'M19,3 C20.11,3 21,3.9 21,5 L21,8 L19,8 L19,5 L5,5 L5,19 L19,19 L19,16 L21,16 L21,19 C21,20.1 20.11,21 19,21 L5,21 C3.9,21 3,20.1 3,19 L3,5 C3,3.9 3.9,3 5,3 L19,3 Z M15.5,17 L20.5,12 L15.5,7 L14.09,8.41 L16.67,11 L7,11 L7,13 L16.67,13 L14.09,15.59 L15.5,17 Z'}
                />
              </SvgIcon>
            </MenuItem>
          </Menu>
        </Toolbar>
        <Drawer open={drawer} onClose={() => this._toggleDrawer(false)}>
          <MenuList>
            <MenuItem>
              {avatar}
              <ListItemText classes={{ primary: classes.primary }} inset primary={dislayName} />
            </MenuItem>
          </MenuList>
          <Divider />
        </Drawer>
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
