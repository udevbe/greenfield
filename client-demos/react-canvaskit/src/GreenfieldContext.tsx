import * as React from 'react'
import { FunctionComponent } from 'react'

export interface GreenfieldContextConfig {
  requestSurfaceFrame(frameCallback: (time: number) => void): void
}

// @ts-ignore
export let useGreenfield: () => GreenfieldContextConfig = undefined
// @ts-ignore
export let GreenfieldProvider: FunctionComponent = undefined

export function initGreenfieldContext(contextConfig: GreenfieldContextConfig) {
  const FrameContext = React.createContext(contextConfig)
  useGreenfield = () => React.useContext(FrameContext)
  GreenfieldProvider = ({ children }) => <FrameContext.Provider value={contextConfig}>children</FrameContext.Provider>
}


