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

import { withStyles } from '@material-ui/core/styles/index'

import Drawer from '@material-ui/core/es/Drawer'
import MenuList from '@material-ui/core/es/MenuList'
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
