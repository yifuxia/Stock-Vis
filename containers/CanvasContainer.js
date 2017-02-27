import React from 'react';
import { connect } from 'react-redux';
import Canvas from '../components/Canvas'


class CanvasContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  	const {display_elements, stock_name} = this.props
    return (
            <div>
            	<Canvas display={display_elements} name={stock_name}/>
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
  mapStateToProps
)(CanvasContainer)