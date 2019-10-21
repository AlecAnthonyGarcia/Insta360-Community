import {
	SET_CURRENT_TAB_KEY,
	SET_TIMELINE_POSTS,
	SET_FEATURED_POSTS_RESPONSE,
	SET_RECENT_POSTS_RESPONSE,
	SET_LIKE_COUNT,
	SET_FOLLOWED
} from './homeActions';

import { FEED_CARD_PARENTS } from '../utils/Constants';

const DEFAULT_STATE = {
	currentTabKey: 'featured',
	timelinePosts: [],
	featuredPostsResponse: {
		shares: []
	},
	recentPostsResponse: {
		shares: []
	}
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
		case SET_FEATURED_POSTS_RESPONSE: {
			const { featuredPostsResponse } = state;
			const { shares: previousFeaturedPosts } = featuredPostsResponse;

			const { response } = action;
			const { shares } = response;
			const lastPost = shares[shares.length - 1];

			return {
				...state,
				featuredPostsResponse: {
					...action.response,
					shares: previousFeaturedPosts.concat(shares),
					postIdCursor: lastPost.id
				}
			};
		}
		case SET_RECENT_POSTS_RESPONSE: {
			const { recentPostsResponse } = state;
			const { shares: previousRecentPosts } = recentPostsResponse;

			const { response } = action;
			const { shares, queue } = response;
			const lastPost = shares[shares.length - 1];

			return {
				...state,
				recentPostsResponse: {
					...action.response,
					shares: previousRecentPosts.concat(shares),
					queue,
					postIdCursor: lastPost.id
				}
			};
		}
		case SET_LIKE_COUNT: {
			const { postId, count, like, parent } = action.payload;

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
						return { ...post, like_count: count, like };
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
