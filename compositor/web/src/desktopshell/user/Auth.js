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

import './auth.css'

import firebase from 'firebase/app'
import 'firebase/auth'

import firebaseui from 'firebaseui'

class Auth {
  static async create () {
    // Initialize Firebase
    const config = {
      apiKey: 'AIzaSyBrPVY5tkBYcVUrxZywVDD4gAlHPTdhklw',
      authDomain: 'greenfield-app-0.firebaseapp.com',
      databaseURL: 'https://greenfield-app-0.firebaseio.com',
      projectId: 'greenfield-app-0',
      storageBucket: 'greenfield-app-0.appspot.com',
      messagingSenderId: '645736998883'
    }
    const app = firebase.initializeApp(config)
    // Initialize the FirebaseUI Widget using Firebase.
    const ui = new firebaseui.auth.AuthUI(firebase.auth())

    // create the auth container div
    const container = /** @type {HTMLDivElement} */document.createElement('div')
    document.body.appendChild(container)

    const overlay = /** @type {HTMLDivElement} */document.createElement('div')
    overlay.setAttribute('id', 'overlay')
    container.appendChild(overlay)

    const logoParagraph = /** @type {HTMLParagraphElement} */document.createElement('p')
    logoParagraph.setAttribute('id', 'logo')
    logoParagraph.textContent = 'Greenfield'
    overlay.appendChild(logoParagraph)

    const authContainer = /** @type {HTMLDivElement} */document.createElement('div')
    authContainer.setAttribute('id', 'auth-container')
    overlay.appendChild(authContainer)

    // create user auth state container
    const auth = new Auth(app, ui)

    // FirebaseUI config.
    const uiConfig = {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
        },
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
      ],
      tosUrl: '/license.txt',
      privacyPolicyUrl: () => window.location.assign('/privacypolicy.txt'),
      callbacks: {
        signInSuccessWithAuthResult: (/** @type{firebase.auth.UserCredential} */authResult, redirectUrl) => {
          // signed in, fired when browser does not know about the user before.
          return false
        }
      }
    }

    let started = false

    // wire up login/logout events
    const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        // logged in, happens each time the user opens the web page and successfully authenticates
        // user logged in thus hide further ui screens
        auth._onLogin(user)
        overlay.classList.add('off')
      } else {
        // logged out, happens when formerly known auto sign-in user auth failed, or when user explicitly logs out.
        auth._onLogout()
        if (!started) {
          // show ui on logout if user auth failed on start
          ui.start('#auth-container', uiConfig)
        }
      }
    })

    if (!unsubscribe || ui.isPendingRedirect()) {
      // show ui during init if user is not known before, or when we're ie validating an email address.
      ui.start('#auth-container', uiConfig)
      started = true
    }

    return auth
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
     * @type {firebase.User|null}
     */
    this.user = null
    /**
     * @type {firebase.auth.UserCredential|null}
     */
    this.userCredential = null

    /**
     * @type {function():void}
     * @private
     */
    this._loginResolve = null
    /**
     * @type {Promise<void>}
     * @private
     */
    this._loginPromise = new Promise(resolve => { this._loginResolve = resolve })
  }

  /**
   * @return {Promise<void>}
   */
  login () {
    return this._loginPromise
  }

  // async signInAnonymously () {
  //   this.userCredential = await firebase.auth().signInAnonymously()
  // }
  //
  /**
   * @param {firebase.User}user
   * @private
   */
  _onLogin (user) {
    // User is signed in.
    // const isAnonymous = user.isAnonymous
    // const displayName = user.displayName
    // const email = user.email
    // const emailVerified = user.emailVerified
    // const photoURL = user.photoURL
    // const uid = user.uid
    // const phoneNumber = user.phoneNumber
    // const providerData = user.providerData
    this.user = user
    // user.getIdToken().then(accessToken => {
    //   // TODO user signed it. hide login window & render rest of ui
    //   // TODO do something with token
    //
    // })

    this._loginResolve()
  }

  _onLogout () {
    // TODO User signed out. Shut down clients & show login screen
    this.user = null
  }
}

export default Auth.create()
