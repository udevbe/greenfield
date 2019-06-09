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

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import firebaseui from 'firebaseui'

const config = {
  apiKey: 'AIzaSyBrPVY5tkBYcVUrxZywVDD4gAlHPTdhklw',
  authDomain: 'greenfield-app-0.firebaseapp.com',
  databaseURL: 'https://greenfield-app-0.firebaseio.com',
  projectId: 'greenfield-app-0',
  storageBucket: 'greenfield-app-0.appspot.com',
  messagingSenderId: '645736998883'
}

class Auth {
  /**
   * @return {Auth}
   */
  static create () {
    const app = firebase.initializeApp(config)
    // Initialize the FirebaseUI Widget using Firebase.
    const ui = new firebaseui.auth.AuthUI(firebase.auth())

    // create user auth state container
    return new Auth(app, ui)
  }

  /**
   * @param {firebase.app.App}app
   * @param {firebaseui.auth.AuthUI}ui
   */
  constructor (app, ui) {
    /**
     * @type {firebase.app.App}
     */
    this.app = app
    /**
     * @type {firebaseui.auth.AuthUI}
     */
    this.ui = ui
    /**
     * FirebaseUI config.
     * @type {{signInOptions: any[], tosUrl: string, callbacks: {signInSuccessWithAuthResult: (function(*, *): boolean)}, privacyPolicyUrl: (function(): void)}}
     * @private
     */
    this._uiConfig = {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
        },
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ],
      tosUrl: '/license.txt',
      privacyPolicyUrl: () => window.location.assign('/privacypolicy.txt'),
      callbacks: {
        // signed in, fired when browser does not know about the user before.
        signInSuccessWithAuthResult: (/** @type{firebase.auth.UserCredential} */authResult, redirectUrl) => false
      }
    }

    /**
     * @type {?firebase.User}
     */
    this.user = null
    /**
     * @type {?string}
     */
    this.userToken = null

    /**
     * @type {function(firebase.User):void}
     * @private
     */
    this._loginResolve = null
    /**
     * @type {Promise<firebase.User>}
     * @private
     */
    this._loginPromise = new Promise(resolve => { this._loginResolve = resolve })

    /**
     * @type {function():void}
     * @private
     */
    this._logoutResolve = null
    /**
     * @type {Promise<void>}
     * @private
     */
    this._logoutPromise = new Promise(resolve => { this._logoutResolve = resolve })
    /**
     * @type {boolean}
     * @private
     */
    this._started = false
  }

  /**
   * @param {HTMLElement}container
   * @param {string}containerId
   */
  start (container, containerId) {
    // wire up login/logout events
    const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        // show user a warning if they want to close this page
        window.onbeforeunload = e => {
          const dialogText = ''
          e.returnValue = dialogText
          return dialogText
        }

        // logged in, happens each time the user opens the web page and successfully authenticates
        // user logged in thus hide further ui screens
        user.getIdToken(true).then(token => {
          this.user = user
          this.userToken = token
          this._onLogin(user)
        })
      } else {
        // logged out, happens when formerly known auto sign-in user auth failed, or when user explicitly logs out.
        this._onLogout()

        const shouldStart = this.user || !this._started
        this.user = null
        this.userToken = null
        window.onbeforeunload = null
        if (shouldStart) {
          // show ui on logout if user auth failed on start
          this.ui.start('#auth-container', this._uiConfig)
        }
      }
    })

    if (!unsubscribe || this.ui.isPendingRedirect()) {
      // show ui during init if user is not known before, or when we're ie validating an email address.
      this.ui.start('#auth-container', this._uiConfig)
      this._started = true
    }
  }

  /**
   * @return {Promise<void>}
   */
  signOut () {
    return firebase.auth().signOut()
  }

  /**
   * @return {Promise<firebase.User>}
   */
  whenLogin () {
    return this._loginPromise
  }

  /**
   * @return {Promise<void>}
   */
  whenLogout () {
    return this._logoutPromise
  }

  /**
   * @param {firebase.User}user
   * @private
   */
  _onLogin (user) {
    let newLoginResolve = null
    this._loginPromise = new Promise(resolve => { newLoginResolve = resolve })
    this._loginResolve(user)
    this._loginResolve = newLoginResolve
  }

  /**
   * @private
   */
  _onLogout () {
    let newLogoutResolve = null
    this._logoutPromise = new Promise(resolve => { newLogoutResolve = resolve })
    this._logoutResolve()
    this._logoutResolve = newLogoutResolve
  }
}

export default Auth.create()
