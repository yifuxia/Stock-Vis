import React from 'react';
import { connect } from 'react-redux';
import MainCanvas from '../components/MainCanvas'
import Brush from '../components/Brush'



class CanvasContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  	const {display_elements, stock_name, time_range, comparing_stocks} = this.props
    return (
            <div>
              <Brush />
            	<MainCanvas display={display_elements} 
                          name={stock_name} 
                          time_range={time_range} 
                          comparing_stocks={comparing_stocks} />
            </div> 
    );
  }
}
function mapStateToProps(state) {
  return {
    stock_name: state.stock_name,
    display_elements: state.display_elements,
    time_range: state.time_range,
    comparing_stocks: state.comparing_stocks
  }
}

export default connect(
  mapStateToProps
)(CanvasContainer)