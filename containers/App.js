import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import PickerContainer from './PickerContainer'

import React from 'react';

class App extends React.Component {
	render(){
		return (
			<div id="app">
				<PickerContainer />
			</div>
		)
	}
}
export default App