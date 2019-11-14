import React from 'react';

import PlayIcon from '../static/img/icon_play.png';
import Pano360ImageIcon from '../static/img/icon_360_pano_image.png';
import Pano360VideoIcon from '../static/img/icon_360_pano_video.png';
import PopularIcon from '../static/img/icon_popular.png';
import EditorsChoiceIcon from '../static/img/icon_editors_choice.png';
import defaultImage from '../static/img/icon_default_image.png';

import { Link } from 'react-router-dom';

export function is360Pano(type) {
	return type === 'single_photo' || type === 'single_video';
}

export function isVideo(type) {
	return type === 'single_video' || type === 'single_video2d';
}

export function shouldMuteAutoPlayVideo() {
	const isSafari = !!navigator.userAgent.match(/Version\/[\d]+.*Safari/);
	const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	return isSafari || iOS;
}

export function getFeedImageSrc(post) {
	const { cover, app_thumb, type } = post;

	if (is360Pano(type) || isVideo(type) || type === 'single_photo2d') {
		return cover;
	}

	return app_thumb;
}

export function kFormatter(num) {
	return Math.abs(num) > 999
		? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
		: Math.sign(num) * Math.abs(num);
}

export function renderPostThumbnail(post) {
	const { id: postId, cover, popular_flag: isPopular, recommend, type } = post;

	const renderPostMediaTypeIcon = type => {
		if (is360Pano(type) && !isVideo(type)) {
			return (
				<img
					alt="360 Pano"
					src={Pano360ImageIcon}
					className="pano-360-icon post-media-type-icon"
				/>
			);
		}

		if (is360Pano(type) && isVideo(type)) {
			return (
				<img
					alt="360 Pano"
					src={Pano360VideoIcon}
					className="pano-360-icon post-media-type-icon"
				/>
			);
		}

		if (!is360Pano(type) && isVideo(type)) {
			return (
				<img
					alt="Play Button"
					src={PlayIcon}
					className="play-button post-media-type-icon"
				/>
			);
		}
	};

	const onError = e => {
		const { target } = e;
		target.src = defaultImage;
	};

	return (
		<Link to={`/post/${postId}`}>
			<div className="post-thumbnail-container">
				<img alt="" src={cover} className="post-thumbnail" onError={onError} />

				{isPopular && (
					<img
						alt="Popular Post"
						src={PopularIcon}
						className="popular-post-icon"
					/>
				)}

				{recommend && (
					<img
						alt="Editor's Choice"
						src={EditorsChoiceIcon}
						className="editors-choice-icon"
					/>
				)}

				{renderPostMediaTypeIcon(type)}
			</div>
		</Link>
	);
}
