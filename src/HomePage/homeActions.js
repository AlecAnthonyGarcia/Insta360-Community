import Api from '../utils/Api';

export const SET_CURRENT_TAB_KEY = 'SET_CURRENT_TAB_KEY';
export const SET_TIMELINE_POSTS = 'SET_TIMELINE_POSTS';
export const SET_FEATURED_POSTS_RESPONSE = 'SET_FEATURED_POSTS_RESPONSE';
export const SET_RECENT_POSTS_RESPONSE = 'SET_RECENT_POSTS_RESPONSE';
export const SET_LIKE_COUNT = 'SET_LIKE_COUNT';
export const SET_FOLLOWED = 'SET_FOLLOWED';

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

export function getFeaturedPosts(postIdCursor) {
	return async dispatch => {
		const response = await Api.getFeaturedPosts(postIdCursor);

		const { data } = response;

		dispatch(setFeaturedPostsResponse(data));

		return response;
	};
}

export function getRecentPosts(postIdCursor, queue) {
	return async dispatch => {
		const response = await Api.getRecentPosts(postIdCursor, queue);

		const { data } = response;

		dispatch(setRecentPostsResponse(data));

		return response;
	};
}

export function likePost(postId, parent) {
	return async dispatch => {
		const response = await Api.likePost(postId);

		const {
			data: { count }
		} = response;

		dispatch(setLikeCount(postId, count, true, parent));

		return response;
	};
}

export function unlikePost(postId, parent) {
	return async dispatch => {
		const response = await Api.unlikePost(postId);

		const {
			data: { count }
		} = response;

		dispatch(setLikeCount(postId, count, false, parent));

		return response;
	};
}

export function followUser(userId, parent) {
	return async dispatch => {
		const response = await Api.followUser(userId);

		dispatch(setFollowed(userId, true, parent));

		return response;
	};
}

export function unfollowUser(userId, parent) {
	return async dispatch => {
		const response = await Api.unfollowUser(userId);

		dispatch(setFollowed(userId, false, parent));

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

export function setFeaturedPostsResponse(response) {
	return {
		type: SET_FEATURED_POSTS_RESPONSE,
		response
	};
}

export function setRecentPostsResponse(response) {
	return {
		type: SET_RECENT_POSTS_RESPONSE,
		response
	};
}

export function setLikeCount(postId, count, like, parent) {
	return {
		type: SET_LIKE_COUNT,
		payload: {
			postId,
			count,
			like,
			parent
		}
	};
}

export function setFollowed(userId, followed, parent) {
	return {
		type: SET_FOLLOWED,
		payload: {
			userId,
			followed,
			parent
		}
	};
}
