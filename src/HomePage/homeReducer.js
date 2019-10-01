import {
	SET_CURRENT_TAB_KEY,
	SET_TIMELINE_POSTS,
	SET_FEATURED_POSTS,
	SET_RECENT_POSTS
} from './homeActions';

const DEFAULT_STATE = {
	currentTabKey: 'featured',
	timelinePosts: [],
	featuredPosts: [],
	recentPosts: []
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_CURRENT_TAB_KEY:
			return {
				...state,
				currentTabKey: action.tabKey
			};
		case SET_TIMELINE_POSTS:
			return {
				...state,
				timelinePosts: action.posts
			};
		case SET_FEATURED_POSTS:
			return {
				...state,
				featuredPosts: action.posts
			};
		case SET_RECENT_POSTS:
			return {
				...state,
				recentPosts: action.posts
			};
		default:
			return state;
	}
};
