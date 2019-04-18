import './style.css'
import React from 'react'

export default (props) =>
  <div className={'overlay' + (props.off ? ' off' : '')}>{props.children}</div>
