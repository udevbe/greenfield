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

const https = require('https')

/**
 * @param {string}functionName
 * @param {string}userToken
 * @param {?Object}query
 * @return {Promise<*>}
 * @private
 */
async function _call (functionName, userToken, query) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://europe-west1-greenfield-app-0.cloudfunctions.net/${functionName}`)
    if (query) {
      Object.entries(query).forEach(([key, value]) => url.searchParams.append(key, value))
    }

    if (userToken.length) {
      https.get(
        url,
        { headers: { Authorization: `Bearer ${userToken}` } },
        res => resolve(res))
    } else {
      reject(new Error('Auth failed.'))
    }
  })
}

/**
 * @param {string}userToken
 * @return {Promise<void>}
 * @private
 */
async function verifyRemoteAppLaunchClaim (userToken) {
  const res = await _call('verifyRemoteAppLaunchClaim', userToken)
  if (res.statusCode !== 200) throw new Error('Auth failed.')
}

/**
 * @param {string}userToken
 * @param {string}applicationId
 * @return {Promise<void>}
 */
async function authorizeApplicationLaunch (userToken, applicationId) {
  const res = await _call('authorizeApplicationLaunch', userToken, { applicationId })
  if (res.statusCode !== 200) throw new Error('Auth failed.')
}

module.exports.verifyRemoteAppLaunchClaim = verifyRemoteAppLaunchClaim
module.exports.authorizeApplicationLaunch = authorizeApplicationLaunch
