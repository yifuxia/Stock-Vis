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
const time_range = (state='', action) => {
  switch (action.type) {
    case 'TIME_CHANGED':
      return action.val
    default:
      return state
  }
}
const comparing_stock = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_CMP_STOCK':
      return {
        id: action.id,
        name: action.name,
      }
    default:
      return state
  }
}

const comparing_stocks = (state = [], action) => {
  var new_state = state.slice()
  switch (action.type) {
    case 'ADD_CMP_STOCK':
      return [
        ...state,
        comparing_stock(undefined, action)
      ]
    case 'CHANGE_CMP_STOCK':
      //find and change value of selected comparing stock name
      for (var i in new_state){
        var obj = new_state[i]
        if (obj.id === action.id){
          obj.name = action.val
          break;
        }
      }
      return new_state
    case 'DELETE_CMP_STOCK':
      var removed = state.filter(function(el){
        return el.id !== action.id
      })
      return removed
    default:
      return state
  }
}



export default combineReducers({
stock_name,
display_elements,
time_range,
comparing_stocks
})