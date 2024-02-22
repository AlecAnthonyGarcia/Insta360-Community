import React from 'react';
import './style.scss';

import MuteIcon from '../static/img/icon_mute.png';
import UnmuteIcon from '../static/img/icon_unmute.png';
import PlayIcon from '../static/img/icon_play.png';
import PauseIcon from '../static/img/icon_pause.png';
import videopano from '../static/xml/videopano.xml';

import { Button } from 'antd';

import { isVideo, shouldMuteAutoPlayVideo } from '../utils/Utils.js';

const SWF_PATH =
	'https://static.insta360.com/assets/www/project/share/player/krpano.swf';

class PanoModal extends React.Component {
	state = {
		isPlaying: false,
		isMuted: shouldMuteAutoPlayVideo(),
		currentViewTypeIndex: 0,
		viewTypes: ['Fisheye', 'Normal', 'Tiny Planet'],
		pano: {},
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

		const { firework_param: fireworkParam } = works[0];
		let { level, tilesize } = JSON.parse(fireworkParam);

		if (Array.isArray(level)) {
			let tileLevel = level.find((item) => item.tiledimagewidth === tilesize);
			// if tile with size can't be found, use last tile in the array
			level = tileLevel ? tileLevel : level[level.length - 1];
		}

		const { tiledimagewidth, cube } = level;

		const tileUrl = cube.url.replace('../', '');

		const BASE_URL = 'https://static.insta360.com/share/public/media/jpg/';
		const imageurl = `${BASE_URL}${tileUrl}`;

		const pano = { imageurl, tilesize, tiledimagewidth };

		this.setState({ pano }, () => {
			window.embedpano({
				swf: SWF_PATH,
				xml: null,
				target: 'pano',
				passQueryParameters: true,
				onready: this.onKrpanoReady,
				onloadcomplete: this.onLoadComplete,
			});
		});
	};

	loadImagePano = () => {
		const { pano } = this.state;
		const { imageurl, tilesize, tiledimagewidth } = pano;

		const panoXml = `<krpano>
			<image tilesize="${tilesize}" type="CUBE" multires="true" prealign="0|0.0|0">
			<level tiledimagewidth="${tiledimagewidth}" tiledimageheight="${tiledimagewidth}">
			<cube url="${imageurl}"/>
			</level>
			</image>
			<view fov="get:fisheyeFov" fovmin="70" fovmax="140" fovtype="MFOV" fisheyeFov="calc: fisheyeFov" vlookat="0" hlookat="0" limitview="auto" maxpixelzoom="0.8" />
			<events name="scene" onloadcomplete="onLoadComplete()" />
			</krpano>`;

		window.krpano.call(
			'loadxml(' + escape(panoXml) + ', null, MERGE, BLEND(0.5));'
		);
	};

	embedVideoPano = () => {
		const { post } = this.props;
		const { works } = post;
		const {
			app_urls: { source },
		} = works[0];

		window.embedpano({
			swf: SWF_PATH,
			xml: videopano,
			target: 'pano',
			initvars: {
				videourl: source,
			},
			html5: 'auto',
			mobilescale: 1.0,
			passQueryParameters: true,
			onready: this.onKrpanoReady,
		});
	};

	normalizeView = () => {
		window.krpano.call(
			'tween(view.vlookat, 0.0, 1.0, easeInOutSine); tween(view.fov, 100, distance(150,0.8));'
		);
	};

	normalView = () => {
		window.krpano.call(
			'tween(view.architectural, 0.0, distance(1.0,0.5)); tween(view.pannini, 0.0, distance(1.0,0.5)); tween(view.fisheye, 0.0, distance(1.0,0.5));'
		);
	};

	fisheyeView = () => {
		window.krpano.call(
			'tween(view.architectural, 0.0, distance(1.0,0.5)); tween(view.pannini, 0.0, distance(1.0,0.5)); tween(view.fisheye, 0.35, distance(1.0,0.5));'
		);
	};

	tinyPlanetView = () => {
		window.krpano.call(
			'tween(view.architectural, 0.0, distance(1.0,0.5)); tween(view.pannini, 0.0, distance(1.0,0.5)); tween(view.fisheye, 1.0, distance(1.0,0.8)); tween(view.fov, 150, distance(150,0.8)); tween(view.vlookat, 90, distance(100,0.8)); add(new_hlookat, view.hlookat, 123.0); tween(view.hlookat, get(new_hlookat), distance(100,0.8));'
		);
	};

	onKrpanoReady = (instance) => {
		instance.set('onloadcomplete', this.onLoadComplete);
		window.krpano = instance;

		if (!this.isVideo()) {
			this.loadImagePano();
		}
	};

	onLoadComplete = () => {
		this.props.onLoadComplete();

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
			const { isMuted } = this.state;

			const video = window.krpano.get('plugin[video]');

			if (isMuted) {
				video.muted = true;
			}

			video.play();

			this.setState({ isPlaying: true });
		} else {
			window.krpano.call('plugin[video].pause()');
			this.setState({ isPlaying: false });
		}
	};

	onMuteButtonClick = () => {
		const video = window.krpano.get('plugin[video]');

		if (video.muted) {
			video.muted = false;
			this.setState({ isMuted: false });
		} else {
			video.muted = true;
			this.setState({ isMuted: true });
		}
	};

	onViewTypeChange = () => {
		let { currentViewTypeIndex, viewTypes } = this.state;

		if (currentViewTypeIndex < viewTypes.length - 1) {
			currentViewTypeIndex++;
		} else {
			currentViewTypeIndex = 0;
		}

		this.setState({ currentViewTypeIndex });

		const nextViewType = viewTypes[currentViewTypeIndex];

		this.normalizeView();

		switch (nextViewType) {
			case 'Normal':
				this.normalView();
				break;
			case 'Fisheye':
				this.fisheyeView();
				break;
			case 'Tiny Planet':
				this.tinyPlanetView();
				break;
			default:
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
		const { isPlaying, isMuted, currentViewTypeIndex, viewTypes } = this.state;
		const currentViewType = viewTypes[currentViewTypeIndex];

		return (
			<div className="pano-modal">
				<Button
					className="pano-modal-view-type-button"
					type="link"
					onClick={this.onViewTypeChange}
				>
					{currentViewType} View
				</Button>

				<Button
					className="pano-modal-close-button"
					type="primary"
					icon="close"
					onClick={this.onClose}
				>
					Close
				</Button>

				{this.isVideo() && (
					<React.Fragment>
						<img
							alt="Play Button"
							src={isPlaying ? PauseIcon : PlayIcon}
							className="pano-video-play-button"
							onClick={this.onPlayButtonClick}
						/>
						<img
							alt="Mute Button"
							src={isMuted ? MuteIcon : UnmuteIcon}
							className="pano-video-mute-button"
							onClick={this.onMuteButtonClick}
						/>
					</React.Fragment>
				)}

				<div id="pano" />
			</div>
		);
	}
}

export default PanoModal;
