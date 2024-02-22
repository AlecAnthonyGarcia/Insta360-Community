const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const moment = require('moment');

const api = require('./api');
const Insta360Api = require('./utils/Api');
const { getFeedImageSrc } = require('./utils/Utils');

const app = express();
const port = process.env.PORT || 3001;

const filePath = path.resolve(__dirname, '../client/build', 'index.html');

app.use(bodyParser.json()); // support json encoded bodies

// Include internal API routes
app.use(api);

app.get('/user/*', function (req, res) {
	fs.readFile(filePath, 'utf8', async function (err, fileData) {
		if (err) {
			return console.log(err);
		}

		const userId = req.params[0];

		const response = await Insta360Api.getUser(userId);

		const { data: user } = response;

		if (!user) {
			fileData = replaceWithDefaultMetaTags(fileData);
			res.send(fileData);
			return;
		}

		const { account } = user;
		const { avatar, nickname } = account;

		fileData = fileData.replace(
			/\$OG_TITLE/g,
			`${nickname} • Insta360 Community`
		);
		fileData = fileData.replace(
			/\$OG_DESCRIPTION/g,
			`See Insta360 photos and videos from ${nickname}`
		);
		fileData = fileData.replace(/\$OG_IMAGE/g, avatar);
		res.send(fileData);
	});
});

app.get('/post/*', function (req, res) {
	fs.readFile(filePath, 'utf8', async function (err, fileData) {
		if (err) {
			return console.log(err);
		}

		const postId = req.params[0];

		const response = await Insta360Api.getPost(postId);

		const { data } = response;

		if (!data) {
			fileData = replaceWithDefaultMetaTags(fileData);
			res.send(fileData);
			return;
		}

		const { share: post } = data;
		const { account, create_time, title: description } = post;
		const { nickname } = account;

		const timestampString = moment(create_time).format('MMMM Do YYYY, h:mm A');
		const title = `Insta360 post by ${nickname} • ${timestampString}`;
		const image = getFeedImageSrc(post);

		fileData = replaceMetaTags(fileData, title, description, image);

		res.send(fileData);
	});
});

app.get('/tag/*', function (req, res) {
	fs.readFile(filePath, 'utf8', async function (err, fileData) {
		if (err) {
			return console.log(err);
		}

		const tag = req.params[0];

		const response = await Insta360Api.getTag(tag);

		const { data } = response;

		let { tag: tagInfo, campaign_tag: campaignTag } = data;

		if (!tagInfo) {
			fileData = replaceWithDefaultMetaTags(fileData);
			res.send(fileData);
			return;
		}

		const { value: hashtag } = tagInfo;
		const { content } = campaignTag || {};
		const { cover } = content || {};
		let { image } = cover || {};

		if (!image) {
			image = '/logo.png';
		}

		const title = 'Insta360 Community';
		const description = `#${hashtag} hashtag on Insta360 • 360° Photos and Videos`;

		fileData = replaceMetaTags(fileData, title, description, image);

		res.send(fileData);
	});
});

app.get('/', function (req, res) {
	handleDefaultRoute(res);
});

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('*', function (req, res) {
	handleDefaultRoute(res);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

function handleDefaultRoute(response) {
	fs.readFile(filePath, 'utf8', async function (err, fileData) {
		if (err) {
			return console.log(err);
		}

		fileData = replaceWithDefaultMetaTags(fileData);

		response.send(fileData);
	});
}

function replaceWithDefaultMetaTags(data) {
	const title = 'Insta360 Community';
	const description =
		'Discover 360° photos and videos shared by the Insta360 community.';
	const image = '/logo.png';

	data = replaceMetaTags(data, title, description, image);

	return data;
}

function replaceMetaTags(data, title, description, image) {
	data = data.replace(/\$OG_TITLE/g, title);
	data = data.replace(/\$OG_DESCRIPTION/g, description);
	data = data.replace(/\$OG_IMAGE/g, image);
	return data;
}
