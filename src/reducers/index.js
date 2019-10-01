import { combineReducers } from 'redux';
import loginReducer from '../LoginModal/loginReducer';
import homeReducer from '../HomePage/homeReducer';

export default combineReducers({
	loginReducer,
	homeReducer
});
