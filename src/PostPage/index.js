import React from 'react';

import Header from '../Header/index.js';
import FeedCard from '../FeedCard/index.js';

import Api from '../utils/Api';

class PostPage extends React.Component {
	state = {
		post: {},
		comments: {}
	};

	componentDidMount() {
		this.getPost();
		this.getComments();
	}

	getPost = async () => {
		const { postId } = this.props.match.params;
		const response = await Api.getPost(postId);
		this.setState({ post: response.data.share });
	};

	getComments = async () => {
		const { postId } = this.props.match.params;
		const response = await Api.getComments(postId, 1);
		this.setState({ comments: response.data.share });
	};

	render() {
		const { post } = this.state;

		return (
			<div>
				<Header />

				<div className="App-container">
					<div className="App-content">
						<FeedCard post={post} />
					</div>
				</div>
			</div>
		);
	}
}

export default PostPage;
