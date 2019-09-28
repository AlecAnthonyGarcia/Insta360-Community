import React from 'react';
import './style.scss';

import PlayIcon from '../static/img/icon_play.png';
import Pano360Icon from '../static/img/icon_360_pano.png';

import { Link } from 'react-router-dom';
import { Card, List, Avatar, Button, Divider } from 'antd';
import moment from 'moment';

import { is360Pano, isVideo } from '../utils/Utils.js';

class FeedCard extends React.Component {
	state = {
		isVideoLoaded: false
	};

	onPostClick = () => {
		const { post } = this.props;
		const { type } = post;

		if (isVideo(type)) {
			this.setState({ isVideoLoaded: true });
		}
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

	render() {
		const { isVideoLoaded } = this.state;
		const { post } = this.props || {};

		const {
			account,
			location = {},
			location_flag,
			app_thumb,
			comments,
			comment_count,
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
					onClick={this.onPostClick}
				>
					<div className="feed-card-media-container">
						{is360Pano(type) && (
							<img alt="360 Pano" src={Pano360Icon} className="pano-360-icon" />
						)}

						{isVideo(type) && !isVideoLoaded && (
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
							<img alt="" src={app_thumb} className="feed-card-image" />
						)}
					</div>

					<div className="feed-card-body-container">
						<div className="feed-card-actions-container">
							<Button shape="round" icon="like">
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
			</React.Fragment>
		);
	}
}

export default FeedCard;
