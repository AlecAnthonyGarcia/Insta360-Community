import React from 'react';

import { connect } from 'react-redux';

import { getTimelinePosts } from '../../HomePage/homeActions.js';
import { List, Spin, Card } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';

import FeedCard from '../../FeedCard/index.js';

import { FEED_CARD_PARENTS, TIMELINE_ACTIONS } from '../../utils/Constants.js';

class TimelineFeed extends React.Component {
	state = {
		isFirstLoad: true,
		loading: true,
		hasMore: true
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
				hasMore: timelinePosts && timelinePosts.length > 0
			});
		}
	}

	onLoadMore = () => {
		this.setState({ loading: true });
		this.getTimelinePosts();
	};

	renderTimelineFeedCard(post) {
		const { action, subject, target } = post;

		switch (action) {
			case TIMELINE_ACTIONS.PUBLISH:
				const { share } = target;
				const { account: targetAccount } = share;
				const { nickname: targetNickname } = targetAccount;
				const [account] = subject;
				const { avatar, nickname } = account;

				return (
					<FeedCard
						id={post.id}
						post={share}
						parent={FEED_CARD_PARENTS.TIMELINE}
						action={action}
					/>
				);
			// case TIMELINE_ACTIONS.LIKE:
			// 	return (
			// 		<Card title={`${nickname} liked ${targetNickname}'s post`}>
			// 			<FeedCard
			// 				id={post.id}
			// 				post={share}
			// 				parent={FEED_CARD_PARENTS.TIMELINE}
			// 			/>
			// 		</Card>
			// 	);
			default:
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
						renderItem={item => this.renderTimelineFeedCard(item)}
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
		timelinePostsResponse
	};
}

export default connect(
	mapStateToProps,
	{ getTimelinePosts }
)(TimelineFeed);
