import React from 'react';
import { connect } from 'react-redux';
import StockPicker from '../components/StockPicker'
import ElementPicker from '../components/ElementPicker'
import {change_stock} from '../actions/'
import {change_element_display} from '../actions'

var elements=['Close','Open','High','Low']
var value_display_style = {
    position:'absolute',
    left:((100/1100)*110) + 'vw',
    top:'calc('+ ((100/1100)*50) + 'vw' + ' + 10vh',
    fontSize:((100/1100)*10)+ 'vw',
    backgroundColor:'rgba(255,255,255,0.8)',
    border:'solid 1px'
  }
  
class PickerContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  	const {display_elements} = this.props
    return (
            <div style={{'textAlign':'center'}}>
            	<div style={{'marginTop':'5vh'}}>
              <StockPicker onChange = {() => {this.props.change_stock(document.getElementById("stock_selector").value)}}/>
            	</div>
              <div  id="value_display" style={value_display_style}>
                {
              		elements.map(el => <ElementPicker
              			key = {el}
              			name = {el}
              			selected = {display_elements}
              			onClick = {() => {this.props.change_element_display(el)}}
              			/>)
              	}
                <p id="Vol">Vol</p>
              </div>
            </div> 
    );
  }
}
function mapStateToProps(state) {
  return {
    stock_name: state.stock_name,
    display_elements: state.display_elements
  }
}

export default connect(
  mapStateToProps,
  {change_stock,change_element_display}
)(PickerContainer)