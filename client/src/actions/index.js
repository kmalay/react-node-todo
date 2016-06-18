import axios from 'axios';
import { browserHistory } from 'react-router';
import {
	AUTH_USER,
	AUTH_ERROR,
	UNAUTH_USER,
	FETCH_TODOS,
	CREATE_TODO,
	COMPLETE_TODO,
	CLEAR_COMPLETED
} from './types';

const ROOT_URL = 'http://localhost:3090';

export function signinUser({ email, password }) {
	return function(dispatch) {
		// Submit email/password to the server
		axios.post(`${ROOT_URL}/signin`, { email, password })
			.then(response => {
				// If request is good...
				// - Update state to indicate user is authenticated
				dispatch({ type: AUTH_USER });
				// - Save the JWT token
				localStorage.setItem('token', response.data.token);
				localStorage.setItem('userId', response.data.userId);
				// - Redirect to the route '/todos'
				browserHistory.push('/todos');
			})
			.catch(() => {
				// If request is bad...
				// - Show an error to the user
				dispatch(authError('Bad Login Info'));	
			});
	}
}

export function signupUser({ email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signup`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        browserHistory.push('/todos');
      })
      .catch(response => dispatch(authError(response.data.error)));
  }
}

export function authError(error) {
	return {
		type: AUTH_ERROR,
		payload: error
	};
}

export function signoutUser() {
	localStorage.removeItem('token');
	localStorage.removeItem('userId');

	return { type: UNAUTH_USER };
}

export function fetchTodos() {
	return function(dispatch) {
		axios.get(`${ROOT_URL}/todos`, {
			headers: {
				authorization: localStorage.getItem('token'),
				userId: localStorage.getItem('userId')
			}
		})
			.then(response => {
				dispatch({
					type: FETCH_TODOS,
					payload: response.data
				})
			})
	}
}

export function createTodo( title, userId ) {
	return function(dispatch) {
		const token = localStorage.getItem('token');
		const options = {
				title: title,
				UserId: userId
		};
		axios.post(`${ROOT_URL}/todos`, options, { headers: { authorization: token } })
      .then(response => {
        dispatch({ type: CREATE_TODO, payload: response.data });
        browserHistory.push('/todos');
      })
      .catch(response => {
      	console.log('error: ' + response.data);
      });
	}
}

export function completeTodo( todoId, title, complete ) {
	return function (dispatch) {
		const token = localStorage.getItem('token');
		const userId = localStorage.getItem('userId');
		const options = {
			title: title,
			complete: !complete,
			UserId: userId
		};
		axios.put(`${ROOT_URL}/todo/${todoId}`, options, { headers: { authorization: token } })
			.then(response => {
        dispatch({ type: COMPLETE_TODO, payload: response.data });
        browserHistory.push('/todos');
			})
			.catch(response => {
				console.log('error: ' + response.data);
			});
	}
}

export function clearCompleted() {
	return function (dispatch) {
		const token = localStorage.getItem('token');
		const userId = localStorage.getItem('userId');
		const options = { UserId: userId };
		axios.post(`${ROOT_URL}/clear`, options, { headers: { authorization: token } })
			.then(response => {
				dispatch({ type: CLEAR_COMPLETED, payload: response.data });
				browserHistory.push('/todos');
			})
			.catch(response => {
				console.log('error: ' + response.data);
			});
	}
}