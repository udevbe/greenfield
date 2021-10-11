import { LinuxKeyCode } from './Xkb'

export interface KeyEvent {
  keyCode: LinuxKeyCode
  timeStamp: number
  pressed: boolean
  capsLock: boolean
  numLock: boolean
}

export interface CreateKeyEventFromKeyboardEvent {
  (keyboardEvent: KeyboardEvent, down: boolean): KeyEvent | undefined
}

export const createKeyEventFromKeyboardEvent: CreateKeyEventFromKeyboardEvent = (
  keyboardEvent: KeyboardEvent,
  pressed: boolean,
): KeyEvent | undefined => {
  const keyCode: LinuxKeyCode | undefined = LinuxKeyCode[<keyof typeof LinuxKeyCode>keyboardEvent.code]
  if (keyCode) {
    const capsLock = keyboardEvent.getModifierState('CapsLock')
    const numLock = keyboardEvent.getModifierState('NumLock')
    const timeStamp = keyboardEvent.timeStamp
    return {
      keyCode,
      timeStamp,
      pressed,
      capsLock,
      numLock,
    }
  }
  console.warn(`Unsupported keycode: ${keyboardEvent.code}. Ignoring.`)
}
