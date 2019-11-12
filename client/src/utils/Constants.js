export const API_VERSION = 'v1';
export const BASE_API = 'https://openapi.insta360.com/';
export const ACCOUNT_API = `${BASE_API}account/${API_VERSION}/`;
export const FOLLOW_API = `${BASE_API}follow/${API_VERSION}/`;
export const COMMUNITY_API = `${BASE_API}community/${API_VERSION}/`;
export const SHARE_API = `${BASE_API}share/${API_VERSION}/`;
export const NOTICE_API = `${BASE_API}notice/${API_VERSION}/`;
export const AUTH_API = `${BASE_API}auth/${API_VERSION}/`;

export const FEED_CARD_PARENTS = {
	FEATURED: 'FEATURED_FEED',
	RECENT: 'RECENT_FEED',
	TIMELINE: 'TIMELINE_FEED'
};

export const TIMELINE_ACTIONS = {
	LIKE: 'like_post_set',
	PUBLISH: 'publish_post'
};

export const NOTIFICATION_ACTIONS = {
	LIKE: 'like_post',
	FOLLOW: 'follow_user'
};
