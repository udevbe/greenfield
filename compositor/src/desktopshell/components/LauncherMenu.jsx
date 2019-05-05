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
import auth from '../Auth'
import Grid from '@material-ui/core/es/Grid'
import AddAppDialog from './AddAppDialog'
import Button from '@material-ui/core/es/Button'
import Fade from '@material-ui/core/es/Fade'
import RemoveAppDialog from './RemoveAppDialog'

const MAX_GRID_ITEMS_H = 3
const GRID_ITEM_SIZE = 70
const GRID_ITEM_MARGIN = 20

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
    margin: 10,
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
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit + 6}px`,
    opacity: 0,
    transition: theme.transitions.create('opacity'),
    textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
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
    margin: 12,
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

class LauncherMenu extends React.Component {
  constructor (props) {
    super(props)
    /**
     * @type {{mode: 'launch'|'edit', appLauncherEntries: Array<{id: string, title: string, icon: string, url: string}>, appAdd: boolean}}
     */
    this.state = {
      // TODO show loading state until appLaunchers have been fetched from the remote db
      appLauncherEntries: [],
      appAdd: false,
      appToRemove: null,
      mode: 'launch'
    }

    this._snapshotUnsubscribe = null
  }

  async componentDidMount () {
    const { user } = this.props
    if (user) {
      const appLauncherEntriesCollectionRef = auth.app.firestore().collection('users').doc(user.uid).collection('appLauncherEntries')
      this._snapshotUnsubscribe = appLauncherEntriesCollectionRef.onSnapshot(snapshot => this._setAppLauncherEntriesFromDocs(snapshot.docs))

      const appLauncherEntriesCollection = await appLauncherEntriesCollectionRef.get()
      // TODO initial data has been fetched, don't show loading state
      this._setAppLauncherEntriesFromDocs(appLauncherEntriesCollection.docs)
    }
  }

  componentWillUnmount () {
    if (this._snapshotUnsubscribe) {
      this._snapshotUnsubscribe()
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

  _setAppLauncherEntriesFromDocs (docs) {
    const appLauncherEntries = /** @type {Array<{id: string, title: string, icon: string, url: string, type: 'web'|'remote'}>} */ docs.map(doc => doc.data())
    this.setState((oldState) => ({ appLauncherEntries, mode: appLauncherEntries.length ? oldState.mode : 'launch' }))
  }

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

  /**
   * @param {{url: string, type: 'web'|'remote'}} appLauncherEntry
   * @private
   */
  _onAppLauncherClick (appLauncherEntry) {
    const { mode } = this.state
    if (mode === 'launch') {
      const { onClose, webAppLauncher } = this.props
      // TODO show waiting icon on launcher tile until app is dld & launched
      webAppLauncher.launch(appLauncherEntry.url)
      onClose()
    }
    // TODO ask user for conformation
    // TODO stop app if it's running
    // TODO delete entry from db
    // TODO clear app cache
  }

  render () {
    const { classes, anchorEl, id, user } = this.props
    // TODO interpret mode and show additional icons w/action per entry
    const { mode, appLauncherEntries, appAdd, appToRemove } =
      /** @type {{mode: 'launch'|'edit', appLauncherEntries: Array<{id: string, title: string, icon: string, url: string, type: 'web'|'remote'}>, appAdd: boolean, appToRemove: string|null}} */
      this.state

    let gridContent = null
    if (appLauncherEntries.length) {
      gridContent = appLauncherEntries.map(appLauncherEntry => (
        <Grid item className={classes.gridItem} key={appLauncherEntry.url}>
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
                variant='subtitle1'
                color='inherit'
                className={classes.imageTitle}
              >
                {appLauncherEntry.title}
              </Typography>
            </span>
          </ButtonBase>
          <Fade in={mode === 'edit'} mountOnEnter unmountOnExit>
            <Fab
              className={classes.imageDeleteIcon}
              color='primary'
              onClick={() => this._appRemoveOpen(appLauncherEntry)}
            >
              <DeleteIcon />
            </Fab>
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
          <Fab
            color='primary'
            size='small'
            aria-label='Add'
            className={classes.fab}
            onClick={() => this._appAddOpen()}
          >
            <AddIcon />
          </Fab>
        </Fade>
        <Fade in={mode === 'launch'} mountOnEnter unmountOnExit>
          <Fab
            size='small'
            aria-label='Edit'
            className={classes.fab}
            onClick={() => this._launcherEditBegin()}
          >
            <EditIcon />
          </Fab>
        </Fade>
        <Fade in={mode === 'edit'} mountOnEnter unmountOnExit>
          <Button
            mini
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
  user: PropTypes.object
}

export default withStyles(styles)(LauncherMenu)
