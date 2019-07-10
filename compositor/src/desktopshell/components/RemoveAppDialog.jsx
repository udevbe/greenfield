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
import DialogContent from '@material-ui/core/es/DialogContent'
import DialogContentText from '@material-ui/core/es/DialogContentText'
import DialogActions from '@material-ui/core/es/DialogActions'
import Button from '@material-ui/core/es/Button'
import Slide from '@material-ui/core/es/Slide'
import auth from '../Auth'

function SlideUp (props) {
  return <Slide direction='up' {...props} />
}

class RemoveAppDialog extends React.PureComponent {
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
