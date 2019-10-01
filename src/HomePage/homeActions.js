import Api from '../utils/Api';

export const SET_CURRENT_TAB_KEY = 'SET_CURRENT_TAB_KEY';
export const SET_TIMELINE_POSTS = 'SET_TIMELINE_POSTS';
export const SET_FEATURED_POSTS = 'SET_FEATURED_POSTS';
export const SET_RECENT_POSTS = 'SET_RECENT_POSTS';

export function getTimelinePosts() {
	return async dispatch => {
		const response = await Api.getTimelinePosts();

		const {
			data: { shares }
		} = response;

		dispatch(setTimelinePosts(shares));

		return response;
	};
}

export function getFeaturedPosts() {
	return async dispatch => {
		const response = await Api.getFeaturedPosts();

		const {
			data: { shares }
		} = response;

		dispatch(setFeaturedPosts(shares));

		return response;
	};
}

export function getRecentPosts() {
	return async dispatch => {
		const response = await Api.getRecentPosts();

		const {
			data: { shares }
		} = response;

		dispatch(setRecentPosts(shares));

		return response;
	};
}

export function setCurrentTabKey(tabKey) {
	return {
		type: SET_CURRENT_TAB_KEY,
		tabKey
	};
}

export function setTimelinePosts(posts) {
	return {
		type: SET_TIMELINE_POSTS,
		posts
	};
}

export function setFeaturedPosts(posts) {
	return {
		type: SET_FEATURED_POSTS,
		posts
	};
}

export function setRecentPosts(posts) {
	return {
		type: SET_RECENT_POSTS,
		posts
	};
}
