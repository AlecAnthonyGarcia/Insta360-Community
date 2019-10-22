import { combineReducers } from 'redux';
import authReducer from '../AuthModal/authReducer';
import homeReducer from '../HomePage/homeReducer';

export default combineReducers({
	authReducer,
	homeReducer
});
