import axios from 'axios';
import md5 from 'blueimp-md5';

async function login(email, password) {
	const { data } = await axios.post(`/api/login`, {
		username: email,
		password,
	});
	return data;
}

async function signup(email, password) {
	const { data } = await axios.post(`/api/signup`, {
		username: email,
		password,
	});
	return data;
}

async function getUser(userId) {
	const { data } = await axios.get(`/api/getUser?userId=${userId}`);
	return data;
}

async function getUserPosts(userId, pageNumber) {
	const { data } = await axios.get(
		`/api/getUserPosts?pageNumber=${pageNumber}&userId=${userId}`
	);
	return data;
}

async function getUserPopularPosts(userId) {
	const { data } = await axios.get(`/api/getUserPopularPosts?userId=${userId}`);
	return data;
}

async function getPost(postId) {
	const { data } = await axios.get(`/api/getPost?postId=${postId}`);
	return data;
}

async function getTimelinePosts(lastTimestamp) {
	let url = `/api/getTimelinePosts`;
	if (lastTimestamp) {
		url = `${url}?lastTimestamp=${lastTimestamp}`;
	}
	const { data } = await axios.get(url);
	return data;
}

async function getFeaturedPosts(postIdCursor) {
	let url = `/api/getFeaturedPosts`;
	if (postIdCursor) {
		url = `${url}?cursor=${postIdCursor}`;
	}
	const { data } = await axios.get(url);
	return data;
}

async function getRecentPosts(postIdCursor, queue) {
	let url = `/api/getRecentPosts`;
	if (postIdCursor) {
		url = `${url}?cursor=${postIdCursor}&queue=${queue}`;
	}
	const { data } = await axios.get(url);
	return data;
}

async function getTag(tag) {
	const { data } = await axios.get(`/api/getTag?tag=${tag}`);
	return data;
}

async function getTagPosts(tag, postIdCursor) {
	let url = `/api/getTagPosts?tag=${tag}`;
	if (postIdCursor) {
		url = `${url}&cursor=${postIdCursor}`;
	}
	const { data } = await axios.get(url);
	return data;
}

async function getTagPopularPosts(tag) {
	const { data } = await axios.get(`/api/getTagPopularPosts?tag=${tag}`);
	return data;
}

async function getComments(postId, pageNumber) {
	const { data } = await axios.get(
		`/api/getComments?pageNumber=${pageNumber}&postId=${postId}`
	);
	return data;
}

async function getRecommendedSearchTags() {
	const { data } = await axios.get(`/api/getRecommendedSearchTags`);
	return data;
}

async function getRecommendedSearchUsers() {
	const { data } = await axios.get(`/api/getRecommendedSearchUsers`);
	return data;
}

async function searchTags(query) {
	const { data } = await axios.get(`/api/searchTags?query=${query}`);
	return data;
}

async function searchUsers(query) {
	const { data } = await axios.get(`/api/searchUsers?query=${query}`);
	return data;
}

async function followUser(userId) {
	const { data } = await axios.post(`/api/followUser`, { userId });
	return data;
}

async function unfollowUser(userId) {
	const { data } = await axios.post(`/api/unfollowUser`, { userId });
	return data;
}

async function getFollowing(userId, pageNumber) {
	const { data } = await axios.get(
		`/api/getFollowing?pageNumber=${pageNumber}&userId=${userId}`
	);
	return data;
}

async function getFollowers(userId, pageNumber) {
	const { data } = await axios.get(
		`/api/getFollowers?pageNumber=${pageNumber}&userId=${userId}`
	);
	return data;
}

async function getLikedPosts(userId, pageNumber) {
	const { data } = await axios.get(
		`/api/getLikedPosts?pageNumber=${pageNumber}&userId=${userId}`
	);
	return data;
}

async function likePost(postId) {
	const { data } = await axios.get(`/api/likePost?postId=${postId}`);
	return data;
}

async function unlikePost(postId) {
	const { data } = await axios.get(`/api/unlikePost?postId=${postId}`);
	return data;
}

async function getNotifications(timestamp) {
	let url = `/api/getNotifications`;
	if (timestamp) {
		url = `${url}&timestamp=${timestamp}`;
	}
	const { data } = await axios.get(url);
	return data;
}

async function getUnreadNotificationsCount() {
	const { data } = await axios.get(`/api/getUnreadNotificationsCount`);
	return data;
}

async function setNotificationsRead() {
	const { data } = await axios.post(`/api/setNotificationsRead`, {});
	return data;
}

async function sendVerificationCode(email) {
	const { data } = await axios.post(`/api/sendVerificationCode`, { email });
	return data;
}

async function resetPassword({ email, password, verificationCode }) {
	const { data } = await axios.post(`/api/resetPassword`, {
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
