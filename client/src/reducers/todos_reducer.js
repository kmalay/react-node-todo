import {
	FETCH_TODOS,
	CREATE_TODO,
	COMPLETE_TODO,
	CLEAR_COMPLETED
} from '../actions/types';

const INITIAL_STATE = { all: [] };

export default function(state = INITIAL_STATE, action) {
	switch(action.type) {
		case FETCH_TODOS:
			return { ...state, all: action.payload };
	}
	switch(action.type) {
		case CREATE_TODO:
			return { ...state, all: action.payload };
	}
	switch(action.type) {
		case COMPLETE_TODO:
			return { ...state, all: action.payload };
	}
	switch(action.type) {
		case CLEAR_COMPLETED:
			return { ...state, all: action.payload };
	}
	return state;
}
