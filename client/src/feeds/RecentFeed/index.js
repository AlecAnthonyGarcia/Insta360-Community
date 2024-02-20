import React from 'react';

import { connect } from 'react-redux';

import { getRecentPosts } from '../../HomePage/homeActions.js';

import { List, Spin } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';

import FeedCard from '../../FeedCard/index.js';

import { FEED_CARD_PARENTS } from '../../utils/Constants.js';

class RecentFeed extends React.Component {
	state = {
		isFirstLoad: true,
		loading: true,
		hasMore: true,
	};

	componentDidMount() {
		this.getRecentPosts();
	}

	getRecentPosts() {
		const { getRecentPosts, recentPostsResponse } = this.props;
		const { postIdCursor, queue } = recentPostsResponse;
		getRecentPosts(postIdCursor, queue);
	}

	componentDidUpdate(prevProps) {
		const { recentPostsResponse } = this.props;
		if (prevProps.recentPostsResponse !== recentPostsResponse) {
			const { shares: recentPosts } = recentPostsResponse;
			this.setState({
				loading: false,
				isFirstLoad: false,
				hasMore: recentPosts && recentPosts.length > 0,
			});
		}
	}

	onLoadMore = () => {
		this.setState({ loading: true });
		this.getRecentPosts();
	};

	render() {
		const { recentPostsResponse } = this.props;
		const { shares: recentPosts } = recentPostsResponse;
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
						dataSource={recentPosts}
						loading={loading}
						renderItem={(item) => (
							<FeedCard
								key={item.id}
								post={item}
								parent={FEED_CARD_PARENTS.RECENT}
							/>
						)}
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
	const { homeReducer } = state;
	const { recentPostsResponse } = homeReducer;
	return {
		recentPostsResponse,
	};
}

export default connect(mapStateToProps, { getRecentPosts })(RecentFeed);
