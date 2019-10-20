import { SET_CURRENT_USER } from './loginActions';
import { SET_LOGIN_MODAL_VISIBILITY } from './loginActions';

const DEFAULT_STATE = {
	isAuthenticated: false,
	isLoginModalOpen: false,
	user: {}
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_CURRENT_USER:
			return {
				...state,
				isAuthenticated: !!Object.keys(action.user).length,
				user: action.user
			};
		case SET_LOGIN_MODAL_VISIBILITY:
			return {
				...state,
				isLoginModalOpen: action.visible
			};
		default:
			return state;
	}
};
