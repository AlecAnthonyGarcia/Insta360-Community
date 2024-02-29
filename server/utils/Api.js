const axios = require('axios');

const {
	ACCOUNT_API,
	AUTH_API,
	BASE_API,
	COMMUNITY_API,
	FOLLOW_API,
	NOTICE_API,
	SHARE_API,
} = require('./Constants');

async function login(username, password) {
	const { data } = await axios.post(`${ACCOUNT_API}signin`, {
		username,
		password,
	});
	return data;
}

async function signup(email, password) {
	const { data } = await axios.post(`${ACCOUNT_API}signup`, {
		username: email,
		password,
		source: 'account_center',
		subscribed: false,
	});
	return data;
}

async function sendVerificationCode(email) {
	const { data } = await axios.post(`${AUTH_API}captcha/send`, {
		email,
		type: 'forgetAccountPassword',
	});
	return data;
}

async function resetPassword(email, password, verificationCode) {
	const { data } = await axios.post(`${ACCOUNT_API}resetPassword`, {
		username: email,
		password,
		captcha: verificationCode,
	});
	return data;
}

async function getUnreadNotificationsCount() {
	const { data } = await axios.get(`${NOTICE_API}getUnreadCount`);
	return data;
}

async function getNotifications(timestamp) {
	const pageSize = 20;
	const url = `${NOTICE_API}listUserNotice`;
	const params = {
		page_size: pageSize,
		...(timestamp && {
			timestamp,
		}),
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function setNotificationsRead() {
	const { data } = await axios.post(`${NOTICE_API}setRead`, {
		notice_ids: 'all',
	});
	return data;
}

async function getUser(userId) {
	const url = `${ACCOUNT_API}getProfile`;
	const params = { user_id: userId };
	const { data } = await axios.get(url, { params });
	return data;
}

async function getFollowing(userId, pageNumber) {
	const pageSize = 20;
	const url = `${FOLLOW_API}getUserFollows`;
	const params = {
		page_number: pageNumber,
		page_size: pageSize,
		user_id: userId,
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getFollowers(userId, pageNumber) {
	const pageSize = 20;
	const url = `${FOLLOW_API}getUserFollower`;
	const params = {
		page_number: pageNumber,
		page_size: pageSize,
		user_id: userId,
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getMyPosts(pageNumber) {
	const pageSize = 20;
	const url = `${SHARE_API}listMyShare`;
	const params = {
		page_number: pageNumber,
		page_size: pageSize,
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getLikedPosts(userId, pageNumber) {
	const pageSize = 20;
	const url = `${SHARE_API}listUserLikeShare`;
	const params = {
		page_number: pageNumber,
		page_size: pageSize,
		user_id: userId,
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getUserPopularPosts(userId) {
	const url = `${SHARE_API}getUserPopularShare`;
	const params = { user_id: userId };
	const { data } = await axios.get(url, { params });
	return data;
}

async function getUserPosts(userId, pageNumber) {
	const pageSize = 20;
	const url = `${SHARE_API}listUserShare`;
	const params = {
		page_number: pageNumber,
		page_size: pageSize,
		user_id: userId,
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getTimelinePosts(lastTimestamp) {
	const pageSize = 20;
	const url = `${COMMUNITY_API}timeline`;
	const params = {
		page_size: pageSize,
		...(lastTimestamp && {
			last_timestamp: lastTimestamp,
		}),
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getFeaturedPosts(postIdCursor) {
	const pageSize = 20;
	const url = `${BASE_API}community/content/feature`;
	const params = {
		page_size: pageSize,
		...(postIdCursor && {
			post_id: postIdCursor,
		}),
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getRecentPosts(postIdCursor, queue) {
	const pageSize = 20;
	const queueIndex = 1;
	const url = `${COMMUNITY_API}content/recent`;
	const params = {
		page_size: pageSize,
		...(postIdCursor && {
			post_id: postIdCursor,
			queue,
		}),
		...(!postIdCursor && {
			queue_index: queueIndex,
		}),
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getPost(postId) {
	const { data } = await axios.get(`${SHARE_API}info/${postId}`);
	return data;
}

async function getComments(postId, pageNumber) {
	const pageSize = 20;
	const url = `${SHARE_API}comment/getComments`;
	const params = {
		page_number: pageNumber,
		page_size: pageSize,
		post_id: postId,
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getTag(tag) {
	const url = `${SHARE_API}tag/info`;
	const params = { tag };
	const { data } = await axios.get(url, { params });
	return data;
}

async function getTagPosts(tag, postIdCursor) {
	const pageSize = 20;
	const url = `${SHARE_API}tag/posts/recent`;
	const params = {
		page_size: pageSize,
		tag,
		...(postIdCursor && {
			post_id: postIdCursor,
		}),
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getTagPopularPosts(tag) {
	const pageSize = 6;
	const url = `${SHARE_API}tag/posts/popular`;
	const params = {
		page_size: pageSize,
		tag,
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getRecommendedSearchTags() {
	const size = 100;
	const url = `${SHARE_API}tag/search/getRecommend`;
	const params = { size };
	const { data } = await axios.get(url, { params });
	return data;
}

async function getRecommendedSearchUsers() {
	const size = 100;
	const url = `${ACCOUNT_API}search/getRecommend`;
	const params = { size };
	const { data } = await axios.get(url, { params });
	return data;
}

async function searchTags(query) {
	const size = 100;
	const url = `${SHARE_API}tag/search`;
	const params = {
		size,
		value: query,
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function searchUsers(query) {
	const size = 100;
	const url = `${ACCOUNT_API}search`;
	const params = {
		size,
		value: query,
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function likePost(postId) {
	const { data } = await axios.get(`${SHARE_API}like/doLike/${postId}`);
	return data;
}

async function unlikePost(postId) {
	const { data } = await axios.get(`${SHARE_API}like/undoLike/${postId}`);
	return data;
}

async function setPostPrivacy(postId, isPublic) {
	const { data } = await axios.post(
		`${SHARE_API}setPublic`,
		new URLSearchParams({
			post_id: postId,
			public: isPublic,
		})
	);
	return data;
}

async function followUser(userId) {
	const { data } = await axios.post(`${FOLLOW_API}doFollow`, {
		user_id: userId,
	});
	return data;
}

async function unfollowUser(userId) {
	const { data } = await axios.post(`${FOLLOW_API}undoFollow`, {
		user_id: userId,
	});
	return data;
}

const Api = {
	login,
	signup,
	sendVerificationCode,
	resetPassword,
	getUnreadNotificationsCount,
	getNotifications,
	setNotificationsRead,
	getUser,
	getFollowing,
	getFollowers,
	getMyPosts,
	getLikedPosts,
	getUserPopularPosts,
	getUserPosts,
	getTimelinePosts,
	getFeaturedPosts,
	getRecentPosts,
	getPost,
	getComments,
	getTag,
	getTagPosts,
	getTagPopularPosts,
	getRecommendedSearchTags,
	getRecommendedSearchUsers,
	searchTags,
	searchUsers,
	likePost,
	unlikePost,
	setPostPrivacy,
	followUser,
	unfollowUser,
};

module.exports = Api;
