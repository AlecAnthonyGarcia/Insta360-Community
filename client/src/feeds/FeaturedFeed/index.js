import React from 'react';

import { connect } from 'react-redux';

import { getFeaturedPosts } from '../../HomePage/homeActions.js';

import { List, Spin } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';

import FeedCard from '../../FeedCard/index.js';

import { FEED_CARD_PARENTS } from '../../utils/Constants.js';

class FeaturedFeed extends React.Component {
	state = {
		isFirstLoad: true,
		loading: true,
		hasMore: true,
	};

	componentDidMount() {
		this.getFeaturedPosts();
	}

	getFeaturedPosts() {
		const { getFeaturedPosts, featuredPostsResponse } = this.props;
		const { postIdCursor } = featuredPostsResponse;
		getFeaturedPosts(postIdCursor);
	}

	componentDidUpdate(prevProps) {
		const { featuredPostsResponse } = this.props;
		if (prevProps.featuredPostsResponse !== featuredPostsResponse) {
			const { shares: featuredPosts } = featuredPostsResponse;
			this.setState({
				loading: false,
				isFirstLoad: false,
				hasMore: featuredPosts && featuredPosts.length > 0,
			});
		}
	}

	onLoadMore = () => {
		this.setState({ loading: true });
		this.getFeaturedPosts();
	};

	render() {
		const { featuredPostsResponse } = this.props;
		const { shares: featuredPosts } = featuredPostsResponse;
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
						dataSource={featuredPosts}
						loading={loading}
						renderItem={(item) => (
							<FeedCard
								key={item.id}
								post={item}
								parent={FEED_CARD_PARENTS.FEATURED}
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
	const { featuredPostsResponse } = homeReducer;
	return {
		featuredPostsResponse,
	};
}

export default connect(mapStateToProps, { getFeaturedPosts })(FeaturedFeed);
