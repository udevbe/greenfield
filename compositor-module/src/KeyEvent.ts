import { EvDevKeyCode } from './Xkb'

export type KeyCode = { readonly evdevKeyCode: EvDevKeyCode; readonly x11KeyCode: number }

export type KeyEvent = {
  readonly keyCode: KeyCode
  readonly timeStamp: number
  readonly pressed: boolean
  readonly capsLock: boolean
  readonly numLock: boolean
}

export interface CreateKeyEventFromKeyboardEvent {
  (keyboardEvent: KeyboardEvent, down: boolean): KeyEvent | undefined
}

export const createKeyEventFromKeyboardEvent: CreateKeyEventFromKeyboardEvent = (
  keyboardEvent: KeyboardEvent,
  pressed: boolean,
): KeyEvent | undefined => {
  const evdevKeyCode: EvDevKeyCode | undefined = EvDevKeyCode[<keyof typeof EvDevKeyCode>keyboardEvent.code]
  if (evdevKeyCode) {
    const capsLock = keyboardEvent.getModifierState('CapsLock')
    const numLock = keyboardEvent.getModifierState('NumLock')
    const timeStamp = keyboardEvent.timeStamp
    return {
      keyCode: { evdevKeyCode, x11KeyCode: evdevKeyCode + 8 },
      timeStamp,
      pressed,
      capsLock,
      numLock,
    }
  }
  console.warn(`Unsupported keycode: ${keyboardEvent.code}. Ignoring.`)
}
