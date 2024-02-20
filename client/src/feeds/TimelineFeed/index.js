import React from 'react';
import './style.scss';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getTimelinePosts } from '../../HomePage/homeActions.js';
import { List, Spin, Card, Avatar } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';

import FeedCard from '../../FeedCard/index.js';

import { FEED_CARD_PARENTS, TIMELINE_ACTIONS } from '../../utils/Constants.js';
import { renderPostThumbnail, isVideo } from '../../utils/Utils.js';
import UserNickname from '../../UserNickname';
import UserAvatar from '../../UserAvatar';

class TimelineFeed extends React.Component {
	state = {
		isFirstLoad: true,
		loading: true,
		hasMore: true,
	};

	componentDidMount() {
		this.getTimelinePosts();
	}

	getTimelinePosts() {
		const { auth, getTimelinePosts, timelinePostsResponse } = this.props;
		const { lastTimestamp } = timelinePostsResponse;
		if (auth) {
			getTimelinePosts(lastTimestamp);
		}
	}

	componentDidUpdate(prevProps) {
		const { timelinePostsResponse } = this.props;
		if (prevProps.timelinePostsResponse !== timelinePostsResponse) {
			const { list: timelinePosts } = timelinePostsResponse;
			this.setState({
				loading: false,
				isFirstLoad: false,
				hasMore: timelinePosts && timelinePosts.length > 0,
			});
		}
	}

	onLoadMore = () => {
		this.setState({ loading: true });
		this.getTimelinePosts();
	};

	renderTimelineFeedCard(post) {
		const { action, feed_time, subject, target } = post;

		switch (action) {
			case TIMELINE_ACTIONS.PUBLISH: {
				const { share } = target;

				return (
					<FeedCard
						post={share}
						parent={FEED_CARD_PARENTS.TIMELINE}
						action={action}
					/>
				);
			}
			case TIMELINE_ACTIONS.LIKE_POST: {
				const [account] = subject;
				const { avatar } = account;
				const { share } = target;
				const { type, account: targetAccount } = share;

				const postType = isVideo(type) ? 'video' : 'photo';

				return (
					<Card
						className="timeline-like-feed-card"
						title={
							<span>
								<UserAvatar src={avatar} />
								<span className="timeline-like-feed-card-title">
									<UserNickname user={account} /> liked{' '}
									<UserNickname user={targetAccount} />
									's {postType}
								</span>
							</span>
						}
					>
						<FeedCard
							post={share}
							parent={FEED_CARD_PARENTS.TIMELINE}
							action={action}
						/>
					</Card>
				);
			}
			case TIMELINE_ACTIONS.LIKE_POSTS: {
				const [account] = subject;
				const { id: userId, avatar } = account;
				const { shares } = target;

				return (
					<Card
						className="timeline-likes-feed-card"
						title={
							<List.Item.Meta
								avatar={
									avatar && avatar.length > 0 ? (
										<Link to={`/user/${userId}`}>
											<Avatar src={avatar} />
										</Link>
									) : null
								}
								title={
									<React.Fragment>
										<UserNickname user={account} />
										<span className="feed-card-action-title">{`liked ${shares.length} posts`}</span>
									</React.Fragment>
								}
								description={moment(feed_time).fromNow()}
							/>
						}
					>
						<List
							grid={{ gutter: 16, column: 3 }}
							dataSource={shares}
							renderItem={(item) => {
								return <List.Item>{renderPostThumbnail(item)}</List.Item>;
							}}
						/>
					</Card>
				);
			}
			default:
				return <div></div>;
		}
	}

	render() {
		const { timelinePostsResponse } = this.props;
		const { list: timelinePosts } = timelinePostsResponse;
		const { isFirstLoad, loading, hasMore } = this.state;

		return (
			<div>
				<InfiniteScroll
					initialLoad={false}
					pageStart={0}
					loadMore={this.onLoadMore}
					hasMore={!loading && hasMore}
					useWindow={true}
				>
					<List
						dataSource={timelinePosts}
						loading={loading}
						renderItem={(item) => this.renderTimelineFeedCard(item)}
					>
						{loading && !isFirstLoad && hasMore && (
							<div className="loading-container">
								<Spin />
							</div>
						)}
					</List>
				</InfiniteScroll>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { authReducer, homeReducer } = state;
	const { isAuthenticated } = authReducer;
	const { timelinePostsResponse } = homeReducer;
	return {
		auth: isAuthenticated,
		timelinePostsResponse,
	};
}

export default connect(mapStateToProps, { getTimelinePosts })(TimelineFeed);
