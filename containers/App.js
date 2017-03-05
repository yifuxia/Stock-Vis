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
				<div style={{textAlign:'center'}}>
					<h3>30 components of Dow Jones Industrial Avarage 1 year(2016.2 - 2017.02) data visualization</h3>
				</div>
				<MainPickerContainer />
				<ComparePickerContainer />
				<CanvasContainer />
			</div>
		)
	}
}
export default App