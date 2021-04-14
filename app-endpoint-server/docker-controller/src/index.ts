import express from 'express'

import jwt from 'jsonwebtoken'
import { launchAppImage } from './service'

const expressApp = express()
const PORT = 8000

expressApp.post('/compositor/:compositorSessionId/application/:appimage', async (req, res) => {
  try {
    const { compositorSessionId, appimage } = req.params
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
      return res.sendStatus(401)
    }

    // TODO provide secret
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const payload: Record<string, string> = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)
    const userName = payload['name']
    const userId = payload['sub']

    const { locations } = await launchAppImage({
      compositorSessionId,
      appimage,
      userId,
      userName,
    })

    locations.forEach((location) => res.setHeader('Location', location))
    res.statusCode = 201 // Resource created
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

expressApp.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
