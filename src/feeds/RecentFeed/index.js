import React from 'react';

import { connect } from 'react-redux';

import { getRecentPosts } from '../../HomePage/homeActions.js';
import { Spin } from 'antd';

import FeedCard from '../../FeedCard/index.js';

class RecentFeed extends React.Component {
	state = {
		loading: true
	};

	componentDidMount() {
		const { getRecentPosts } = this.props;
		getRecentPosts();
	}

	componentDidUpdate(prevProps) {
		const { recentPosts } = this.props;
		if (prevProps.recentPosts !== recentPosts) {
			this.setState({ loading: false });
		}
	}

	render() {
		const { recentPosts } = this.props;
		const { loading } = this.state;

		return (
			<div>
				<Spin spinning={loading}>
					{recentPosts.map(post => (
						<FeedCard post={post} />
					))}
				</Spin>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { homeReducer } = state;
	const { recentPosts } = homeReducer;
	return {
		recentPosts
	};
}

export default connect(
	mapStateToProps,
	{ getRecentPosts }
)(RecentFeed);
