'use strict'

import React from 'react'

import { withStyles } from '@material-ui/core/styles/index'

import Drawer from '@material-ui/core/es/Drawer'
import MenuList from '@material-ui/core/es/MenuList'
import MenuItem from '@material-ui/core/es/MenuItem'
import Divider from '@material-ui/core/es/Divider'
import PropTypes from 'prop-types'
import Logo from './Logo'
import ListItem from '@material-ui/core/es/ListItem'

const styles = {
  noFocus: {
    outlineStyle: 'none',
    boxShadow: 'none',
    borderColor: 'transparent'
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
    const { open, onClose, classes } = this.props
    return (
      <Drawer open={open} onClose={onClose}>
        <MenuList>
          <ListItem className={classes.noFocus}>
            <Logo fontSize='2.5rem' />
          </ListItem>
        </MenuList>
        <Divider />
      </Drawer>
    )
  }
}

SettingsDrawer.propTypes = {
  classes: PropTypes.object.isRequired,

  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default withStyles(styles)(SettingsDrawer)
