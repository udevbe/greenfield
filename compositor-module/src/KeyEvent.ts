import { LinuxKeyCode } from './Xkb'

export interface KeyEvent {
  code: LinuxKeyCode
  timestamp: number
  down: boolean
}

export interface CreateKeyEvent {
  (code: LinuxKeyCode, timestamp: number, down: boolean): KeyEvent
}

export const createKeyEvent: CreateKeyEvent = (code: LinuxKeyCode, timestamp: number, down: boolean): KeyEvent => ({
  code,
  timestamp,
  down,
})

export interface CreateKeyEventFromKeyboardEvent {
  (keyboardEvent: KeyboardEvent, down: boolean): KeyEvent | undefined
}

export const createKeyEventFromKeyboardEvent: CreateKeyEventFromKeyboardEvent = (
  keyboardEvent: KeyboardEvent,
  down: boolean,
): KeyEvent | undefined => {
  const keyCode: LinuxKeyCode | undefined = LinuxKeyCode[<keyof typeof LinuxKeyCode>keyboardEvent.code]
  if (keyCode) {
    return createKeyEvent(keyCode, keyboardEvent.timeStamp, down)
  }
  console.warn(`Unsupported keycode: ${keyboardEvent.code}. Ignoring.`)
}
