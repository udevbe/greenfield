import './style.css'
import { h, Component } from 'preact'

class ToplevelSurfaceEntry extends Component {
  /**
   * @param {Seat}seat
   * @param {Surface}surface
   */
  constructor ({ seat, surface }) {
    super({ seat, surface })
  }

  /**
   * @param props
   * @param state
   * @param context
   */
  render (props, state, context) {
    return (
      <div className={'entry'} />
    )
  }
}

export default ToplevelSurfaceEntry
