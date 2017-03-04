import React from 'react';
import {color_map} from '../utils/color_map'


export default class ElementPicker extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  	const { name, selected, onClick } = this.props
  	var style = selected.indexOf(name) === -1 ? {'color':'black',border:'solid 1px'}:{color:color_map[name],'border':'solid 1px'}
    return (
            <div style={{display:'inline-block',margin:'0 1vw 0 1vw'}}>
            	<div onClick={onClick} style={{'cursor':"pointer"}}>
            		<p id={name} style={style}>{name}</p>
            	</div>
            </div> 
    );
  }
}