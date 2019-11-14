import {
	SET_CURRENT_TAB_KEY,
	SET_TIMELINE_POSTS_RESPONSE,
	SET_FEATURED_POSTS_RESPONSE,
	SET_RECENT_POSTS_RESPONSE,
	SET_LIKE_COUNT,
	SET_FOLLOWED,
	SET_FOLLOWS_MAP,
	SET_LIKES_MAP
} from './homeActions';

const DEFAULT_STATE = {
	currentTabKey: 'featured',
	timelinePostsResponse: {
		list: []
	},
	featuredPostsResponse: {
		shares: []
	},
	recentPostsResponse: {
		shares: []
	},
	likesMap: {},
	followsMap: {}
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_CURRENT_TAB_KEY:
			return {
				...state,
				currentTabKey: action.tabKey
			};
		case SET_TIMELINE_POSTS_RESPONSE:
			const { timelinePostsResponse } = state;
			const { list: previousTimelinePosts } = timelinePostsResponse;

			const { response } = action;
			const { list } = response;

			const lastPost = list[list.length - 1];

			const { feed_time } = lastPost || {};

			return {
				...state,
				timelinePostsResponse: {
					...action.response,
					list: previousTimelinePosts.concat(list),
					lastTimestamp: feed_time
				}
			};
		case SET_FEATURED_POSTS_RESPONSE: {
			const { featuredPostsResponse } = state;
			const { shares: previousFeaturedPosts } = featuredPostsResponse;

			const { response } = action;
			const { shares } = response;
			const lastPost = shares[shares.length - 1];

			const { id: lastPostId } = lastPost || {};

			return {
				...state,
				featuredPostsResponse: {
					...action.response,
					shares: previousFeaturedPosts.concat(shares),
					postIdCursor: lastPostId
				}
			};
		}
		case SET_RECENT_POSTS_RESPONSE: {
			const { recentPostsResponse } = state;
			const { shares: previousRecentPosts } = recentPostsResponse;

			const { response } = action;
			const { shares, queue } = response;
			const lastPost = shares[shares.length - 1];

			const { id: lastPostId } = lastPost || {};

			return {
				...state,
				recentPostsResponse: {
					...action.response,
					shares: previousRecentPosts.concat(shares),
					queue,
					postIdCursor: lastPostId
				}
			};
		}
		case SET_LIKE_COUNT: {
			const { likesMap } = state;
			const { postId, count: likeCount, like } = action.payload;

			return {
				...state,
				likesMap: {
					...likesMap,
					[postId]: {
						like,
						likeCount
					}
				}
			};
		}
		case SET_FOLLOWS_MAP: {
			const { followsMap } = state;
			const { followsMap: newFollowsMap } = action.payload;

			return {
				...state,
				followsMap: {
					...followsMap,
					...newFollowsMap
				}
			};
		}
		case SET_FOLLOWED: {
			const { followsMap } = state;
			const { userId, followed } = action.payload;

			return {
				...state,
				followsMap: {
					...followsMap,
					[userId]: followed
				}
			};
		}
		case SET_LIKES_MAP: {
			const { likesMap } = state;
			const { likesMap: newLikesMap } = action.payload;

			return {
				...state,
				likesMap: {
					...likesMap,
					...newLikesMap
				}
			};
		}
		default:
			return state;
	}
};
