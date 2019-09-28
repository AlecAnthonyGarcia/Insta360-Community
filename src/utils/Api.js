import { COMMUNITY_API } from './Constants';

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

const Api = {
	getRecentPosts
};

export default Api;
