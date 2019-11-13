function is360Pano(type) {
	return type === 'single_photo' || type === 'single_video';
}

function isVideo(type) {
	return type === 'single_video' || type === 'single_video2d';
}

function getFeedImageSrc(post) {
	const { cover, app_thumb, type } = post;

	if (is360Pano(type) || isVideo(type) || type === 'single_photo2d') {
		return cover;
	}

	return app_thumb;
}

module.exports = {
	getFeedImageSrc
};
