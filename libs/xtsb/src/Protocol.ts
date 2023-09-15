import { XConnection } from './connection'

export default class Protocol {
  constructor(
    public xConnection: XConnection,
    public readonly majorOpcode: number,
    public readonly firstEvent: number,
    public readonly firstError: number,
  ) {}
}
