import './style.css'
import React from 'react'

class Workspace extends React.PureComponent {
  constructor (props) {
    super(props)
    this.ref = React.createRef()
  }

  render () {
    return (
      <div id={'workspace'} ref={this.ref}>{
        this.props.children.map(child => {
          return React.cloneElement(child, { workspace: this })
        })
      }</div>
    )
  }
}

export default Workspace
