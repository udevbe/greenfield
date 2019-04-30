'use strict'

import React from 'react'
import Dialog from '@material-ui/core/es/Dialog'
import DialogTitle from '@material-ui/core/es/DialogTitle'
import TextField from '@material-ui/core/es/TextField'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import DialogActions from '@material-ui/core/es/DialogActions'
import Button from '@material-ui/core/es/Button'
import DialogContent from '@material-ui/core/es/DialogContent'
import DialogContentText from '@material-ui/core/es/DialogContentText'

class AddApplicationDialog extends React.Component {
  _addApp () {
    const { appAddClose } = this.props
    // TODO add app based on URL

    appAddClose()
  }

  render () {
    const { appAddClose, ...rest } = this.props
    return (
      <Dialog aria-labelledby='add-application-title' {...rest}>
        <DialogTitle id='add-application-title'>Add Application</DialogTitle>
        <DialogContent>
          <DialogContentText>
              To add an application, please enter the application URL here. The application will be automatically coupled to your account.
            The application can be removed at any time in the application menu.
          </DialogContentText>
          <TextField
            autoFocus
            margin='normal'
            id='application-url'
            label='Application URL'
            type='url'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => appAddClose()} color='primary' autoFocus>
              Cancel
          </Button>
          <Button onClick={() => this._addApp()} color='primary'>
              Add
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withMobileDialog()(AddApplicationDialog)
