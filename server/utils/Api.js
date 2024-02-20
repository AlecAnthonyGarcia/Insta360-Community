const axios = require('axios');

const { ACCOUNT_API, SHARE_API } = require('./Constants');

async function getUser(userId) {
	const response = await axios.get(
		`${ACCOUNT_API}getProfile?user_id=${userId}`
	);
	const { data } = response;
	return data;
}

async function getPost(postId) {
	const response = await axios.get(`${SHARE_API}info/${postId}`);
	const { data } = response;
	return data;
}

async function getTag(tag) {
	const response = await axios.get(`${SHARE_API}tag/info?tag=${tag}`);
	const { data } = response;
	return data;
}

const Api = {
	getUser,
	getPost,
	getTag,
};

module.exports = Api;
