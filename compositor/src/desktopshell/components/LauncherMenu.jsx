'use strict'

import React from 'react'

import PropTypes from 'prop-types'
import Menu from '@material-ui/core/es/Menu'
import { withStyles } from '@material-ui/core/es/styles'
import GridList from '@material-ui/core/es/GridList'
import GridListTile from '@material-ui/core/es/GridListTile'
import Typography from '@material-ui/core/es/Typography'
import ButtonBase from '@material-ui/core/es/ButtonBase'

const appLaunchers = [
  {
    title: 'Simple Web SHM',
    imageURL: ''
  },
  {
    title: 'Simple Web GL',
    imageURL: ''
  }
]

const styles = theme => ({
  gridListTile: {
    minHeight: 200,
    minWidth: 200,
    maxHeight: 200,
    maxWidth: 200
  },
  // Below style shamelessly copied from https://material-ui.com/demos/buttons/
  image: {
    position: 'relative',
    height: 200,
    [theme.breakpoints.down('xs')]: {
      width: '100% !important', // Overrides inline-style
      height: 100
    },
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
  render () {
    const { classes, onClose, anchorEl, id } = this.props

    return (
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        disableAutoFocusItem
      >
        {/* TODO dynamically add application launcher entries based on logged in user */}
        <GridList cellHeight='auto' cols={6} spacing={16}>
          {appLaunchers.map(appLauncher => (
            <GridListTile className={classes.gridListTile}>
              <ButtonBase
                onClick={onClose}
                focusRipple
                key={appLauncher.title}
                className={classes.image}
                focusVisibleClassName={classes.focusVisible}
                style={{
                  width: '100%'
                }}
              >
                <span
                  className={classes.imageSrc}
                  style={{
                    backgroundImage: `url(${appLauncher.imageURL})`
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
                    {appLauncher.title}
                    <span className={classes.imageMarked} />
                  </Typography>
                </span>
              </ButtonBase>
            </GridListTile>
          ))}
        </GridList>
      </Menu>
    )
  }
}

LauncherMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default withStyles(styles)(LauncherMenu)
