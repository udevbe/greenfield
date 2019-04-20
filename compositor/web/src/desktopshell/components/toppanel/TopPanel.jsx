import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/es/AppBar'
import Toolbar from '@material-ui/core/es/Toolbar'

const styles = {
  root: {
    flexGrow: 0
  }
}

const TopPanel = React.memo((props) => {
  const { classes } = props
  return (
    <div className={classes.root}>
      <AppBar position='static' color='default'>
        <Toolbar variant={'dense'}>
          {props.children}
        </Toolbar>
      </AppBar>
    </div>
  )
})

TopPanel.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(TopPanel)
