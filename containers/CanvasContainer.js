import React from 'react';
import { connect } from 'react-redux';
import MainCanvas from '../components/MainCanvas'
import Brush from '../components/Brush'



class CanvasContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  	const {display_elements, stock_name, time_range} = this.props
    return (
            <div>
              <Brush />
            	<MainCanvas display={display_elements} name={stock_name} time_range={time_range}/>
            </div> 
    );
  }
}
function mapStateToProps(state) {
  return {
    stock_name: state.stock_name,
    display_elements: state.display_elements,
    time_range: state.time_range
  }
}

export default connect(
  mapStateToProps
)(CanvasContainer)