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
import Menu from '@material-ui/core/es/Menu'
import MenuItem from '@material-ui/core/es/MenuItem'
import SvgIcon from '@material-ui/core/es/SvgIcon'
import ListItemText from '@material-ui/core/es/ListItemText'
import Avatar from '@material-ui/core/es/Avatar'
import ListItemAvatar from '@material-ui/core/es/ListItemAvatar'

import auth from '../Auth'
import Typography from '@material-ui/core/es/Typography'
import ListItem from '@material-ui/core/es/ListItem'
import Divider from '@material-ui/core/es/Divider/'

const styles = {
  avatar: {
    margin: 10
  },
  noFocus: {
    outlineStyle: 'none',
    boxShadow: 'none',
    borderColor: 'transparent'
  }
}

class UserMenu extends React.Component {
  _handleLogout () {
    const { onClose } = this.props

    auth.signOut()
    onClose()
  }

  render () {
    const { classes, id, anchorEl, onClose, user } = this.props
    if (user === null) return null

    const displayName = user.isAnonymous ? 'Anonymous User' : user.displayName
    let avatar = null
    if (user.isAnonymous) {
      avatar =
        <Avatar className={classes.avatar}>
          {'AU'}
        </Avatar>
    } else if (user.photoURL === null) {
      avatar =
        <Avatar className={classes.avatar}>
          {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'User'}
        </Avatar>
    } else {
      avatar =
        <Avatar className={classes.avatar} src={user.photoURL} />
    }

    return (
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        disableAutoFocusItem
      >
        <ListItem className={classes.noFocus}>
          <ListItemAvatar>
            {avatar}
          </ListItemAvatar>
          <ListItemText classes={{ primary: classes.primary }} inset primary={displayName} />
        </ListItem>
        <Divider />
        {/* <MenuItem onClick={this.handleClose}>Profile</MenuItem> */}
        {/* <MenuItem onClick={this.handleClose}>My account</MenuItem> */}
        <MenuItem onClick={() => this._handleLogout()}>
          <SvgIcon>
            <path
              d={'M19,3 C20.11,3 21,3.9 21,5 L21,8 L19,8 L19,5 L5,5 L5,19 L19,19 L19,16 L21,16 L21,19 C21,20.1 20.11,21 19,21 L5,21 C3.9,21 3,20.1 3,19 L3,5 C3,3.9 3.9,3 5,3 L19,3 Z M15.5,17 L20.5,12 L15.5,7 L14.09,8.41 L16.67,11 L7,11 L7,13 L16.67,13 L14.09,15.59 L15.5,17 Z'}
            />
          </SvgIcon>
          <ListItemText
            primary={
              <React.Fragment>
                <Typography component='span' color='textPrimary'>
                Log Out
                </Typography>
              </React.Fragment>
            }
          />
        </MenuItem>
      </Menu>
    )
  }
}

UserMenu.propTypes = {
  classes: PropTypes.object.isRequired,

  id: PropTypes.string.isRequired,
  userMenuAnchorEl: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object
}

export default withStyles(styles)(UserMenu)
