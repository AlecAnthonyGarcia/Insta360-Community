import {
	SET_CURRENT_TAB_KEY,
	SET_TIMELINE_POSTS,
	SET_FEATURED_POSTS,
	SET_RECENT_POSTS,
	SET_LIKE_COUNT,
	SET_FOLLOWED
} from './homeActions';

import { FEED_CARD_PARENTS } from '../utils/Constants';

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
		case SET_LIKE_COUNT: {
			const { postId, count, parent } = action.payload;

			let posts;
			let stateKey;

			switch (parent) {
				case FEED_CARD_PARENTS.FEATURED:
					stateKey = 'featuredPosts';
					posts = state[stateKey];
					break;
				case FEED_CARD_PARENTS.RECENT:
					stateKey = 'recentPosts';
					posts = state[stateKey];
					break;
				default:
			}

			return {
				...state,
				[stateKey]: posts.map(post => {
					if (post.id === postId) {
						return { ...post, like_count: count, like: true };
					}
					return post;
				})
			};
		}
		case SET_FOLLOWED: {
			const { userId, followed, parent } = action.payload;

			let posts;
			let stateKey;

			switch (parent) {
				case FEED_CARD_PARENTS.FEATURED:
					stateKey = 'featuredPosts';
					posts = state[stateKey];
					break;
				case FEED_CARD_PARENTS.RECENT:
					stateKey = 'recentPosts';
					posts = state[stateKey];
					break;
				default:
			}

			return {
				...state,
				[stateKey]: posts.map(post => {
					const { account } = post;
					const { id } = account;

					if (id === userId) {
						return { ...post, account: { ...account, followed } };
					}
					return post;
				})
			};
		}
		default:
			return state;
	}
};
