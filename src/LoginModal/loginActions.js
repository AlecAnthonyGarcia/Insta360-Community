import md5 from 'blueimp-md5';

import Api from '../utils/Api';

export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export function login({ email, password }) {
	return async dispatch => {
		const response = await Api.login(email, md5(password));

		const { data, error } = response;
		const { token, account } = data || {};

		if (!error) {
			localStorage.setItem('jwtToken', token);
			localStorage.setItem('user', JSON.stringify(account));
			dispatch(setCurrentUser(account));
		}

		return response;
	};
}

export function logout() {
	return dispatch => {
		localStorage.removeItem('jwtToken');
		localStorage.removeItem('user');
		dispatch(setCurrentUser({}));
	};
}

export function setCurrentUser(user) {
	return {
		type: SET_CURRENT_USER,
		user
	};
}
