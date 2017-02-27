import React from 'react';

export default class ElementPicker extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  	const { name, selected, onClick } = this.props
  	var style = selected.indexOf(name) === -1 ? {'color':'black'}:{color:'red'}
    return (
            <div>
            	<div onClick={onClick}>
            		<p style={style}>{name}</p>
            	</div>
            </div> 
    );
  }
}