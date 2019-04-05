import './style.css'
import { h, Component } from 'preact'
import TopPanel from '../toppanel/TopPanel'
import Workspace from '../workspace/Workspace'
import EntriesContainer from '../entriescontainer/EntriesContainer'
import ToplevelSurfaceEntry from '../entry/ToplevelSurfaceEntry'

/**
 * @implements UserShell
 */
class DesktopUserShell extends Component {
  /**
   * @param {Seat}seat
   */
  constructor ({ seat }) {
    super({ seat })
    /**
     * @type {{toplevelSurface: Array<Surface>}}
     */
    this.state = {
      toplevelSurfaces: []
    }
  }

  /**
   * Ask the user shell to start managing the given surface.
   * @param {Surface}surface
   * @return {UserShellSurface}
   * @override
   */
  manage (surface) {
    this.addTopLevelSurface(surface)
    surface.resource.onDestroy().then(() => this.removeToplevelSurface(surface))
  }

  /**
   * @param {Surface}toplevelSurface
   */
  addTopLevelSurface (toplevelSurface) {
    this.setState(
      /**
       * @param {Array<Surface>}toplevelSurfaces
       * @return {{toplevelSurfaces: Array<Surface>}}
       */
      ({ toplevelSurfaces }) => {
        return {
          toplevelSurfaces: [...toplevelSurfaces, toplevelSurface]
        }
      })
  }

  /**
   * @param {Surface}surface
   */
  removeToplevelSurface (surface) {
    this.setState(
      /**
       * @param {Array<Surface>}toplevelSurfaces
       * @return {{toplevelSurfaces: Array<Surface>}}
       */
      ({ toplevelSurfaces }) => {
        return {
          toplevelSurfaces: toplevelSurfaces.filter(element => element !== surface)
        }
      })
  }

  /**
   * @param {Seat}seat
   * @param {Array<Surface>}toplevelSurfaces
   * @param context
   * @return {*}
   */
  render ({ seat }, { toplevelSurfaces }, context) {
    return (
      <div className={'desktop-user-shell'}>
        <TopPanel>
          <EntriesContainer> {
            toplevelSurfaces.map(surface =>
              <ToplevelSurfaceEntry seat={seat} surface={surface} workspaceId={'workspace'} />
            )}
          </EntriesContainer>
        </TopPanel>
        <Workspace />
      </div>
    )
  }
}

export default DesktopUserShell
