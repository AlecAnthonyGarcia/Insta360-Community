import React from 'react';

import {
	setFollowed,
	setFollowsMap,
	setLikesMap,
	extractAccountsFromPosts,
} from '../HomePage/homeActions';

import { connect } from 'react-redux';

import Header from '../Header/index.js';
import FeedCard from '../FeedCard/index.js';

import Api from '../utils/Api';
import NoMatchPage from '../NoMatchPage.js';
import { Skeleton } from 'antd';

class PostPage extends React.Component {
	state = {
		loading: true,
		post: {},
	};

	componentDidMount() {
		this.getPost();
	}

	componentDidUpdate(prevProps) {
		const {
			match: { params },
			auth,
		} = this.props;
		const { postId } = params;
		const { postId: previousPostId } = prevProps.match.params;
		if (postId !== previousPostId || prevProps.auth !== auth) {
			this.getPost();
		}
	}

	getPost = async () => {
		const {
			match: { params },
			setFollowsMap,
			setLikesMap,
		} = this.props;
		const { postId } = params;

		const response = await Api.getPost(postId);

		const { data } = response;
		const { share: post } = data || {};

		this.setState({ post, loading: false });

		if (!post) {
			return;
		}

		const posts = [post];

		setFollowsMap(extractAccountsFromPosts(posts));
		setLikesMap({ shares: posts });
	};

	render() {
		const { loading, post } = this.state;

		if (!post) {
			return <NoMatchPage />;
		}

		return (
			<div>
				<Header />

				<div className="App-container">
					<div className="App-content">
						<Skeleton loading={loading} active>
							<FeedCard post={post} />
						</Skeleton>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { authReducer } = state;
	const { isAuthenticated } = authReducer;
	return {
		auth: isAuthenticated,
	};
}

export default connect(mapStateToProps, {
	setFollowed,
	setFollowsMap,
	setLikesMap,
	extractAccountsFromPosts,
})(PostPage);
