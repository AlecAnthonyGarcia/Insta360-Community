import React from 'react';

import Header from '../Header/index.js';
import FeedCard from '../FeedCard/index.js';

import Api from '../utils/Api';

class PostPage extends React.Component {
	state = {
		post: {}
	};

	componentDidMount() {
		this.getPost();
	}

	getPost = async () => {
		const { postId } = this.props.match.params;
		const response = await Api.getPost(postId);
		this.setState({ post: response.data.share });
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
