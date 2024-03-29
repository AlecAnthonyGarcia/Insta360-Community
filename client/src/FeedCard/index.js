import React from 'react';
import './style.scss';

import LocationIcon from '../static/img/icon_location.png';

import { setLoginModalVisibility, isMe } from '../AuthModal/authActions';
import {
	followUser,
	unfollowUser,
	likePost,
	unlikePost,
	setPostPrivacy,
} from '../HomePage/homeActions';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
	Card,
	List,
	Avatar,
	Button,
	Divider,
	Dropdown,
	Icon,
	Menu,
	message,
} from 'antd';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import FeedImage from './FeedImage.js';
import FeedVideo from './FeedVideo.js';
import CommentListModal from '../CommentListModal/index.js';
import PanoModal from '../PanoModal/index.js';

import { is360Pano, isVideo, getFeedImageSrc } from '../utils/Utils.js';
import { FEED_CARD_PARENTS, TIMELINE_ACTIONS } from '../utils/Constants.js';
import FollowButton from '../FollowButton';
import UserNickname from '../UserNickname';

class FeedCard extends React.Component {
	state = {
		isCommentListModalOpen: false,
		isPanoModalOpen: false,
		isPanoLoading: false,
		isVideoLoaded: false,
	};

	onPostClick = () => {
		const { post } = this.props;
		const { type } = post;

		if (is360Pano(type)) {
			this.setState({
				isPanoLoading: true,
				isPanoModalOpen: true,
			});
		}
	};

	onLikeButtonClick = async () => {
		const {
			auth,
			post,
			likesMap,
			likePost,
			unlikePost,
			setLoginModalVisibility,
		} = this.props;
		const { id: postId } = post;

		const { like } = likesMap[postId] || {};

		if (auth) {
			if (like) {
				unlikePost(postId);
			} else {
				likePost(postId);
			}
		} else {
			setLoginModalVisibility(true);
		}
	};

