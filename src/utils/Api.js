import { BASE_API, ACCOUNT_API, COMMUNITY_API, SHARE_API } from './Constants';

async function login(email, password) {
	const response = await fetch(`${ACCOUNT_API}signin`, {
		method: 'post',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username: email, password })
	});
	const data = await response.json();
	return data;
}

async function getUser(userId) {
	const response = await fetch(`${ACCOUNT_API}getProfile?user_id=${userId}`, {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

async function getUserPosts(userId, pageNumber) {
	const pageSize = 20;
	const response = await fetch(
		`${SHARE_API}listUserShare?page_number=${pageNumber}&page_size=${pageSize}&user_id=${userId}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}

async function getUserPopularPosts(userId) {
	const response = await fetch(
		`${SHARE_API}getUserPopularShare?user_id=${userId}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}

async function getPost(postId) {
	const response = await fetch(`${SHARE_API}info/${postId}`, {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

async function getTimelinePosts(postIdCursor) {
	const pageSize = 20;
	let url = `${COMMUNITY_API}timeline?page_size=${pageSize}`;
	if (postIdCursor) {
		url = `${url}?post_id=${postIdCursor}`;
	}
	const response = await fetch(url, {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

async function getFeaturedPosts(postIdCursor) {
	const pageSize = 20;
	let url = `${BASE_API}community/content/feature?page_size=${pageSize}`;
	if (postIdCursor) {
		url = `${url}?post_id=${postIdCursor}`;
	}
	const response = await fetch(url, {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

async function getRecentPosts(postIdCursor) {
	const pageSize = 20;
	let url = `${COMMUNITY_API}content/recent?page_size=${pageSize}`;
	if (postIdCursor) {
		url = `${url}?post_id=${postIdCursor}`;
	}
	const response = await fetch(url, {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

async function getTag(tag) {
	const response = await fetch(`${SHARE_API}tag/info?tag=${tag}`, {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

async function getTagPosts(tag, pageNumber) {
	const pageSize = 20;
	const response = await fetch(
		`${SHARE_API}tag/posts/recent?page_number=${pageNumber}&page_size=${pageSize}&tag=${tag}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}

async function getTagPopularPosts(tag) {
	const pageSize = 6;
	const response = await fetch(
		`${SHARE_API}tag/posts/popular?page_size=${pageSize}&tag=${tag}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}

async function getComments(postId, pageNumber) {
	const pageSize = 20;
	const response = await fetch(
		`${SHARE_API}comment/getComments?page_number=${pageNumber}&page_size=${pageSize}&post_id=${postId}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}

async function getRecommendedSearchTags() {
	const size = 100;
	const response = await fetch(
		`${SHARE_API}tag/search/getRecommend?size=${size}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}

async function getRecommendedSearchUsers() {
	const size = 100;
	const response = await fetch(
		`${ACCOUNT_API}search/getRecommend?size=${size}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}

async function searchTags(query) {
	const size = 100;
	const response = await fetch(
		`${SHARE_API}tag/search?size=${size}&value=${query}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}

async function searchUsers(query) {
	const size = 100;
	const response = await fetch(
		`${ACCOUNT_API}search?size=${size}&value=${query}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}


async function likePost(postId) {
	const response = await fetch(`${SHARE_API}like/doLike/${postId}`, {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

async function unlikePost(postId) {
	const response = await fetch(`${SHARE_API}like/undoLike/${postId}`, {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

const Api = {
	login,
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
	searchUsers
	likePost,
	unlikePost
};

export default Api;
