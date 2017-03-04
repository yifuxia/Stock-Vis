import React from 'react';
import { connect } from 'react-redux';
import StockPicker from '../components/StockPicker'
import ElementPicker from '../components/ElementPicker'
import {change_stock} from '../actions/'
import {change_element_display} from '../actions'

var elements=['Close','Open','High','Low']
var value_display_style = {
    marginLeft:((100/1100)*110) + 'vw',
    backgroundColor:'rgba(255,255,255,0.8)',
  }

class MainPickerContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  	const {display_elements,comparing_stocks} = this.props
    return (
            <div id="value_display" style={value_display_style}>
              <StockPicker id="stock_selector" 
                           color="red" 
                           onChange = {() => {this.props.change_stock(document.getElementById("stock_selector").value)}}/>
              {
            		elements.map(el => <ElementPicker
            			key = {el}
            			name = {el}
            			selected = {display_elements}
            			onClick = {() => {this.props.change_element_display(el)}}
            			/>)
            	}
              <p id="Vol" style={{display:'inline-block',border:'solid 1px'}}>Volume</p>
            </div> 
    );
  }
}
function mapStateToProps(state) {
  return {
    stock_name: state.stock_name,
    display_elements: state.display_elements,
    comparing_stocks: state.comparing_stocks
  }
}

export default connect(
  mapStateToProps,
  {change_stock,change_element_display}
)(MainPickerContainer)