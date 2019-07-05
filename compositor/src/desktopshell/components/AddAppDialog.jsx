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
import PropTypes from 'prop-types'

class SlideUp extends React.Component {
  render () {
    return <Slide direction='up' {...this.props} />
  }
}

class AddAppDialog extends React.Component {
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
      // TODO implement service worker & let service worker download  & cache web app
      // TODO show download progress & notify user is app is downloaded
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
          <Button
            onClick={() => appAddClose()}
            color='primary'
            autoFocus
          >
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

AddAppDialog.propTypes = {
  user: PropTypes.object,
  appAddClose: PropTypes.func.isRequired
}

export default withMobileDialog()(AddAppDialog)
