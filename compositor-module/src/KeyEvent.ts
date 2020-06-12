import { linuxKeycode, LinuxKeyCode } from './Xkb'

export interface KeyEvent {
  code: keyof LinuxKeyCode,
  timestamp: number,
  down: boolean
}

export function createKeyEvent(code: keyof LinuxKeyCode, timestamp: number, down: boolean): KeyEvent {
  return { code, timestamp, down }
}

export function createKeyEventFromKeyboardEvent(keyboardEvent: KeyboardEvent, down: boolean): KeyEvent | undefined {
  if (!(keyboardEvent.code in Object.keys(linuxKeycode))) {
    console.warn(`Unsupprted keycode: ${keyboardEvent.code}. Ignoring.`)
    return
  }
  return createKeyEvent(keyboardEvent.code as keyof LinuxKeyCode, keyboardEvent.timeStamp, down)
}


