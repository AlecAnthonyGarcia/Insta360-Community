import Api from '../utils/Api';
import { TIMELINE_ACTIONS } from '../utils/Constants';

export const SET_CURRENT_TAB_KEY = 'SET_CURRENT_TAB_KEY';
export const SET_TIMELINE_POSTS_RESPONSE = 'SET_TIMELINE_POSTS_RESPONSE';
export const SET_FEATURED_POSTS_RESPONSE = 'SET_FEATURED_POSTS_RESPONSE';
export const SET_RECENT_POSTS_RESPONSE = 'SET_RECENT_POSTS_RESPONSE';
export const SET_LIKE_COUNT = 'SET_LIKE_COUNT';
export const SET_FOLLOWED = 'SET_FOLLOWED';
export const SET_FOLLOWS_MAP = 'SET_FOLLOWS_MAP';
export const SET_LIKES_MAP = 'SET_LIKES_MAP';

export function getTimelinePosts(lastTimestamp) {
	return async (dispatch) => {
		const response = await Api.getTimelinePosts(lastTimestamp);

		const { data } = response;
		const { list: shares } = data;

		let posts = [];

		shares.forEach((post) => {
			const { action, target } = post;

			if (action === TIMELINE_ACTIONS.PUBLISH) {
				const { share } = target;
				posts.push(share);
			}
		});

		dispatch(setTimelinePostsResponse(data));
		dispatch(setLikesMap({ shares: posts }));

		return response;
	};
}

export function getFeaturedPosts(postIdCursor) {
	return async (dispatch) => {
		const response = await Api.getFeaturedPosts(postIdCursor);

		const { data } = response;
		const { shares: posts } = data;

		dispatch(setFeaturedPostsResponse(data));
		dispatch(setFollowsMap(extractAccountsFromPosts(posts)));
		dispatch(setLikesMap(data));

		return response;
	};
}

export function getRecentPosts(postIdCursor, queue) {
	return async (dispatch) => {
		const response = await Api.getRecentPosts(postIdCursor, queue);

		const { data } = response;
		const { shares: posts } = data;

		dispatch(setRecentPostsResponse(data));
		dispatch(setFollowsMap(extractAccountsFromPosts(posts)));
		dispatch(setLikesMap(data));

		return response;
	};
}

export function likePost(postId) {
	return async (dispatch) => {
		const response = await Api.likePost(postId);

		const {
			data: { count },
		} = response;

		dispatch(setLikeCount(postId, count, true));

		return response;
	};
}

export function unlikePost(postId) {
	return async (dispatch) => {
		const response = await Api.unlikePost(postId);

		const {
			data: { count },
		} = response;

		dispatch(setLikeCount(postId, count, false));

		return response;
	};
}

export function followUser(userId) {
	return async (dispatch) => {
		const response = await Api.followUser(userId);

		dispatch(setFollowed(userId, true));

		return response;
	};
}

export function unfollowUser(userId) {
	return async (dispatch) => {
		const response = await Api.unfollowUser(userId);

		dispatch(setFollowed(userId, false));

		return response;
	};
}

export function setPostPrivacy(postId, isPublic) {
	return async () => await Api.setPostPrivacy(postId, isPublic);
}

export function setCurrentTabKey(tabKey) {
	return {
		type: SET_CURRENT_TAB_KEY,
		tabKey,
	};
}

export function setTimelinePostsResponse(response) {
	return {
		type: SET_TIMELINE_POSTS_RESPONSE,
		response,
	};
}

export function setFeaturedPostsResponse(response) {
	return {
		type: SET_FEATURED_POSTS_RESPONSE,
		response,
	};
}

export function setFollowsMap(accounts) {
	let followsMap = {};

	accounts.forEach((account) => {
		const { id: userId, followed } = account || {};

		if (userId) {
			followsMap[userId] = followed;
		}
	});

	return {
		type: SET_FOLLOWS_MAP,
		payload: {
			followsMap,
		},
	};
}

export function setLikesMap(response) {
	const { shares } = response;

	let likesMap = {};

	shares.forEach((post) => {
		const { id: postId, like, like_count: likeCount } = post;
		likesMap[postId] = {
			like,
			likeCount,
		};
	});

	return {
		type: SET_LIKES_MAP,
		payload: {
			likesMap,
		},
	};
}

export function setRecentPostsResponse(response) {
	return {
		type: SET_RECENT_POSTS_RESPONSE,
		response,
	};
}

export function setLikeCount(postId, count, like) {
	return {
		type: SET_LIKE_COUNT,
		payload: {
			postId,
			count,
			like,
		},
	};
}

export function setFollowed(userId, followed) {
	return {
		type: SET_FOLLOWED,
		payload: {
			userId,
			followed,
		},
	};
}

export function extractAccountsFromPosts(posts) {
	return posts.map((post) => {
		const { account } = post;
		return account;
	});
}
