import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from './reducers'
import App from './containers/App';
import {change_element_display} from './actions'

const middleware = [thunk, logger()]

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)

//Initial action
setTimeout(function(){store.dispatch(change_element_display('Close'))},100)

ReactDOM.render(
	<Provider store={store}>
    	<App />
    </Provider>, 
    document.getElementById('app')
)