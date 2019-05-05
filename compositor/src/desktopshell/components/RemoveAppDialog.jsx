'use strict'

import React from 'react'
import Dialog from '@material-ui/core/es/Dialog'
import DialogTitle from '@material-ui/core/es/DialogTitle'
import DialogContent from '@material-ui/core/es/DialogContent'
import DialogContentText from '@material-ui/core/es/DialogContentText'
import DialogActions from '@material-ui/core/es/DialogActions'
import Button from '@material-ui/core/es/Button'

class RemoveAppDialog extends React.Component {
  _removeApp () {

  }

  render () {
    const { appRemoveClose, ...rest } = this.props
    return (
      <Dialog
        aria-labelledby='remove-application-title'
        maxWidth='sm'
        onEscapeKeyDown={() => appRemoveClose()}
        {...rest} >
        <DialogTitle id='remove-application-title'>Remove Application</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Remove application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => appRemoveClose()} autoFocus>
              Cancel
          </Button>
          <Button
            onClick={() => this._removeApp()}
            color='primary'
          >
              Remove
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default RemoveAppDialog
