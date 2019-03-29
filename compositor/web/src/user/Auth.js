import firebase from 'firebase'
import firebaseui from 'firebaseui'

class Auth {
  static create () {
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

    // FirebaseUI config.
    const uiConfig = {
      // signInSuccessUrl: '<url-to-redirect-to-on-success>',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ],
      // tosUrl and privacyPolicyUrl accept either url string or a callback
      // function.
      // Terms of service url/callback.
      tosUrl: '<your-tos-url>',
      // Privacy policy url/callback.
      privacyPolicyUrl: () => window.location.assign('<your-privacy-policy-url>')
    }

    // Initialize the FirebaseUI Widget using Firebase.
    const ui = new firebaseui.auth.AuthUI(firebase.auth())

    // create the auth container div
    const authContainer = /** @type {HTMLDivElement} */document.createElement('div')
    authContainer.setAttribute('id', 'auth-container')
    document.body.appendChild(authContainer)

    // create user auth state container
    const auth = new Auth(app, ui)

    // wire up login/logout events
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        auth._onLogin(user)
      } else {
        auth._onLogout()
      }
    })

    // The start method will wait until the DOM is loaded.
    ui.start('#auth-container', uiConfig)

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
    user.getIdToken().then(accessToken => {
      // TODO user signed it. hide login window & render rest of ui
      // TODO do something with token
      this._loginResolve()
    })
  }

  _onLogout () {
    // TODO User signed out. Shut down clients & show login screen
    this.user = null
    // reset loginPromise
    this._loginPromise = new Promise(resolve => { this._loginResolve = resolve })
  }
}

export default Auth.create()
