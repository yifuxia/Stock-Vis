import React from 'react';
import { connect } from 'react-redux';
import AddCompareStock from '../components/AddCompareStock'
import StockPicker from '../components/StockPicker'
import {change_cmp_stock} from '../actions'
import {delete_cmp_stock} from '../actions'

class ComparePickerContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {comparing_stocks} = this.props
    var color = d3.scaleOrdinal(d3.schemeCategory20)
    var category = []
    for (var i=0;i<20;i++){
      category.push(i)
    }
    color.domain(category)
    return (
            <div>
              <AddCompareStock />
              {
                comparing_stocks.map(el =>
                  <div>
                    <StockPicker key={"picker_"+el.id} id={"picker_"+el.id} 
                              onChange = {
                                () => {
                                        this.props.change_cmp_stock({
                                          name:document.getElementById("picker_"+el.id).value,
                                          id: el.id
                                        })
                                      }
                              }
                              selected={el.name}
                              color={color(el.id % 20)}
                              />
                      <p style={{display:'inline-block',pointer:'cursor'}}
                          onClick = {() => this.props.delete_cmp_stock(el.id)}
                          >✖</p>
                    </div>
                )
              }
            </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    comparing_stocks: state.comparing_stocks
  }
}

export default connect(
  mapStateToProps,
  {change_cmp_stock, delete_cmp_stock}
)(ComparePickerContainer)