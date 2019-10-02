import React from 'react';

import { connect } from 'react-redux';

import { getTimelinePosts } from '../../HomePage/homeActions.js';
import { Spin } from 'antd';

import FeedCard from '../../FeedCard/index.js';

class TimelineFeed extends React.Component {
	state = {
		loading: true
	};

	componentDidMount() {
		const { getTimelinePosts } = this.props;
		getTimelinePosts();
	}

	componentDidUpdate(prevProps) {
		const { timelinePosts } = this.props;
		if (prevProps.timelinePosts !== timelinePosts) {
			this.setState({ loading: false });
		}
	}

	render() {
		const { timelinePosts } = this.props;
		const { loading } = this.state;

		return (
			<div>
				<Spin spinning={loading}>
					{timelinePosts.map(post => (
						<FeedCard id={post.id} post={post} />
					))}
				</Spin>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { homeReducer } = state;
	const { timelinePosts } = homeReducer;
	return {
		timelinePosts
	};
}

export default connect(
	mapStateToProps,
	{ getTimelinePosts }
)(TimelineFeed);
