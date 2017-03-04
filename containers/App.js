import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import MainPickerContainer from './MainPickerContainer'
import ComparePickerContainer from './ComparePickerContainer'
import CanvasContainer from './CanvasContainer'
import React from 'react';


class App extends React.Component {
	render(){
		return (
			<div id="app">
				<MainPickerContainer />
				<ComparePickerContainer />
				<CanvasContainer />
			</div>
		)
	}
}
export default App