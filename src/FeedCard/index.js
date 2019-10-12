import React from 'react';
import './style.scss';

import PlayIcon from '../static/img/icon_play.png';
import Pano360ImageIcon from '../static/img/icon_360_pano_image.png';
import Pano360VideoIcon from '../static/img/icon_360_pano_video.png';

import { likePost } from '../HomePage/homeActions';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, List, Avatar, Button, Divider, Spin } from 'antd';
import moment from 'moment';

import PanoModal from '../PanoModal/index.js';

import { is360Pano, isVideo } from '../utils/Utils.js';

class FeedCard extends React.Component {
	state = {
		isPanoModalOpen: false,
		isPanoLoading: false,
		isVideoLoaded: false
	};

	onPostClick = () => {
		const { post } = this.props;
		const { type } = post;

		if (is360Pano(type)) {
			this.setState({
				isPanoLoading: isVideo(type) ? false : true,
				isPanoModalOpen: true
			});
		} else {
			if (isVideo(type)) {
				this.setState({ isVideoLoaded: true });
			}
		}
	};

	onLikeButtonClick = async () => {
		const { post, parent, likePost } = this.props;
		const { id } = post;

		likePost(id, parent);
	};

	replaceHashtagsWithLinks = text => {
		return text.replace(/#([^\b# ]*)/gi, `<a href="/tag/$1/">#$1</a>`);
	};

	renderCaption() {
		const { post } = this.props;
		const { title } = post;
		if (title) {
			const linkedHashtags = this.replaceHashtagsWithLinks(title);
			return { __html: linkedHashtags };
		}
		return { __html: '' };
	}

	onPanoLoadComplete = () => {
		this.setState({ isPanoLoading: false });
	};

	onClosePanoModal = () => {
		this.setState({ isPanoModalOpen: false });
	};

	render() {
		const { isPanoModalOpen, isPanoLoading, isVideoLoaded } = this.state;
		const { post } = this.props || {};

		const {
			account,
			location = {},
			location_flag,
			cover,
			app_thumb,
			comments,
			comment_count,
			like,
			like_count,
			type,
			works = [],
			share_source_icon,
			id: postId
		} = post;

		const { app_urls: { source } = {}, create_time } = works[0] || {};
		const { id, avatar, nickname } = account || {};

		return (
			<React.Fragment>
				<Card
					className="feed-card"
					title={
						<List.Item.Meta
							avatar={
								avatar && avatar.length > 0 ? <Avatar src={avatar} /> : null
							}
							title={<Link to={`/user/${id}`}>{nickname}</Link>}
							description={
								<span>
									<img
										alt="Country"
										src={location_flag}
										className="feed-card-user-country-flag"
									/>
									<span>{location.en}</span>
									<span className="timestamp">
										{moment(create_time).fromNow()}
									</span>
								</span>
							}
						/>
					}
				>
					<div className="feed-card-media-container" onClick={this.onPostClick}>
						{is360Pano(type) && !isVideo(type) && (
							<img
								alt="360 Pano"
								src={Pano360ImageIcon}
								className="pano-360-icon"
							/>
						)}

						{is360Pano(type) && isVideo(type) && (
							<img
								alt="360 Pano"
								src={Pano360VideoIcon}
								className="pano-360-icon"
							/>
						)}

						{!is360Pano(type) && isVideo(type) && !isVideoLoaded && (
							<img alt="Play Button" src={PlayIcon} className="play-button" />
						)}

						{isVideoLoaded ? (
							<video
								autoPlay
								controls
								src={source}
								className="feed-card-video"
							/>
						) : (
							<Spin spinning={isPanoLoading}>
								<img
									alt=""
									src={is360Pano(type) || isVideo(type) ? cover : app_thumb}
									className="feed-card-image"
								/>
							</Spin>
						)}
					</div>

					<div className="feed-card-body-container">
						<div className="feed-card-actions-container">
							<Button
								type={like ? 'primary' : 'default'}
								shape="round"
								icon="like"
								onClick={this.onLikeButtonClick}
							>
								<span>{like_count}</span>
							</Button>
							<Link to={`/post/${postId}`}>
								<Button shape="round" icon="message">
									<span>{comment_count}</span>
								</Button>
							</Link>

							<img
								alt="Share Source"
								src={share_source_icon}
								className="share-source-icon"
							/>
						</div>

						<Divider />

						<span dangerouslySetInnerHTML={this.renderCaption()} />

						{comments &&
							comments.length > 0 &&
							comments.map(comment => (
								<p>
									<span>{comment.account.nickname}</span> {comment.content}
								</p>
							))}
					</div>
				</Card>
				{isPanoModalOpen && (
					<PanoModal
						post={post}
						onLoadComplete={this.onPanoLoadComplete}
						onClose={this.onClosePanoModal}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default connect(
	null,
	{ likePost }
)(FeedCard);
