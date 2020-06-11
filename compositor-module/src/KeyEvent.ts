export interface KeyEvent {
  code: string,
  timestamp: number,
  down: boolean
}

export function createKeyEvent(code: string, timestamp: number, down: boolean) {
  return { code, timestamp, down }
}

export function createKeyEventFromKeyboardEvent(keyboardEvent: KeyboardEvent, down: boolean) {
  return createKeyEvent(keyboardEvent.code, keyboardEvent.timeStamp, down)
}


