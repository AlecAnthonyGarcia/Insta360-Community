import React from 'react';
import './style.scss';

import PlayIcon from '../static/img/icon_play.png';
import PauseIcon from '../static/img/icon_pause.png';
import imagepano from '../static/xml/imagepano.xml';
import videopano from '../static/xml/videopano.xml';

import { Button } from 'antd';

import { isVideo } from '../utils/Utils.js';

const SWF_PATH =
	'https://static.insta360.com/assets/www/project/share/player/krpano.swf';

class PanoModal extends React.Component {
	state = {
		loading: true,
		isPlaying: false
	};

	componentDidMount() {
		if (this.isVideo()) {
			this.embedVideoPano();
		} else {
			this.embedImagePano();
		}
	}

	embedImagePano = () => {
		const { post } = this.props;
		const { works } = post;
		const {
			app_urls: { source }
		} = works[0];

		window.embedpano({
			swf: SWF_PATH,
			xml: imagepano,
			target: 'pano',
			initvars: {
				imageurl: source
			},
			passQueryParameters: true,
			onready: this.onKrpanoReady,
			onloadcomplete: this.onLoadComplete
		});
	};

	embedVideoPano = () => {
		const { post } = this.props;
		const { works } = post;
		const {
			urls: { star_image, video_720 }
		} = works[0];

		window.embedpano({
			swf: SWF_PATH,
			xml: videopano,
			target: 'pano',
			initvars: {
				videourl: video_720,
				posterurl: star_image
			},
			html5: 'auto',
			mobilescale: 1.0,
			passQueryParameters: true,
			onready: this.onKrpanoReady
		});
	};

	onKrpanoReady = instance => {
		instance.set('onloadcomplete', this.onLoadComplete);
		window.krpano = instance;
	};

	onLoadComplete = () => {
		this.props.onLoadComplete();
		this.setState({ loading: false });

		if (this.isVideo()) {
			this.onPlayButtonClick();
		}
	};

	onClose = () => {
		window.removepano('krpanoSWFObject');
		this.props.onClose();
	};

	onPlayButtonClick = () => {
		if (this.isPaused()) {
			window.krpano.call('plugin[video].play()');
			this.setState({ isPlaying: true });
		} else {
			window.krpano.call('plugin[video].pause()');
			this.setState({ isPlaying: false });
		}
	};

	isVideo = () => {
		const { post } = this.props;
		const { type } = post;

		return isVideo(type);
	};

	isPaused = () => {
		return window.krpano && window.krpano.get('plugin[video].isPaused');
	};

	render() {
		const { loading, isPlaying } = this.state;

		return (
			<div
				className="pano-modal"
				style={{ display: loading ? 'none' : 'flex' }}
			>
				<Button
					className="pano-modal-close-button"
					type="primary"
					icon="close"
					onClick={this.onClose}
				>
					Close
				</Button>
				{this.isVideo() && (
					<img
						alt="Play Button"
						src={isPlaying ? PauseIcon : PlayIcon}
						className="pano-video-play-button"
						onClick={this.onPlayButtonClick}
					/>
				)}

				<div id="pano" />
			</div>
		);
	}
}

export default PanoModal;
