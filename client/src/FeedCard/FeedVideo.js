import React from 'react';
import './style.scss';

import PlayIcon from '../static/img/icon_play.png';

import 'intersection-observer';
import { InView } from 'react-intersection-observer';

import { is360Pano, getFeedImageSrc } from '../utils/Utils.js';

class FeedVideo extends React.Component {
	constructor(props) {
		super(props);
		this.videoRef = React.createRef();
		this.state = {
			isPanoLoading: false,
			isVideoPlaying: false
		};
	}

	onVideoClick = e => {
		const { current: video } = this.videoRef;

		if (video.paused) {
			this.setState({ isVideoPlaying: true });
		} else {
			video.pause();
			this.setState({ isVideoPlaying: false });
		}
	};

	onPause = () => {
		const { current: video } = this.videoRef;

		if (!video.paused) {
			video.pause();
		}

		this.setState({ isVideoPlaying: false });
	};

	onEnded = () => {
		this.setState({ isVideoPlaying: false });
	};

	onVideoInViewChange = inView => {
		if (!inView) {
			this.onPause();
		}
	};

	render() {
		const { isVideoPlaying } = this.state;
		const { post } = this.props;

		const { type, works = [] } = post;
		const { app_urls: { source } = {} } = works[0] || {};

		return (
			<React.Fragment>
				{!is360Pano(type) && !isVideoPlaying && (
					<img alt="Play Button" src={PlayIcon} className="play-button" />
				)}

				<InView as="div" onChange={this.onVideoInViewChange}>
					<video
						ref={this.videoRef}
						className="feed-card-video"
						src={source}
						controls={isVideoPlaying}
						preload="metadata"
						poster={getFeedImageSrc(post)}
						onClick={this.onVideoClick}
						onPause={this.onPause}
						onEnded={this.onEnded}
					/>
				</InView>
			</React.Fragment>
		);
	}
}

export default FeedVideo;
