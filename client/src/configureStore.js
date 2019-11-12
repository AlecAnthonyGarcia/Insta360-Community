import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './reducers';
import { setCurrentUser, setAuthorizationToken } from './AuthModal/authActions';

export default function configureStore(preloadedState) {
	const middlewares = [thunkMiddleware];
	const middlewareEnhancer = applyMiddleware(...middlewares);

	const enhancers = [middlewareEnhancer];
	const composedEnhancers = compose(...enhancers);

	const store = createStore(rootReducer, preloadedState, composedEnhancers);

	const { jwtToken, user } = localStorage;

	if (jwtToken) {
		setAuthorizationToken(jwtToken);
		try {
			const userObject = JSON.parse(user);
			store.dispatch(setCurrentUser(userObject));
		} catch (e) {
			store.dispatch(setCurrentUser({}));
		}
	}

	return store;
}
