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
import List from '@material-ui/core/es/List'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/es/ListItem'
import KeyboardIcon from '@material-ui/icons/Keyboard'
import MouseIcon from '@material-ui/icons/Mouse'
import CloseIcon from '@material-ui/icons/Close'
import AppsIcon from '@material-ui/icons/Apps'
import { ListItemText } from '@material-ui/core'
import ListItemIcon from '@material-ui/core/es/ListItemIcon'
import Divider from '@material-ui/core/es/Divider'
import Slider from '@material-ui/core/es/Slider'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Seat from '../../Seat'
import KeymapSettings from './KeymapSettings'
import AppLauncherEntry from '../AppLauncherEntry'
import IconButton from '@material-ui/core/es/IconButton'

const styles = theme => ({
  settingsList: {
    margin: theme.spacing(1),
    minWidth: 360
  },
  spacer: {
    marginTop: theme.spacing(6)
  },
  listItemAction: {
    width: '60%'
  },
  listItemActionControl: {
    width: '100%'
  },
  keymapMenuItem: {
    display: 'flex'
  },
  imageIcon: {
    height: '100%'
  },
  iconRoot: {
    textAlign: 'center'
  }
})

class SettingsDrawer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      scrollSpeed: (props.seat.pointer.scrollFactor * 100)
    }
  }

  /**
   * @param {number}value
   * @private
   */
  _handleScrollSpeedUpdate (value) {
    const scrollSpeed = value
    this.setState(() => {
      return { scrollSpeed }
    })
  }

  /**
   * @param {number}value
   * @param {boolean}commit
   * @private
   */
  _handleScrollSpeedCommit (value) {
    this.props.seat.pointer.scrollFactor = (value / 100)
  }

  _handleScrollSpeedLabelUpdate (value) {
    return `${value}%`
  }

  _closeApplication (appLauncherEntry) {
    if (appLauncherEntry.client) {
      appLauncherEntry.client.close()
    }
  }

  render () {
    const { open, onClose, classes, seat, appLauncherEntries } = this.props
    const { scrollSpeed } = this.state
    return (
      <Drawer
        ModalProps={{
          keepMounted: true
        }}
        open={open}
        onClose={onClose}
      >
        <List className={classes.settingsList}>
          <ListItem>
            <ListItemIcon>
              <KeyboardIcon />
            </ListItemIcon>
            <ListItemText>Keyboard</ListItemText>
          </ListItem>
          <Divider variant='middle' component='li' light />
          <ListItem>
            <ListItemText>Keymap</ListItemText>
            <ListItemSecondaryAction className={classes.listItemAction}>
              <KeymapSettings className={classes.listItemActionControl} keyboard={seat.keyboard} />
            </ListItemSecondaryAction>
          </ListItem>
          <div className={classes.spacer} />
          <ListItem>
            <ListItemIcon>
              <MouseIcon />
            </ListItemIcon>
            <ListItemText>Mouse</ListItemText>
          </ListItem>
          <Divider variant='middle' component='li' light />
          <ListItem>
            <ListItemText>Scroll-speed</ListItemText>
            <ListItemSecondaryAction className={classes.listItemAction}>
              <Slider
                min={10}
                max={200}
                step={10}
                valueLabelDisplay='auto'
                className={classes.listItemActionControl}
                value={scrollSpeed}
                valueLabelFormat={value => this._handleScrollSpeedLabelUpdate(value)}
                onChange={(event, value) => this._handleScrollSpeedUpdate(value)}
                onChangeCommitted={(event, value) => this._handleScrollSpeedCommit(value)}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <div className={classes.spacer} />
          <ListItem>
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText>Task Manager</ListItemText>
          </ListItem>
          <Divider variant='middle' component='li' light />
          {
            appLauncherEntries
              .map(appLauncherEntry => (
                <ListItem key={`${appLauncherEntry.id}`}>
                  <ListItemIcon classes={{ root: classes.iconRoot }}>
                    <img className={classes.imageIcon} src={appLauncherEntry.icon.href} />
                  </ListItemIcon>
                  <ListItemText>{appLauncherEntry.title}</ListItemText>
                  <IconButton onClick={() => this._closeApplication(appLauncherEntry)}>
                    <CloseIcon />
                  </IconButton>
                </ListItem>
              ))
          }
        </List>
      </Drawer>
    )
  }
}

SettingsDrawer.propTypes = {
  classes: PropTypes.object.isRequired,

  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  seat: PropTypes.instanceOf(Seat),
  appLauncherEntries: PropTypes.arrayOf(AppLauncherEntry).isRequired
}

export default withStyles(styles)(SettingsDrawer)
