import axios from 'axios';
import md5 from 'blueimp-md5';

async function login(email, password) {
	const { data } = await axios.post('/api/login', {
		username: email,
		password,
	});
	return data;
}

async function signup(email, password) {
	const { data } = await axios.post('/api/signup', {
		username: email,
		password,
	});
	return data;
}

async function getUser(userId) {
	const url = '/api/getUser';
	const params = { userId };
	const { data } = await axios.get(url, { params });
	return data;
}

async function getUserPosts(userId, pageNumber) {
	const url = '/api/getUserPosts';
	const params = { pageNumber, userId };
	const { data } = await axios.get(url, { params });
	return data;
}

async function getUserPopularPosts(userId) {
	const url = '/api/getUserPopularPosts';
	const params = { userId };
	const { data } = await axios.get(url, { params });
	return data;
}

async function getPost(postId) {
	const url = '/api/getPost';
	const params = { postId };
	const { data } = await axios.get(url, { params });
	return data;
}

async function getTimelinePosts(lastTimestamp) {
	const url = '/api/getTimelinePosts';
	const params = {
		...(lastTimestamp && {
			lastTimestamp,
		}),
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getFeaturedPosts(postIdCursor) {
	const url = '/api/getFeaturedPosts';
	const params = {
		...(postIdCursor && {
			cursor: postIdCursor,
		}),
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getRecentPosts(postIdCursor, queue) {
	const url = '/api/getRecentPosts';
	const params = {
		...(postIdCursor && {
			cursor: postIdCursor,
			queue,
		}),
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getTag(tag) {
	const url = '/api/getTag';
	const params = { tag };
	const { data } = await axios.get(url, { params });
	return data;
}

async function getTagPosts(tag, postIdCursor) {
	const url = '/api/getTagPosts';
	const params = {
		tag,
		...(postIdCursor && {
			cursor: postIdCursor,
		}),
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getTagPopularPosts(tag) {
	const url = '/api/getTagPopularPosts';
	const params = { tag };
	const { data } = await axios.get(url, { params });
	return data;
}

async function getComments(postId, pageNumber) {
	const url = '/api/getComments';
	const params = { pageNumber, postId };
	const { data } = await axios.get(url, { params });
	return data;
}

async function getRecommendedSearchTags() {
	const { data } = await axios.get('/api/getRecommendedSearchTags');
	return data;
}

async function getRecommendedSearchUsers() {
	const { data } = await axios.get('/api/getRecommendedSearchUsers');
	return data;
}

async function searchTags(query) {
	const url = '/api/searchTags';
	const params = { query };
	const { data } = await axios.get(url, { params });
	return data;
}

async function searchUsers(query) {
	const url = '/api/searchUsers';
	const params = { query };
	const { data } = await axios.get(url, { params });
	return data;
}

async function followUser(userId) {
	const { data } = await axios.post('/api/followUser', { userId });
	return data;
}

async function unfollowUser(userId) {
	const { data } = await axios.post('/api/unfollowUser', { userId });
	return data;
}

async function getFollowing(userId, pageNumber) {
	const url = '/api/getFollowing';
	const params = { pageNumber, userId };
	const { data } = await axios.get(url, { params });
	return data;
}

async function getFollowers(userId, pageNumber) {
	const url = '/api/getFollowers';
	const params = { pageNumber, userId };
	const { data } = await axios.get(url, { params });
	return data;
}

async function getLikedPosts(userId, pageNumber) {
	const url = '/api/getLikedPosts';
	const params = { pageNumber, userId };
	const { data } = await axios.get(url, { params });
	return data;
}

async function likePost(postId) {
	const url = '/api/likePost';
	const params = { postId };
	const { data } = await axios.get(url, { params });
	return data;
}

async function unlikePost(postId) {
	const url = '/api/unlikePost';
	const params = { postId };
	const { data } = await axios.get(url, { params });
	return data;
}

async function getNotifications(timestamp) {
	const url = '/api/getNotifications';
	const params = {
		...(timestamp && {
			timestamp,
		}),
	};
	const { data } = await axios.get(url, { params });
	return data;
}

async function getUnreadNotificationsCount() {
	const { data } = await axios.get('/api/getUnreadNotificationsCount');
	return data;
}

async function setNotificationsRead() {
	const { data } = await axios.post('/api/setNotificationsRead', {});
	return data;
}

async function sendVerificationCode(email) {
	const { data } = await axios.post('/api/sendVerificationCode', { email });
	return data;
}

async function resetPassword({ email, password, verificationCode }) {
	const { data } = await axios.post('/api/resetPassword', {
		email,
		password: md5(password),
		verificationCode,
	});
	return data;
}

const Api = {
	login,
	signup,
	getUser,
	getUserPosts,
	getUserPopularPosts,
	getPost,
	getTimelinePosts,
	getFeaturedPosts,
	getRecentPosts,
	getTag,
	getTagPosts,
	getTagPopularPosts,
	getComments,
	getRecommendedSearchTags,
	getRecommendedSearchUsers,
	searchTags,
	searchUsers,
	followUser,
	unfollowUser,
	getFollowing,
	getFollowers,
	getLikedPosts,
	likePost,
	unlikePost,
	getNotifications,
	getUnreadNotificationsCount,
	setNotificationsRead,
	sendVerificationCode,
	resetPassword,
};

export default Api;
