import React from 'react';
import {stock_name_map} from '../utils/stock_name_map'

//Render options
var options=[]
for(var key in stock_name_map) {
  if(stock_name_map.hasOwnProperty(key)) {
    options.push(<option value={key} key={key}>{stock_name_map[key]}</option>)
  }
}


export default class StockPicker extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  	const { id,onChange,selected,color } = this.props
    return (
            <div style={{display:'inline-block'}}>
            	<select id={id} onChange={onChange} defaultValue={selected} style={color==='red'?{border:"3px solid "+color}:{border:"3px dotted "+color}}>
            		{options}
				      </select> 
            </div> 
    );
  }
}