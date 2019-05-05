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

import auth from '../Auth'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

class AddAppDialog extends React.Component {
  constructor (props) {
    super(props)
    /**
     * @type {{appURLInvalid: boolean, appURL: null|string}}
     */
    this.state = {
      appURL: null,
      appURLInvalid: false
    }
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
   * @param event
   * @private
   */
  _appURLChanged (event) {
    const appURL = event.target.value
    try {
      const url = new URL(appURL)
      if (appURL.startsWith('http')) {
        this.setState(() => ({ appURL: url, appURLInvalid: false }))
      } else {
        this.setState(() => ({ appURL: null, appURLInvalid: true, appType: null }))
      }
    } catch (e) {
      this.setState(() => ({ appURL: null, appURLInvalid: true, appType: null }))
    }
  }

  async _addApp () {
    // TODO show waiting/installing icon
    const { appURL } = /** @type {{appURL: URL. appType: string}} */this.state
    const appLauncherEntry = await this._fetchAppLauncherEntry(appURL)
    await this._addAppLauncherEntry(appLauncherEntry)
  }

  /**
   * @param {string}appURL
   * @return {Promise<{title: string, appURL: string, imageURL: string, type: 'web'|'remote'}>}
   * @private
   */
  _fetchAppLauncherEntry (appURL) {
    return new Promise((resolve, reject) => {
      const xhr = new window.XMLHttpRequest()

      xhr.onreadystatechange = () => {
        if (xhr.readyState === window.XMLHttpRequest.DONE && xhr.status === 200) {
          const appEntryText = xhr.responseText
          try {
            const appEntry = JSON.parse(appEntryText)
            // TODO validate appEntry
            resolve(appEntry)
          } catch (error) {
            reject(error)
          }
        } // TODO reject if we have something else than 2xx
      }

      xhr.open('GET', appURL)
      xhr.send()
    })
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
    const { appURLInvalid, appURL } = this.state
    return (
      <Dialog
        aria-labelledby='add-application-title'
        maxWidth='sm'
        onEscapeKeyDown={() => appAddClose()}
        {...rest} >
        <DialogTitle id='add-application-title'>Add Application</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            To add an application, please enter an application URL or upload an application descriptor file.
          </DialogContentText>
          <DialogContentText paragraph>
            After installation, the application will be automatically coupled to your account.
            Applications can be removed at any time in the application menu.
          </DialogContentText>
          <TextField
            helperText={appURLInvalid ? 'Invalid URL. URL must start with http(s)://.' : undefined}
            autoFocus
            required
            variant='outlined'
            margin='normal'
            id='application-url'
            label={`Application URL`}
            type='url'
            fullWidth
            error={appURLInvalid}
            onChange={(event) => this._appURLChanged(event)}
          />
        </DialogContent>
        <DialogActions>
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
          <Button onClick={() => appAddClose()} color='primary' autoFocus>
              Cancel
          </Button>
          <Button
            onClick={() => this._addApp()}
            color='primary'
            disabled={appURL === null || appURLInvalid}
          >
              Add
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withMobileDialog()(AddAppDialog)
