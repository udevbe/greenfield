import { LinuxKeyCode } from './Xkb'

export interface KeyEvent {
  code: LinuxKeyCode,
  timestamp: number,
  down: boolean
}

export function createKeyEvent(code: LinuxKeyCode, timestamp: number, down: boolean): KeyEvent {
  return { code, timestamp, down }
}

export function createKeyEventFromKeyboardEvent(keyboardEvent: KeyboardEvent, down: boolean): KeyEvent | undefined {
  const keyCode: LinuxKeyCode | undefined = LinuxKeyCode[<keyof typeof LinuxKeyCode>keyboardEvent.code]
  if (keyCode) {
    return createKeyEvent(keyCode, keyboardEvent.timeStamp, down)
  }
  console.warn(`Unsupported keycode: ${keyboardEvent.code}. Ignoring.`)
}


