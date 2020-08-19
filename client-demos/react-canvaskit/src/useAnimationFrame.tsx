import React from 'react'
import { useGreenfield } from './GreenfieldContext'

export default (callback: (time: number) => void) => {
  const { requestSurfaceFrame } = useGreenfield()
  const animate = (time: number) => {
    callback(time)
    requestSurfaceFrame(animate)
  }
  React.useEffect(() => requestSurfaceFrame(animate), []) // Make sure the effect runs only once
}