	replaceHashtagsWithLinks = (text) => {
		return text.replace(/#([^\b#.,， ]*)/gi, `<a href="/tag/$1/">#$1</a>`);
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

	showCommentListModal = () => {
		this.setState({ isCommentListModalOpen: true });
	};

	closeCommentListModal = () => {
		this.setState({ isCommentListModalOpen: false });
	};

	hasComments = () => {
		const { post } = this.props;
		const { comments } = post;

		return comments && comments.length > 0;
	};

	hasMoreComments = () => {
		const { post } = this.props;
		const { comment_count } = post;

		return comment_count > 2;
	};

	renderTitle = () => {
		const { post, action } = this.props;

		const { account } = post;

		const { id: userId } = account || {};

		if (!userId) {
			return null;
		}

		return (
			<React.Fragment>
				<UserNickname user={account} />
				{this.renderAction(action)}
			</React.Fragment>
		);
	};

	renderAction = (action) => {
		const { post } = this.props;
		const { type } = post;

		let actionTitle;

		switch (action) {
			case TIMELINE_ACTIONS.PUBLISH:
				const postType = isVideo(type) ? 'video' : 'photo';
				actionTitle = `posted a ${postType}`;
				break;
			default:
				actionTitle = '';
		}
		return <span className="feed-card-action-title">{actionTitle}</span>;
	};

	renderShareSourceIcon = () => {
		const { post } = this.props;
		const { share_source, share_source_icon } = post;

		let affiliateLink;

		switch (share_source) {
			case 'insta360 ace pro':
			case 'acepro_android':
				affiliateLink = 'https://www.insta360.com/sal/ace-pro?utm_term=INRIICZ';
				break;
			case 'insta360 x3':
			case 'x3_android':
				affiliateLink = 'https://www.insta360.com/sal/x3?utm_term=INRIICZ';
				break;
			case 'insta360 one x2':
			case 'onex2_android':
				affiliateLink = 'https://www.insta360.com/sal/one_x2?utm_term=INRIICZ';
				break;
			case 'insta360 one rs':
			case 'oner':
			case 'oner_android':
				affiliateLink = 'https://www.insta360.com/sal/one_rs?utm_term=INRIICZ';
				break;
			case 'insta360 go 3':
			case 'go3_android':
				affiliateLink = 'https://www.insta360.com/sal/go-3?utm_term=INRIICZ';
				break;
			case 'insta360 go 2':
			case 'go2_android':
				affiliateLink = 'https://www.insta360.com/sal/go_2?utm_term=INRIICZ';
				break;
			case 'onex':
			case 'onex_android':
				affiliateLink = 'https://www.insta360.com/sal/one_x?utm_term=INRIICZ';
				break;
			default:
		}

		const shareSourceIconImage = (
			<img
				alt="Share Source"
				src={share_source_icon}
				className="share-source-icon"
			/>
		);

		if (!share_source_icon) {
			return null;
		}

		if (!affiliateLink) {
			return shareSourceIconImage;
		}

		return (
			<a href={affiliateLink} target="_blank" rel="noopener noreferrer">
				{shareSourceIconImage}
			</a>
		);
	};

	renderShareButton = (post) => {
		const { id: postId, type } = post;

		const postUrl = `https://www.Insta360.community/post/${postId}`;
		const socialShareWindowOptions =
			'toolbar=0,status=0,resizable=1,width=626,height=436';

		const handleMenuClick = ({ key }) => {
			switch (key) {
				case 'open':
					window.open(postUrl, '_blank');
					break;
				case 'facebook':
					shareToFacebook();
					break;
				case 'twitter':
					shareToTwitter();
					break;
				default:
			}
		};

		const shareToFacebook = () => {
			const url = `https://facebook.com/sharer.php?display=popup&u=${postUrl}`;
			window.open(url, 'sharer', socialShareWindowOptions);
		};

		const shareToTwitter = () => {
			const { account } = post;
			const { nickname } = account || {};

			const panoType = is360Pano(type) ? ' 360°' : '';
			const postType = isVideo(type) ? 'video' : 'photo';
			const authorString = nickname ? ` by ${nickname}` : '';

			const shareText = `Check out this${panoType} ${postType}${authorString} on the Insta360 Community`;

			const url = `http://twitter.com/intent/tweet?text=${shareText}&url=${postUrl}`;

			window.open(url, 'sharer', socialShareWindowOptions);
		};

		const onLinkCopied = () => {
			message.success('Post link has been copied.');
		};

		const shareMenu = (
			<Menu onClick={handleMenuClick}>
				<Menu.Item key="open">
					<Icon type="link" /> Open link
				</Menu.Item>
				<Menu.Item key="copy">
					<CopyToClipboard text={postUrl} onCopy={onLinkCopied}>
						<div>
							<Icon type="copy" /> Copy link
						</div>
					</CopyToClipboard>
				</Menu.Item>
				<Menu.Item key="facebook">
					<Icon type="facebook" /> Share to Facebook
				</Menu.Item>
				<Menu.Item key="twitter">
					<Icon type="twitter" /> Share to Twitter
				</Menu.Item>
			</Menu>
		);

		return (
			<Dropdown overlay={shareMenu} trigger={['click']}>
				<Button
					className="feed-card-action-button"
					shape="round"
					icon="share-alt"
				>
					Share
				</Button>
			</Dropdown>
		);
	};

	renderOptionsButton = (post) => {
		const { setPostPrivacy, isMe } = this.props;
		const { id: postId, account, public: isPublic } = post;
		const { id: authorId } = account;

		const handleMenuClick = ({ key }) => {
			switch (key) {
				case 'setPublic':
					setPostPrivacy(postId, true);
					break;
				case 'setPrivate':
					setPostPrivacy(postId, false);
					break;
				default:
			}
		};

		const optionsMenu = (
			<Menu onClick={handleMenuClick}>
				{!isPublic && (
					<Menu.Item key="setPublic">
						<Icon type="unlock" /> Set Public
					</Menu.Item>
				)}
				{isPublic && (
					<Menu.Item key="setPrivate">
						<Icon type="lock" /> Set Private
					</Menu.Item>
				)}
			</Menu>
		);

		return isMe(authorId) ? (
			<Dropdown overlay={optionsMenu} trigger={['click']}>
				<Button className="feed-card-options-button" icon="ellipsis" />
			</Dropdown>
		) : null;
	};

	render() {
		const { isPanoModalOpen, isCommentListModalOpen, isPanoLoading } =
			this.state;
		const { post, parent, likesMap } = this.props || {};

		const {
			account,
			location = {},
			location_flag,
			comments,
			comment_count,
			type,
			works = [],
			id: postId,
		} = post;

		const { create_time } = works[0] || {};
		const { id: userId, avatar } = account || {};

		const { like, likeCount } = likesMap[postId] || {};

		return (
			<React.Fragment>
				<Card
					className="feed-card"
					title={
						<List.Item.Meta
							avatar={
								avatar && avatar.length > 0 ? (
									<Link to={`/user/${userId}`}>
										<Avatar src={avatar} />
									</Link>
								) : null
							}
							title={this.renderTitle()}
							description={
								<span>
									{location && location.en ? (
										<React.Fragment>
											<img
												alt="Country"
												src={location_flag || LocationIcon}
												className="feed-card-user-country-flag"
											/>
											<span className="feed-card-user-country-name">
												{location.en}
											</span>
										</React.Fragment>
									) : (
										'‏‏‎ ‎'
									)}

									{parent !== FEED_CARD_PARENTS.TIMELINE && userId && (
										<FollowButton userId={userId} />
									)}
								</span>
							}
						/>
					}
				>
					<div
						className="feed-card-media-container"
						style={{
							cursor: is360Pano(type) || isVideo(type) ? 'pointer' : 'default',
						}}
					>
						{isVideo(type) && !is360Pano(type) ? (
							<FeedVideo post={post} />
						) : (
							<FeedImage
								isPanoLoading={isPanoLoading}
								src={getFeedImageSrc(post)}
								type={type}
								onClick={this.onPostClick}
							/>
						)}
					</div>

					<div className="feed-card-body-container">
						<div className="feed-card-actions-container">
							<Button
								className="feed-card-action-button like-button"
								type={like ? 'primary' : 'default'}
								shape="round"
								onClick={this.onLikeButtonClick}
							>
								<Icon type="like" theme={like ? 'filled' : 'outlined'} />
								<span>{likeCount}</span>
							</Button>

							<Button
								className="feed-card-action-button"
								shape="round"
								icon="message"
								onClick={this.showCommentListModal}
							>
								<span>{comment_count}</span>
							</Button>

							{this.renderShareButton(post)}

							{this.renderOptionsButton(post)}

							{this.renderShareSourceIcon()}
						</div>

						<div className="feed-card-caption-container">
							<p className="timestamp">{moment(create_time).fromNow()}</p>

							<span
								className="caption"
								dangerouslySetInnerHTML={this.renderCaption()}
							/>
						</div>

						{this.hasComments() && (
							<React.Fragment>
								<Divider />

								<div className="feed-card-comments-container">
									{comments.map((comment) => {
										const { id: commentId, account, content } = comment;

										return (
											<p key={commentId}>
												<span>
													{account ? (
														<UserNickname user={account} />
													) : (
														'[Unknown User]'
													)}
												</span>{' '}
												<span>{content}</span>
											</p>
										);
									})}

									{this.hasMoreComments() && (
										<Button
											className="view-more-comments-button"
											type="link"
											onClick={this.showCommentListModal}
										>
											View more comments
										</Button>
									)}
								</div>
							</React.Fragment>
						)}
					</div>
				</Card>

				{isPanoModalOpen && (
					<PanoModal
						post={post}
						onLoadComplete={this.onPanoLoadComplete}
						onClose={this.onClosePanoModal}
					/>
				)}

				{isCommentListModalOpen && (
					<CommentListModal
						title="Comments"
						postId={postId}
						onClose={this.closeCommentListModal}
					/>
				)}
			</React.Fragment>
		);
	}
}

function mapStateToProps(state) {
	const { authReducer, homeReducer } = state;
	const { isAuthenticated } = authReducer;
	const { followsMap, likesMap } = homeReducer;
	return {
		auth: isAuthenticated,
		followsMap,
		likesMap,
	};
}

export default connect(mapStateToProps, {
	isMe,
	followUser,
	unfollowUser,
	likePost,
	unlikePost,
	setPostPrivacy,
	setLoginModalVisibility,
})(FeedCard);
