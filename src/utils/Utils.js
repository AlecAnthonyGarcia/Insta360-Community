export function is360Pano(type) {
	return type === 'single_photo' || type === 'single_video';
}

export function isVideo(type) {
	return type === 'single_video' || type === 'single_video2d';
}
