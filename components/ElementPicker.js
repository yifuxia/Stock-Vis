import React from 'react';
import {color_map} from '../utils/color_map'

export default class ElementPicker extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  	const { name, selected, onClick } = this.props
  	var style = selected.indexOf(name) === -1 ? {'color':'black'}:{color:color_map[name]}
    return (
            <div>
            	<div onClick={onClick}>
            		<p style={style}>{name}</p>
            	</div>
            </div> 
    );
  }
}