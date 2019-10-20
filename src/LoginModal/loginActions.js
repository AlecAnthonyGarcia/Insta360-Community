import axios from 'axios';
import md5 from 'blueimp-md5';

import Api from '../utils/Api';

export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export function setAuthorizationToken(token) {
	if (token) {
		axios.defaults.headers.common['X-User-Token'] = token;
	} else {
		delete axios.defaults.headers.common['X-User-Token'];
	}
}

export function login({ email, password }) {
	return async dispatch => {
		const response = await Api.login(email, md5(password));

		const { data, error } = response;
		const { token, account } = data || {};

		if (!error) {
			localStorage.setItem('user', JSON.stringify(account));
			localStorage.setItem('jwtToken', token);
			setAuthorizationToken(token);
			dispatch(setCurrentUser(account));
		}

		return response;
	};
}

export function logout() {
	return dispatch => {
		localStorage.removeItem('user');
		localStorage.removeItem('jwtToken');
		setAuthorizationToken(false);
		dispatch(setCurrentUser({}));
	};
}

export function setCurrentUser(user) {
	return {
		type: SET_CURRENT_USER,
		user
	};
}
