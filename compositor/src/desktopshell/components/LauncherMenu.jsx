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

import Menu from '@material-ui/core/es/Menu'
import { withStyles } from '@material-ui/core/es/styles'
import Typography from '@material-ui/core/es/Typography'
import ButtonBase from '@material-ui/core/es/ButtonBase'
import Fab from '@material-ui/core/es/Fab'

import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Close'

import WebAppLauncher from '../../WebAppLauncher'
import Grid from '@material-ui/core/es/Grid'
import AddAppDialog from './AddAppDialog'
import Button from '@material-ui/core/es/Button'
import Fade from '@material-ui/core/es/Fade'
import RemoveAppDialog from './RemoveAppDialog'
import Tooltip from '@material-ui/core/es/Tooltip/Tooltip'
import RemoteAppLauncher from '../../RemoteAppLauncher'
import AppLauncherEntry from '../AppLauncherEntry'
import ManagedSurface from '../ManagedSurface'
import Seat from '../../Seat'

const MAX_GRID_ITEMS_H = 3
const GRID_ITEM_SIZE = 48
const GRID_ITEM_MARGIN = 25

const styles = theme => ({
  gridContainer: {
    overflow: 'visible',
    marginLeft: 15,
    marginTop: 15
  },
  gridItem: {
    margin: GRID_ITEM_MARGIN,
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE
  },
  fab: {
    margin: 20,
    bottom: GRID_ITEM_MARGIN,
    right: GRID_ITEM_MARGIN,
    marginRight: GRID_ITEM_MARGIN,
    position: 'sticky',
    display: 'block',
    float: 'right',
    zIndex: 5
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'relative',
    '&:hover': {
      '& $imageTitle': {
        opacity: 1
      }
    }
  },
  imageButton: {
    position: 'absolute',
    left: -GRID_ITEM_MARGIN,
    right: -GRID_ITEM_MARGIN,
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.palette.secondary.main
    },
    bottom: -GRID_ITEM_MARGIN,
    color: theme.palette.common.white
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%'
  },
  imageTitle: {
    position: 'relative',
    opacity: 0,
    transition: theme.transitions.create('opacity'),
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    [theme.breakpoints.down('sm')]: {
      opacity: 1
    },
    zIndex: 3
  },
  imageDeleteIcon: {
    position: 'relative',
    width: 40,
    height: 40,
    top: -(GRID_ITEM_SIZE + GRID_ITEM_MARGIN),
    left: -20,
    zIndex: 4
  },
  editDoneButton: {
    margin: 26,
    padding: '6px 6px',
    bottom: GRID_ITEM_MARGIN,
    left: GRID_ITEM_MARGIN,
    marginLeft: GRID_ITEM_MARGIN,
    marginRight: 10,
    position: 'sticky',
    display: 'block',
    float: 'left',
    zIndex: 5
  }
})

class LauncherMenu extends React.PureComponent {
  constructor (props) {
    super(props)
    /**
     * @type {{mode: 'launch'|'edit'|'loading', appAdd: boolean}}
     */
    this.state = {
      appAdd: false,
      appToRemove: null,
      mode: 'launch'
    }
  }

  _launcherEditBegin () {
    this.setState(() => ({ mode: 'edit' }))
  }

  _launcherEditEnd () {
    this.setState(() => ({ mode: 'launch' }))
  }

  _launcherMenuClose () {
    const { onClose } = this.props
    this._launcherEditEnd()
    onClose()
  }

  /**
   * @param {AppLauncherEntry}appLauncherEntry
   * @private
   */
  _appRemoveOpen (appLauncherEntry) {
    this.setState(() => ({ appToRemove: appLauncherEntry }))
  }

  _appRemoveClose () {
    this.setState(() => ({ appToRemove: null }))
  }

  _appAddOpen () {
    this.setState(() => ({ appAdd: true }))
  }

  _appAddClose () {
    this.setState(() => ({ appAdd: false }))
  }

  async _launchWebApp (appLauncherEntry) {
    const { onClose, webAppLauncher, managedSurfaces, seat } = this.props
    if (appLauncherEntry.client) {
      const clientManagedSurface = managedSurfaces.find(managedSurface => managedSurface.surface.resource.client === appLauncherEntry.client)
      if (clientManagedSurface) {
        clientManagedSurface.requestActivation()
        seat.pointer.session.flush()
      }
    } else {
      // TODO show waiting icon on launcher tile until app is dld & launched
      // TODO show download progress bar if webapp needs to be downloaded first
      const client = await webAppLauncher.launch(appLauncherEntry.app)
      if (client) {
        // TODO give subtle indication in launcher menu that app is running
        appLauncherEntry.client = client
        // TODO remove subtle indication in launcher menu that app is running
        client.onClose().then(() => { appLauncherEntry.client = null })
      }
    }
    onClose()
  }

  async _launchRemoteApp (appLauncherEntry) {
    const { onClose, remoteAppLauncher, managedSurfaces, seat } = this.props
    if (appLauncherEntry.client) {
      const clientManagedSurface = managedSurfaces.find(managedSurface => managedSurface.surface.resource.client === appLauncherEntry.client)
      if (clientManagedSurface) {
        clientManagedSurface.requestActivation()
        seat.pointer.session.flush()
      }
    } else {
      // TODO show waiting icon on launcher tile until app connected
      const client = await remoteAppLauncher.launch(appLauncherEntry.app, appLauncherEntry.id)
      if (client) {
        // TODO give subtle indication in launcher menu that app is running
        appLauncherEntry.client = client
        // TODO remove subtle indication in launcher menu that app is running
        client.onClose().then(() => { appLauncherEntry.client = null })
      }
    }
    onClose()
  }

