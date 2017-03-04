import React from 'react';
import {add_cmp_stock} from '../actions'

export default class AddCompareStock extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {dispatch} = this.props
    return (
            <div>
            	<h1 onClick ={() => window.store.dispatch(add_cmp_stock())}>add</h1>
            </div> 
    );
  }
}