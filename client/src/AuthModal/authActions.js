import axios from 'axios';
import md5 from 'blueimp-md5';

import Api from '../utils/Api';
import { RESPONSE_CODE_SUCCESS } from '../utils/Constants';

export const RESET_STATE = 'RESET_STATE';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_LOGIN_MODAL_VISIBILITY = 'SET_LOGIN_MODAL_VISIBILITY';
export const SET_SIGNUP_MODAL_VISIBILITY = 'SET_SIGNUP_MODAL_VISIBILITY';
export const SET_FORGOT_PASSWORD_MODAL_VISIBILITY =
	'SET_FORGOT_PASSWORD_MODAL_VISIBILITY';

export function setAuthorizationToken(token) {
	if (token) {
		axios.defaults.headers.common['X-User-Token'] = token;
	} else {
		delete axios.defaults.headers.common['X-User-Token'];
	}
}

export function login({ email, password }) {
	return async (dispatch) => {
		const response = await Api.login(email, md5(password));

		const { data, code } = response;
		const { token, account } = data || {};

		if (code === RESPONSE_CODE_SUCCESS) {
			localStorage.setItem('user', JSON.stringify(account));
			localStorage.setItem('jwtToken', token);
			setAuthorizationToken(token);
			dispatch(resetState());
			dispatch(setCurrentUser(account));
		}

		return response;
	};
}

export function signup({ email, password }) {
	return async (dispatch) => {
		const response = await Api.signup(email, md5(password));

		const { data, code } = response;
		const { token, account } = data || {};

		if (code === RESPONSE_CODE_SUCCESS) {
			localStorage.setItem('user', JSON.stringify(account));
			localStorage.setItem('jwtToken', token);
			setAuthorizationToken(token);
			dispatch(resetState());
			dispatch(setCurrentUser(account));
		}

		return response;
	};
}

export function logout() {
	return (dispatch) => {
		localStorage.removeItem('user');
		localStorage.removeItem('jwtToken');
		setAuthorizationToken(false);
		dispatch(resetState());
	};
}

export function isMe(userId) {
	return (dispatch, getState) => {
		const {
			authReducer: {
				user: { id: authUserId },
			},
		} = getState();
		return `${authUserId}` === `${userId}`;
	};
}

export function resetState() {
	return {
		type: RESET_STATE,
	};
}

export function setCurrentUser(user) {
	return {
		type: SET_CURRENT_USER,
		user,
	};
}

export function setLoginModalVisibility(visible) {
	return {
		type: SET_LOGIN_MODAL_VISIBILITY,
		visible,
	};
}

export function setSignupModalVisibility(visible) {
	return {
		type: SET_SIGNUP_MODAL_VISIBILITY,
		visible,
	};
}

export function setForgotPasswordModalVisibility(visible) {
	return {
		type: SET_FORGOT_PASSWORD_MODAL_VISIBILITY,
		visible,
	};
}
