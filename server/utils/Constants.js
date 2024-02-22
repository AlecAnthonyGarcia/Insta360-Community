const API_VERSION = 'v1';
const APP_LOCAL_ID = '14836953';
const BASE_API = 'https://openapi.insta360.com/';

const ACCOUNT_API = `${BASE_API}account/${API_VERSION}/`;
const AUTH_API = `${BASE_API}auth/${API_VERSION}/`;
const COMMUNITY_API = `${BASE_API}community/${API_VERSION}/`;
const FOLLOW_API = `${BASE_API}follow/${API_VERSION}/`;
const NOTICE_API = `${BASE_API}notice/${API_VERSION}/`;
const SHARE_API = `${BASE_API}share/${API_VERSION}/`;

const Constants = {
	ACCOUNT_API,
	APP_LOCAL_ID,
	AUTH_API,
	BASE_API,
	COMMUNITY_API,
	FOLLOW_API,
	NOTICE_API,
	SHARE_API,
};

module.exports = Constants;
