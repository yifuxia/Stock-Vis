import React from 'react';
import {add_cmp_stock} from '../actions'

export default class AddCompareStock extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {dispatch} = this.props
    return (
            <div style={{display:'inline-block',cursor:'pointer'}}>
            	<p style={{margin:'1vh 0'}} onClick ={() => window.store.dispatch(add_cmp_stock())}>Add compare stocks</p>
            </div> 
    );
  }
}