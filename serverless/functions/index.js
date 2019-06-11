const functions = require('firebase-functions')
const admin = require('firebase-admin')
const app = admin.initializeApp()

/**
 * @param {express.Request}req
 * @private
 */
function _getUserToken (req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1]
  } else {
    return null
  }
}

/**
 * @param {express.Request}req
 * @param {express.Response}res
 * @return {Promise<void>}
 */
async function verifyRemoteAppLaunchClaim (req, res) {
  try {
    const userToken = _getUserToken(req)
    const decodedToken = await app.auth().verifyIdToken(userToken, true)
    if (decodedToken.uid) {
      // TODO Check if this user is allowed to launch remote apps using JWT custom claims
      // TODO We can get rid of this function by using custom JWT tokens with RSA public-private encryption which
      // TODO allows for client side decryption + claims checking using a public key
      res.sendStatus(200)
    } else {
      res.sendStatus(403)
    }
  } catch (e) {
    res.sendStatus(403)
  }
}

/**
 * @param {express.Request}req
 * @param {express.Response}res
 * @return {Promise<void>}
 */
async function authorizeApplicationLaunch (req, res) {
  try {
    const userToken = _getUserToken(req)
    const applicationId = req.query.applicationId

    // This is a pretty dumb security check but it'll have to do for now.
    // FIXME Instead of checking a user has the application in it's launcher menu, we want to give app launcher entries a generated signature based on the user unique id + app id. That way other users can't fake an app launcher entry.
    // TODO write a function that can generate such a signature, given a JWT token with a new custom claim, a target uid and a target app id.
    const applicationLauncherEntry = await app.firestore().collection('users').doc(userToken.uid).collection('appLauncherEntries').doc(applicationId).get({ source: 'server' })
    if (applicationLauncherEntry.exists()) {
      res.sendStatus(200)
    } else {
      res.sendStatus(403)
    }
  } catch (e) {
    res.sendStatus(403)
  }
}

exports.verifyRemoteAppLaunchClaim = functions.region('europe-west1').https.onRequest(verifyRemoteAppLaunchClaim)
exports.authorizeApplicationLaunch = functions.region('europe-west1').https.onRequest(authorizeApplicationLaunch)