import React from 'react';
import './style.scss';

import defaultImage from '../static/img/icon_default_image.png';

import { Spin } from 'antd';

class FeedImage extends React.Component {
	state = {
		isPanoLoading: false,
		isImageLoaded: false
	};

	onImageLoaded = () => {
		this.setState({ isImageLoaded: true });
	};

	render() {
		const { isImageLoaded } = this.state;
		const { isPanoLoading, src } = this.props;

		return (
			<React.Fragment>
				<Spin spinning={isPanoLoading}>
					<img
						style={{ display: !isImageLoaded ? 'none' : 'inherit' }}
						alt=""
						src={src}
						className="feed-card-image"
						onLoad={this.onImageLoaded}
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
