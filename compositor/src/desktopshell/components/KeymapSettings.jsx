import React from 'react'
import FormControl from '@material-ui/core/es/FormControl'
import InputLabel from '@material-ui/core/es/InputLabel'
import Select from '@material-ui/core/es/Select'
import MenuItem from '@material-ui/core/es/MenuItem'
import { withStyles } from '@material-ui/core'

const styles = theme => ({
  keymapMenuItem: {
    display: 'flex'
  }
})

// TODO make a component that takes up the whole settings drawer space & includes all keyboard related settings.
class KeymapSettings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nrmlvo: props.keyboard.nrmlvo
    }
  }

  // TODO We need to extend the component keymap settings to make the model selection flexible
  // TODO We need to extend the component keymap settings to make the option selection flexible

  /**
   * @param event
   * @private
   */
  _handleKeymapLayoutUpdate (event) {
    const nrmlvo = event.target.value
    this.props.keyboard.updateKeymapFromNames(nrmlvo)
    this.setState(() => ({ nrmlvo }))
  }

  render () {
    const { classes, keyboard } = this.props
    const { nrmlvo } = this.state

    return <FormControl>
      <InputLabel htmlFor='keymap-layout'>Layout</InputLabel>
      <Select
        inputProps={{
          name: 'keymap-layout',
          id: 'keymap-layout'
        }}
        value={nrmlvo}
        onChange={event => this._handleKeymapLayoutUpdate(event)}
      >
        {keyboard.nrmlvoEntries.map(nrmlvo =>
          <MenuItem
            key={nrmlvo.name}
            className={classes.keymapMenuItem}
            value={nrmlvo}
          >
            {nrmlvo.name}
          </MenuItem>)}
      </Select>
    </FormControl>
  }
}

export default withStyles(styles)(KeymapSettings)