  /**
   * @param {AppLauncherEntry} appLauncherEntry
   * @private
   */
  async _onAppLauncherClick (appLauncherEntry) {
    const { mode } = this.state

    if (mode === 'launch' && appLauncherEntry.type === 'web') {
      await this._launchWebApp(appLauncherEntry)
    } else if (mode === 'launch' && appLauncherEntry.type === 'remote') {
      await this._launchRemoteApp(appLauncherEntry)
    }
  }

  render () {
    const { classes, anchorEl, id, user, appLauncherEntries } = this.props
    // TODO interpret mode and show additional icons w/action per entry
    const { mode, appAdd, appToRemove } =
      /** @type {{mode: 'launch'|'edit', appAdd: boolean, appToRemove: string|null}} */
      this.state

    let gridContent = null
    if (appLauncherEntries.length) {
      gridContent = appLauncherEntries.map(appLauncherEntry => (
        <Grid item className={classes.gridItem} key={appLauncherEntry.app.href}>
          <ButtonBase
            onClick={() => this._onAppLauncherClick(appLauncherEntry)}
            focusRipple
            key={appLauncherEntry.title}
            className={classes.image}
          >
            <span
              className={classes.imageSrc}
              style={{
                backgroundImage: `url(${appLauncherEntry.icon})`
              }}
            />
            <span className={classes.imageButton}>
              <Typography
                component='span'
                variant='caption'
                color='inherit'
                noWrap
                className={classes.imageTitle}
              >
                {appLauncherEntry.title}
              </Typography>
            </span>
          </ButtonBase>
          <Fade in={mode === 'edit'} mountOnEnter unmountOnExit>
            <Tooltip title='Delete' enterDelay={500}>
              <Fab
                className={classes.imageDeleteIcon}
                color='primary'
                onClick={() => this._appRemoveOpen(appLauncherEntry)}
              >
                <DeleteIcon />
              </Fab>
            </Tooltip>
          </Fade>
        </Grid>
      ))
    } else {
      gridContent = <Typography
        align='center'
        style={{
          minHeight: GRID_ITEM_SIZE + (2 * GRID_ITEM_MARGIN),
          minWidth: ((GRID_ITEM_SIZE + 2 * GRID_ITEM_MARGIN) * MAX_GRID_ITEMS_H),
          padding: 16
        }}
      >
          No applications linked. Press the '+' button to link an application.
      </Typography>
    }

    return (
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onEscapeKeyDown={() => this._launcherMenuClose()}
        onClose={() => this._launcherMenuClose()}
        disableAutoFocusItem
        className={classes.menu}
        MenuListProps={{ disablePadding: true }}
        PaperProps={{
          style: {
            maxHeight: '85%', // (GRID_ITEM_SIZE + 2 * GRID_ITEM_MARGIN) * (MAX_GRID_ITEMS_V),
            minWidth: ((GRID_ITEM_SIZE + 2 * GRID_ITEM_MARGIN) * MAX_GRID_ITEMS_H) + 30,
            maxWidth: ((GRID_ITEM_SIZE + 2 * GRID_ITEM_MARGIN) * MAX_GRID_ITEMS_H) + 30,
            paddingRight: 15
          }
        }}
      >
        {/* TODO dynamically add application launcher entries based on logged in user */}
        <Grid container className={classes.gridContainer} spacing={0}>
          {gridContent}
        </Grid>

        <Fade in={mode === 'launch'} mountOnEnter unmountOnExit>
          <Tooltip title='Add' enterDelay={500}>
            <Fab
              color='primary'
              size='medium'
              aria-label='Add'
              className={classes.fab}
              onClick={() => this._appAddOpen()}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Fade>
        <Fade in={mode === 'launch'} mountOnEnter unmountOnExit>
          <Tooltip title='Edit' enterDelay={500}>
            <Fab
              size='medium'
              aria-label='Edit'
              className={classes.fab}
              onClick={() => this._launcherEditBegin()}
            >
              <EditIcon />
            </Fab>
          </Tooltip>
        </Fade>
        <Fade in={mode === 'edit'} mountOnEnter unmountOnExit>
          <Button
            className={classes.editDoneButton}
            variant='contained'
            onClick={() => this._launcherEditEnd()}
          >
          Done
          </Button>
        </Fade>
        <AddAppDialog
          open={appAdd}
          appAddClose={() => this._appAddClose()}
          user={user}
        />
        {appToRemove &&
        <RemoveAppDialog
          open
          appToRemove={appToRemove}
          appRemoveClose={() => this._appRemoveClose()}
          user={user}
        />}
      </Menu>
    )
  }
}

LauncherMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
  webAppLauncher: PropTypes.instanceOf(WebAppLauncher).isRequired,
  remoteAppLauncher: PropTypes.instanceOf(RemoteAppLauncher).isRequired,
  user: PropTypes.object,
  managedSurfaces: PropTypes.arrayOf(ManagedSurface).isRequired,
  seat: PropTypes.instanceOf(Seat).isRequired
}

export default withStyles(styles)(LauncherMenu)
