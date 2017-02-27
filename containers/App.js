import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import PickerContainer from './PickerContainer'
import CanvasContainer from './CanvasContainer'
import React from 'react';


class App extends React.Component {
	render(){
		return (
			<div id="app">
				<PickerContainer />
				<CanvasContainer />
			</div>
		)
	}
}
export default App