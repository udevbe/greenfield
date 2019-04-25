'use strict'

import React from 'react'

import Dialog from '@material-ui/core/es/Dialog'
import DialogTitle from '@material-ui/core/es/DialogTitle'
import PropTypes from 'prop-types'

class LauncherDialog extends React.Component {
  render () {
    const { onClose, open } = this.props

    return (
      <Dialog
        fullWidth
        maxWidth='lg'
        open={open}
        onClose={onClose}
        aria-labelledby='launcher-dialog'
      >
        <DialogTitle id='launcher-dialog'>Applications</DialogTitle>
        {/* TODO add application launcher entries*/}
      </Dialog>
    )
  }
}

LauncherDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default LauncherDialog
