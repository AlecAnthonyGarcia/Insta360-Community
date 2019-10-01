import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './reducers';
import { setCurrentUser } from './LoginModal/loginActions';

export default function configureStore(preloadedState) {
	const middlewares = [thunkMiddleware];
	const middlewareEnhancer = applyMiddleware(...middlewares);

	const enhancers = [middlewareEnhancer];
	const composedEnhancers = compose(...enhancers);

	const store = createStore(rootReducer, preloadedState, composedEnhancers);

	if (localStorage.jwtToken) {
		try {
			const user = JSON.parse(localStorage.user);
			store.dispatch(setCurrentUser(user));
		} catch (e) {
			store.dispatch(setCurrentUser({}));
		}
	}

	return store;
}
