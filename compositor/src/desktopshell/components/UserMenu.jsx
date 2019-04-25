'use strict'

import React from 'react'
import Menu from '@material-ui/core/es/Menu'
import MenuItem from '@material-ui/core/es/MenuItem'
import SvgIcon from '@material-ui/core/es/SvgIcon'
import auth from '../Auth'

class UserMenu extends React.Component {
  _handleLogout () {
    const { onClose } = this.props

    auth.signOut()
    onClose()
  }

  render () {
    const { id, anchorEl, onClose } = this.props
    return (
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        modal={'true'}
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
    )
  }
}

export default UserMenu
