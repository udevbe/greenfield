'use strict'

import React from 'react'

import { withStyles } from '@material-ui/core/styles/index'

import Drawer from '@material-ui/core/es/Drawer'
import MenuList from '@material-ui/core/es/MenuList'
import MenuItem from '@material-ui/core/es/MenuItem'
import ListItemText from '@material-ui/core/es/ListItemText'
import Divider from '@material-ui/core/es/Divider'
import Avatar from '@material-ui/core/es/Avatar'
import PropTypes from 'prop-types'

const styles = {
  avatar: {
    margin: 10
  }
}

class SettingsDrawer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      drawer: false
    }
  }

  render () {
    const { classes, open, onClose, user } = this.props
    if (user === null) return null

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
          {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'User'}
        </Avatar>
    } else {
      avatar =
        <Avatar className={classes.avatar} src={user.photoURL} />
    }

    return (
      <Drawer open={open} onClose={onClose}>
        <MenuList>
          <MenuItem>
            {avatar}
            <ListItemText classes={{ primary: classes.primary }} inset primary={dislayName} />
          </MenuItem>
        </MenuList>
        <Divider />
      </Drawer>
    )
  }
}

SettingsDrawer.propTypes = {
  classes: PropTypes.object.isRequired,

  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object
}

export default withStyles(styles)(SettingsDrawer)
