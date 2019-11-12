import React from 'react';
import './style.scss';

import Pano360ImageIcon from '../static/img/icon_360_pano_image.png';
import Pano360VideoIcon from '../static/img/icon_360_pano_video.png';
import defaultImage from '../static/img/icon_default_image.png';

import { Spin } from 'antd';

import { is360Pano, isVideo } from '../utils/Utils.js';

class FeedImage extends React.Component {
	state = {
		isPanoLoading: false,
		isImageLoaded: false
	};

	onImageLoaded = () => {
		this.setState({ isImageLoaded: true });
	};

	onImageError = e => {
		const { target } = e;
		target.src = defaultImage;
		this.setState({ isImageLoaded: true });
	};

	render() {
		const { isImageLoaded } = this.state;
		const { isPanoLoading, src, type, onClick } = this.props;

		return (
			<React.Fragment>
				{is360Pano(type) && isVideo(type) && (
					<img
						alt="360 Pano"
						src={Pano360VideoIcon}
						className="pano-360-icon"
					/>
				)}

				{is360Pano(type) && !isVideo(type) && (
					<img
						alt="360 Pano"
						src={Pano360ImageIcon}
						className="pano-360-icon"
					/>
				)}

				<Spin spinning={isPanoLoading} onClick={onClick}>
					<img
						style={{ display: !isImageLoaded ? 'none' : 'inherit' }}
						alt=""
						src={src}
						className="feed-card-image"
						onLoad={this.onImageLoaded}
						onError={this.onImageError}
					/>

					{!isImageLoaded && (
						<Spin spinning={!isImageLoaded}>
							<img alt="" src={defaultImage} className="feed-card-image" />
						</Spin>
					)}
				</Spin>
			</React.Fragment>
		);
	}
}

export default FeedImage;
