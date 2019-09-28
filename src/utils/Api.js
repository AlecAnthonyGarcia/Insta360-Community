import { ACCOUNT_API, COMMUNITY_API, SHARE_API } from './Constants';

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

const Api = {
	getUser,
	getUserPosts,
	getUserPopularPosts,
	getPost,
	getRecentPosts,
	getComments
};

export default Api;
