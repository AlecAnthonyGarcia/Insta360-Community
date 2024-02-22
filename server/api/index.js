const express = require('express');
const api = express.Router();
const axios = require('axios');

const Insta360Api = require('../utils/Api');
const { APP_LOCAL_ID } = require('../utils/Constants');

api.all('/api/*', function (req, res, next) {
	const token = req.header('X-User-Token');

	if (token) {
		axios.defaults.headers.common['X-User-Token'] = token;
	} else {
		delete axios.defaults.headers.common['X-User-Token'];
	}

	// Required for all requests
	axios.defaults.headers.common['X-App-Local-Id'] = APP_LOCAL_ID;

	next();
});

api.post('/api/login', async function (req, res) {
	const { username, password } = req.body;

	const response = await Insta360Api.login(username, password);

	res.send(response);
});

api.post('/api/signup', async function (req, res) {
	const { username, password } = req.body;

	const response = await Insta360Api.signup(username, password);

	res.send(response);
});

api.post('/api/sendVerificationCode', async function (req, res) {
	const { email } = req.body;

	const response = await Insta360Api.sendVerificationCode(email);

	res.send(response);
});

api.post('/api/resetPassword', async function (req, res) {
	const { email, password, verificationCode } = req.body;

	const response = await Insta360Api.resetPassword(
		email,
		password,
		verificationCode
	);

	res.send(response);
});

api.get('/api/getUnreadNotificationsCount', async function (req, res) {
	const response = await Insta360Api.getUnreadNotificationsCount();

	res.send(response);
});

api.get('/api/getNotifications', async function (req, res) {
	const { timestamp } = req.query;

	const response = await Insta360Api.getNotifications(timestamp);

	res.send(response);
});

api.post('/api/setNotificationsRead', async function (req, res) {
	const response = await Insta360Api.setNotificationsRead();

	res.send(response);
});

api.get('/api/getUser', async function (req, res) {
	const { userId } = req.query;

	const response = await Insta360Api.getUser(userId);

	res.send(response);
});

api.get('/api/getFollowing', async function (req, res) {
	const { userId, pageNumber } = req.query;

	const response = await Insta360Api.getFollowing(userId, pageNumber);

	res.send(response);
});

api.get('/api/getFollowers', async function (req, res) {
	const { userId, pageNumber } = req.query;

	const response = await Insta360Api.getFollowers(userId, pageNumber);

	res.send(response);
});

api.get('/api/getLikedPosts', async function (req, res) {
	const { userId, pageNumber } = req.query;

	const response = await Insta360Api.getLikedPosts(userId, pageNumber);

	res.send(response);
});

api.get('/api/getUserPopularPosts', async function (req, res) {
	const { userId } = req.query;

	const response = await Insta360Api.getUserPopularPosts(userId);

	res.send(response);
});

api.get('/api/getUserPosts', async function (req, res) {
	const { userId, pageNumber } = req.query;

	const response = await Insta360Api.getUserPosts(userId, pageNumber);

	res.send(response);
});

api.get('/api/getTimelinePosts', async function (req, res) {
	const { lastTimestamp } = req.query;

	const response = await Insta360Api.getTimelinePosts(lastTimestamp);

	res.send(response);
});

api.get('/api/getFeaturedPosts', async function (req, res) {
	const { cursor } = req.query;

	const response = await Insta360Api.getFeaturedPosts(cursor);

	res.send(response);
});

api.get('/api/getRecentPosts', async function (req, res) {
	const { cursor, queue } = req.query;

	const response = await Insta360Api.getRecentPosts(cursor, queue);

	res.send(response);
});

api.get('/api/getPost', async function (req, res) {
	const { postId } = req.query;

	const response = await Insta360Api.getPost(postId);

	res.send(response);
});

api.get('/api/getComments', async function (req, res) {
	const { postId, pageNumber } = req.query;

	const response = await Insta360Api.getComments(postId, pageNumber);

	res.send(response);
});

api.get('/api/getTag', async function (req, res) {
	const { tag } = req.query;

	const response = await Insta360Api.getTag(tag);

	res.send(response);
});

api.get('/api/getTagPosts', async function (req, res) {
	const { tag, cursor } = req.query;

	const response = await Insta360Api.getTagPosts(tag, cursor);

	res.send(response);
});

api.get('/api/getTagPopularPosts', async function (req, res) {
	const { tag } = req.query;

	const response = await Insta360Api.getTagPopularPosts(tag);

	res.send(response);
});

api.get('/api/getRecommendedSearchTags', async function (req, res) {
	const response = await Insta360Api.getRecommendedSearchTags();

	res.send(response);
});

api.get('/api/getRecommendedSearchUsers', async function (req, res) {
	const response = await Insta360Api.getRecommendedSearchUsers();

	res.send(response);
});

api.get('/api/searchTags', async function (req, res) {
	const { query } = req.query;

	const response = await Insta360Api.searchTags(query);

	res.send(response);
});

api.get('/api/searchUsers', async function (req, res) {
	const { query } = req.query;

	const response = await Insta360Api.searchUsers(query);

	res.send(response);
});

api.get('/api/likePost', async function (req, res) {
	const { postId } = req.query;

	const response = await Insta360Api.likePost(postId);

	res.send(response);
});

api.get('/api/unlikePost', async function (req, res) {
	const { postId } = req.query;

	const response = await Insta360Api.unlikePost(postId);

	res.send(response);
});

api.post('/api/followUser', async function (req, res) {
	const { userId } = req.body;

	const response = await Insta360Api.followUser(userId);

	res.send(response);
});

api.post('/api/unfollowUser', async function (req, res) {
	const { userId } = req.body;

	const response = await Insta360Api.unfollowUser(userId);

	res.send(response);
});

module.exports = api;
