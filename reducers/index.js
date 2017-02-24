import { combineReducers } from 'redux'


const some_state = (state='', action) => {
	switch (action.type) {
    case 'STATE_CHANGED':
     	return action.val
    default:
      return state
  }
}

export default combineReducers({
some_state
})