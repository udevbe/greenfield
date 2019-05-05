'use strict'

import React from 'react'
import Dialog from '@material-ui/core/es/Dialog'
import DialogContent from '@material-ui/core/es/DialogContent'
import DialogContentText from '@material-ui/core/es/DialogContentText'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import DialogActions from '@material-ui/core/es/DialogActions'
import Button from '@material-ui/core/es/Button'
import Slide from '@material-ui/core/es/Slide'
import auth from '../Auth'

function SlideUp (props) {
  return <Slide direction='up' {...props} />
}

class RemoveAppDialog extends React.Component {
  async _removeApp () {
    const { appToRemove: appLauncherEntry, appRemoveClose, user } = this.props
    if (user) {
      const userDocRef = auth.app.firestore().collection('users').doc(user.uid)
      const appLaunchersEntriesCollectionRef = userDocRef.collection('appLauncherEntries')
      const appLauncherEntryDocRef = appLaunchersEntriesCollectionRef.doc(appLauncherEntry.id)

      await auth.app.firestore().runTransaction(async transaction => {
        const appLauncherEntryDocSnapshot = await transaction.get(appLauncherEntryDocRef)
        if (appLauncherEntryDocSnapshot.exists) {
          // TODO ask user for update confirmation
          transaction.delete(appLauncherEntryDocRef)
        } else {
          // TODO notify user app is already removed
        }
      })
    }

    appRemoveClose()
  }

  render () {
    const { appRemoveClose, appToRemove, ...rest } = this.props
    return (
      <Dialog
        TransitionComponent={SlideUp}
        aria-labelledby='remove-application-title'
        maxWidth='sm'
        onEscapeKeyDown={() => appRemoveClose()}
        {...rest} >
        <DialogContent>
          <DialogContentText
            align='center'
            paragraph
            color='primary'
          >
            Remove '{appToRemove.title}'?
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
