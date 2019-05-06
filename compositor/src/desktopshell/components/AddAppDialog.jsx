'use strict'

import React from 'react'
import Dialog from '@material-ui/core/es/Dialog'
import DialogTitle from '@material-ui/core/es/DialogTitle'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import DialogActions from '@material-ui/core/es/DialogActions'
import Button from '@material-ui/core/es/Button'
import DialogContent from '@material-ui/core/es/DialogContent'
import DialogContentText from '@material-ui/core/es/DialogContentText'

import auth from '../Auth'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import Slide from '@material-ui/core/es/Slide'

function SlideUp (props) {
  return <Slide direction='up' {...props} />
}

class AddAppDialog extends React.Component {
  constructor (props) {
    super(props)
  }

  async _addAppLauncherFile (event) {
    // TODO sanitize file input (size, format, ...)
    // TODO show read progress
    const fileReader = new window.FileReader()
    fileReader.readAsText(event.target.files[0])
    // TODO handle json parsing failure
    const appEntry = await new Promise(resolve => { fileReader.onload = () => resolve(JSON.parse(/** @type{string} */fileReader.result)) })
    await this._addAppLauncherEntry(appEntry)
  }

  /**
   * @param {{id: string, title: string, url: string, icon: string, type: 'web'|'remote'}}appLauncherEntry
   * @private
   */
  async _addAppLauncherEntry (appLauncherEntry) {
    const { appAddClose, user } = /** @type {{appAddClose: function():void, user: firebase.User}} */this.props
    if (user) {
      const userDocRef = auth.app.firestore().collection('users').doc(user.uid)
      const appLaunchersEntriesCollectionRef = userDocRef.collection('appLauncherEntries')
      const appLauncherEntryDocRef = appLaunchersEntriesCollectionRef.doc(appLauncherEntry.id)

      await auth.app.firestore().runTransaction(async transaction => {
        const appLauncherEntryDocSnapshot = await transaction.get(appLauncherEntryDocRef)
        if (appLauncherEntryDocSnapshot.exists) {
          // TODO ask user for update confirmation
          transaction.update(appLauncherEntryDocRef, appLauncherEntry)
        } else {
          transaction.set(appLauncherEntryDocRef, appLauncherEntry)
        }
      })
    }
    if (appLauncherEntry.type === 'web') {
      // TODO download web app
      // TODO show download progress
      // TODO cache web app
    }

    appAddClose()
  }

  render () {
    const { appAddClose, ...rest } = this.props
    return (
      <Dialog
        aria-labelledby='add-application-title'
        onEscapeKeyDown={() => appAddClose()}
        TransitionComponent={SlideUp}
        {...rest} >
        <DialogTitle id='add-application-title'>Link Application</DialogTitle>
        <DialogContent>
          <DialogContentText
            paragraph
          >
            Upload an application link to couple it to your account.
          </DialogContentText>
          <DialogContentText
            paragraph
          >
            Linked application can be removed at any time in the application menu.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => appAddClose()} color='primary' autoFocus>
              Cancel
          </Button>
          <input
            accept='application/json'
            multiple={false}
            type='file'
            id='app-entry-launcher-button'
            style={{ display: 'none' }}
            onChange={(event) => this._addAppLauncherFile(event)}
          />
          <label htmlFor='app-entry-launcher-button'>
            <Button component='span'>
              <CloudUploadIcon />
            </Button>
          </label>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withMobileDialog()(AddAppDialog)
