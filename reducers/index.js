import { combineReducers } from 'redux'


const stock_name = (state='AAPL', action) => {
	switch (action.type) {
    case 'STOCK_CHANGED':
     	return action.val
    default:
      return state
  }
}

const display_elements = (state=[], action) => {
	var new_state = state.slice()
	switch (action.type) {
    case 'DISPLAY_CHANGED':
     	var val = action.val
     	var idx = new_state.indexOf(val)
     	//Toggle display elements
     	if (idx === -1){
     		new_state.push(val)
     	}else{
     		new_state.splice(idx, 1)
     	}
     	return new_state
    default:
      return state
  }
}

export default combineReducers({
stock_name,
display_elements
})