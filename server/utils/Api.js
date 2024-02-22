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
	const response = await axios.get(`${NOTICE_API}getUnreadCount`);
	const { data } = response;
	return data;
}

async function getNotifications(timestamp) {
	const pageSize = 20;
	let url = `${NOTICE_API}listUserNotice?page_size=${pageSize}`;
	if (timestamp) {
		url = `${url}&timestamp=${timestamp}`;
	}
	const response = await axios.get(url);
	const { data } = response;
	return data;
}

async function setNotificationsRead() {
	const { data } = await axios.post(`${NOTICE_API}setRead`, {
		notice_ids: 'all',
	});
	return data;
}

async function getUser(userId) {
	const response = await axios.get(
		`${ACCOUNT_API}getProfile?user_id=${userId}`
	);
	const { data } = response;
	return data;
}

async function getFollowing(userId, pageNumber) {
	const pageSize = 20;
	const response = await axios.get(
		`${FOLLOW_API}getUserFollows?page_number=${pageNumber}&page_size=${pageSize}&user_id=${userId}`
	);
	const { data } = response;
	return data;
}

async function getFollowers(userId, pageNumber) {
	const pageSize = 20;
	const response = await axios.get(
		`${FOLLOW_API}getUserFollower?page_number=${pageNumber}&page_size=${pageSize}&user_id=${userId}`
	);
	const { data } = response;
	return data;
}

async function getLikedPosts(userId, pageNumber) {
	const pageSize = 20;
	const response = await axios.get(
		`${SHARE_API}listUserLikeShare?page_number=${pageNumber}&page_size=${pageSize}&user_id=${userId}`
	);
	const { data } = response;
	return data;
}

async function getUserPopularPosts(userId) {
	const response = await axios.get(
		`${SHARE_API}getUserPopularShare?user_id=${userId}`
	);
	const { data } = response;
	return data;
}

async function getUserPosts(userId, pageNumber) {
	const pageSize = 20;
	const response = await axios.get(
		`${SHARE_API}listUserShare?page_number=${pageNumber}&page_size=${pageSize}&user_id=${userId}`
	);
	const { data } = response;
	return data;
}

async function getTimelinePosts(lastTimestamp) {
	const pageSize = 20;
	let url = `${COMMUNITY_API}timeline?page_size=${pageSize}`;
	if (lastTimestamp) {
		url = `${url}&last_timestamp=${lastTimestamp}`;
	}
	const { data } = await axios.get(url);
	return data;
}

async function getFeaturedPosts(postIdCursor) {
	const pageSize = 20;
	let url = `${BASE_API}community/content/feature?page_size=${pageSize}`;
	if (postIdCursor) {
		url = `${url}&post_id=${postIdCursor}`;
	}
	const response = await axios.get(url);
	const { data } = response;
	return data;
}

async function getRecentPosts(postIdCursor, queue) {
	const pageSize = 20;
	const queueIndex = 1;
	let url = `${COMMUNITY_API}content/recent?page_size=${pageSize}`;
	if (postIdCursor) {
		url = `${url}&post_id=${postIdCursor}&queue=${queue}`;
	} else {
		url = `${url}&queue_index=${queueIndex}`;
	}
	const response = await axios.get(url);
	const { data } = response;
	return data;
}

async function getPost(postId) {
	const response = await axios.get(`${SHARE_API}info/${postId}`);
	const { data } = response;
	return data;
}

async function getComments(postId, pageNumber) {
	const pageSize = 20;
	const response = await axios.get(
		`${SHARE_API}comment/getComments?page_number=${pageNumber}&page_size=${pageSize}&post_id=${postId}`
	);
	const { data } = response;
	return data;
}

async function getTag(tag) {
	const response = await axios.get(`${SHARE_API}tag/info?tag=${tag}`);
	const { data } = response;
	return data;
}

async function getTagPosts(tag, postIdCursor) {
	const pageSize = 20;
	let url = `${SHARE_API}tag/posts/recent?page_size=${pageSize}&tag=${tag}`;
	if (postIdCursor) {
		url = `${url}&post_id=${postIdCursor}`;
	}
	const response = await axios.get(url);
	const { data } = response;
	return data;
}

async function getTagPopularPosts(tag) {
	const pageSize = 6;
	const response = await axios.get(
		`${SHARE_API}tag/posts/popular?page_size=${pageSize}&tag=${tag}`
	);
	const { data } = response;
	return data;
}

async function getRecommendedSearchTags() {
	const size = 100;
	const response = await axios.get(
		`${SHARE_API}tag/search/getRecommend?size=${size}`
	);
	const { data } = response;
	return data;
}

async function getRecommendedSearchUsers() {
	const size = 100;
	const response = await axios.get(
		`${ACCOUNT_API}search/getRecommend?size=${size}`
	);
	const { data } = response;
	return data;
}

async function searchTags(query) {
	const size = 100;
	const response = await axios.get(
		`${SHARE_API}tag/search?size=${size}&value=${query}`
	);
	const { data } = response;
	return data;
}

async function searchUsers(query) {
	const size = 100;
	const response = await axios.get(
		`${ACCOUNT_API}search?size=${size}&value=${query}`
	);
	const { data } = response;
	return data;
}

async function likePost(postId) {
	const response = await axios.get(`${SHARE_API}like/doLike/${postId}`);
	const { data } = response;
	return data;
}

async function unlikePost(postId) {
	const response = await axios.get(`${SHARE_API}like/undoLike/${postId}`);
	const { data } = response;
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
	followUser,
	unfollowUser,
};

module.exports = Api;
