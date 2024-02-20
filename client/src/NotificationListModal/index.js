import React from 'react';
import './style.scss';

import { setFollowsMap } from '../HomePage/homeActions';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Modal, List, Spin } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';

import UserAvatar from '../UserAvatar/index.js';

import { NOTIFICATION_ACTIONS } from '../utils/Constants';
import Api from '../utils/Api';
import FollowButton from '../FollowButton';
import UserNickname from '../UserNickname';

class NotificationListModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notifications: [],
			isFirstLoad: true,
			loading: true,
			hasMore: true,
			totalPages: 1,
			totalCount: null,
		};
	}

	componentDidMount() {
		this.getNotifications();
	}

	getNotifications = async () => {
		const { notifications, lastTimestamp } = this.state;
		const { setFollowsMap } = this.props;

		const response = await Api.getNotifications(lastTimestamp);

		const { data } = response;
		const { notices, total_page: totalPages, total_count: totalCount } = data;

		const lastPost = notices[notices.length - 1];
		const { create_time: lastPostTimestamp } = lastPost || {};

		if (lastPost) {
			let accounts = [];

			notices.forEach((notification) => {
				const { action, data } = notification;

				if (action === NOTIFICATION_ACTIONS.FOLLOW) {
					const { account } = data;
					accounts.push(account);
				}
			});

			setFollowsMap(accounts);
		}

		this.setState({
			loading: false,
			isFirstLoad: false,
			notifications: notifications.concat(notices),
			hasMore: notices && notices.length > 0,
			lastTimestamp: lastPostTimestamp,
			totalPages,
			totalCount,
		});
	};

	getActionLabel = (action) => {
		switch (action) {
			case NOTIFICATION_ACTIONS.LIKE:
				return 'liked your post';
			case NOTIFICATION_ACTIONS.FOLLOW:
				return 'followed you';
			default:
		}
	};

	onLoadMore = () => {
		this.setState({ loading: true });
		this.getNotifications();
	};

	onCancel = () => {
		const { onClose } = this.props;

		if (onClose) {
			onClose();
		}
	};

	renderNotificationCta(item) {
		const { action, data } = item;
		const { account, share } = data;
		const { id: userId } = account;
		const { id: postId, app_thumb: thumbnail } = share || {};

		switch (action) {
			case NOTIFICATION_ACTIONS.LIKE:
				return (
					<Link to={`/post/${postId}`} onClick={this.onCancel}>
						<img
							alt="Post Thumbnail"
							src={thumbnail}
							className="notification-post-thumbnail"
						/>
					</Link>
				);
			case NOTIFICATION_ACTIONS.FOLLOW:
				return <FollowButton userId={userId} />;
			default:
		}
	}

	render() {
		const { title } = this.props;
		const { isFirstLoad, loading, hasMore, totalCount, notifications } =
			this.state;

		return (
			<Modal
				className="notification-list-modal"
				visible
				title={title + (totalCount ? ` (${totalCount})` : '')}
				centered
				footer={null}
				style={{ maxHeight: '70vh ' }}
				onCancel={this.onCancel}
			>
				<InfiniteScroll
					initialLoad={false}
					pageStart={0}
					loadMore={this.onLoadMore}
					hasMore={!loading && hasMore}
					useWindow={false}
				>
					<List
						dataSource={notifications}
						loading={loading}
						renderItem={(item) => {
							const { id, action, data, create_time } = item;
							const { account } = data;
							const { id: userId, avatar } = account;

							return (
								<List.Item key={id}>
									<List.Item.Meta
										avatar={
											<Link to={`/user/${userId}`} onClick={this.onCancel}>
												<UserAvatar src={avatar} />
											</Link>
										}
										title={
											<UserNickname user={account} onClick={this.onCancel} />
										}
										description={
											<div>
												<span>{this.getActionLabel(action)}</span>
												<div className="notification-timestamp">
													{moment(create_time).fromNow()}
												</div>
											</div>
										}
									/>

									{this.renderNotificationCta(item)}
								</List.Item>
							);
						}}
					>
						{loading && !isFirstLoad && hasMore && (
							<div className="loading-container">
								<Spin />
							</div>
						)}
					</List>
				</InfiniteScroll>
			</Modal>
		);
	}
}

export default connect(null, { setFollowsMap })(NotificationListModal);
