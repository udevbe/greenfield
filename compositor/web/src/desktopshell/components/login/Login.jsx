import './style.css'
import { Component } from 'preact'

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase'
import WelcomeLogo from '../welcomelogo/WelcomeLogo'

const config = {
  apiKey: 'AIzaSyBrPVY5tkBYcVUrxZywVDD4gAlHPTdhklw',
  authDomain: 'greenfield-app-0.firebaseapp.com',
  databaseURL: 'https://greenfield-app-0.firebaseio.com',
  projectId: 'greenfield-app-0',
  storageBucket: 'greenfield-app-0.appspot.com',
  messagingSenderId: '645736998883'
}
firebase.initializeApp(config)

const uiConfig = {
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
    },
    firebase.auth.AnonymousAuthProvider.PROVIDER_ID
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

class Login extends Component {
  render (props, state, context) {
    return (
      <div>
        <WelcomeLogo />
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    )
  }
}

export default Login
