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

import WebAppLauncher from '../../WebAppLauncher'
import auth from '../Auth'
import Grid from '@material-ui/core/es/Grid'

// TODO remove dummy app launchers once apps are stored in user profile
const demoAppLauncherEntries = [
  {
    title: 'Simple Web SHM',
    imageURL: `https://picsum.photos/100?dummy=${Math.random()}`,
    appURL: `${window.location.href}clients/simple.web.shm.js`
  },
  {
    title: 'Simple Web GL',
    imageURL: `https://picsum.photos/100?dummy=${Math.random()}`,
    appURL: `${window.location.href}clients/simple.web.gl.js`
  },
  {
    title: 'Simple Web SHM',
    imageURL: `https://picsum.photos/100?dummy=${Math.random()}`,
    appURL: `${window.location.href}clients/simple.web.shm.js`
  },
  {
    title: 'Simple Web GL',
    imageURL: `https://picsum.photos/100?dummy=${Math.random()}`,
    appURL: `${window.location.href}clients/simple.web.gl.js`
  },

  {
    title: 'Simple Web GL',
    imageURL: `https://picsum.photos/100?dummy=${Math.random()}`,
    appURL: `${window.location.href}clients/simple.web.gl.js`
  },
  {
    title: 'Simple Web SHM',
    imageURL: `https://picsum.photos/100?dummy=${Math.random()}`,
    appURL: `${window.location.href}clients/simple.web.shm.js`
  },
  {
    title: 'Simple Web GL',
    imageURL: `https://picsum.photos/100?dummy=${Math.random()}`,
    appURL: `${window.location.href}clients/simple.web.gl.js`
  },

  {
    title: 'Simple Web GL',
    imageURL: `https://picsum.photos/100?dummy=${Math.random()}`,
    appURL: `${window.location.href}clients/simple.web.gl.js`
  },
  {
    title: 'Simple Web SHM',
    imageURL: `https://picsum.photos/100?dummy=${Math.random()}`,
    appURL: `${window.location.href}clients/simple.web.shm.js`
  },
  {
    title: 'Simple Web GL',
    imageURL: `https://picsum.photos/100?dummy=${Math.random()}`,
    appURL: `${window.location.href}clients/simple.web.gl.js`
  },

  {
    title: 'Simple Web GL',
    imageURL: `https://picsum.photos/100?dummy=${Math.random()}`,
    appURL: `${window.location.href}clients/simple.web.gl.js`
  },
  {
    title: 'Simple Web SHM',
    imageURL: `https://picsum.photos/100?dummy=${Math.random()}`,
    appURL: `${window.location.href}clients/simple.web.shm.js`
  },
  {
    title: 'Simple Web GL',
    imageURL: `https://picsum.photos/100?dummy=${Math.random()}`,
    appURL: `${window.location.href}clients/simple.web.gl.js`
  }
]

const styles = theme => ({
  gridContainer: {
    overflow: 'visible'
  },
  gridItem: {
    margin: 10,
    width: 100,
    height: 100
  },
  fabAdd: {
    bottom: 10,
    right: 10,
    margin: 10,
    position: 'sticky',
    display: 'block',
    float: 'right'
  },
  // Below style shamelessly copied from https://material-ui.com/demos/buttons/
  image: {
    height: '100%',
    position: 'relative',
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.15
      },
      '& $imageMarked': {
        opacity: 0
      }
    }
  },
  focusVisible: {},
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
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity')
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit + 6}px`
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity')
  }
})

class LauncherMenu extends React.Component {
  constructor (props) {
    super(props)
    const { user } = props
    this.state = { applicationLauncherEntries: [] }
    if (user) {
      auth.app.firestore().collection('applicationLauncherEntries').doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          const applicationLauncherEntries = /** @type {Array<{title: string, imageURL: string, appURL: string}>} */ doc.data()
          this.setState(() => ({ applicationLauncherEntries }))
        }
      })
    }
  }

  _onAppLauncherClick (appLauncherEntry) {
    const { onClose, webAppLauncher } = this.props
    // TODO show waiting icon on launcher tile until app is dld & launched
    webAppLauncher.launch(appLauncherEntry.appURL)
    onClose()
  }

  render () {
    const { classes, onClose, anchorEl, id } = this.props
    const { applicationLauncherEntries } =
      /** @type {{applicationLauncherEntries: Array<{title: string, imageURL: string, appURL: string}>}} */
      this.state

    return (
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        disableAutoFocusItem
        className={classes.menu}
        MenuListProps={{ disablePadding: true }}
      >
        {/* TODO dynamically add application launcher entries based on logged in user */}
        <Grid container className={classes.gridContainer} spacing='0'>
          {demoAppLauncherEntries.map(appLauncherEntry => (
            <Grid item className={classes.gridItem}>
              <ButtonBase
                onClick={() => this._onAppLauncherClick(appLauncherEntry)}
                focusRipple
                key={appLauncherEntry.title}
                className={classes.image}
                focusVisibleClassName={classes.focusVisible}
                style={{ width: '100%' }}
              >
                <span
                  className={classes.imageSrc}
                  style={{
                    backgroundImage: `url(${appLauncherEntry.imageURL})`
                  }}
                />
                <span className={classes.imageBackdrop} />
                <span className={classes.imageButton}>
                  <Typography
                    component='span'
                    variant='subtitle1'
                    color='inherit'
                    className={classes.imageTitle}
                  >
                    {appLauncherEntry.title}
                    <span className={classes.imageMarked} />
                  </Typography>
                </span>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
        <Fab color='primary' aria-label='Add' className={classes.fabAdd}>
          <AddIcon />
        </Fab>
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
