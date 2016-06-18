import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authReducer from './auth_reducer';
import todosReducer from './todos_reducer';

const rootReducer = combineReducers({
	form,
	auth: authReducer,
	todos: todosReducer
});

export default rootReducer;
