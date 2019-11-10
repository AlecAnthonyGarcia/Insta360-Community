import React from 'react';

import Header from '../Header/index.js';
import FeedCard from '../FeedCard/index.js';

import Api from '../utils/Api';
import NoMatchPage from '../NoMatchPage.js';
import { Skeleton } from 'antd';

class PostPage extends React.Component {
	state = {
		loading: true,
		post: {}
	};

	componentDidMount() {
		this.getPost();
	}

	getPost = async () => {
		const { postId } = this.props.match.params;
		const response = await Api.getPost(postId);

		const { data } = response;
		const { share: post } = data || {};

		this.setState({ post, loading: false });
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

export default PostPage;
