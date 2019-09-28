import React from 'react';

import Header from '../Header/index.js';
import FeedCard from '../FeedCard/index.js';

import Api from '../utils/Api';

class HomePage extends React.Component {
	state = {
		posts: []
	};

	componentDidMount() {
		this.getRecentPosts();
	}

	getRecentPosts = async () => {
		const recentPosts = await Api.getRecentPosts();
		const {
			data: { shares }
		} = recentPosts;
		this.setState({ posts: shares });
	};

	render() {
		const { posts } = this.state;
		return (
			<div>
				<Header />
				<div className="App-container">
					<div className="App-content">
						{posts.map(post => (
							<FeedCard post={post} />
						))}
					</div>
				</div>
			</div>
		);
	}
}

export default HomePage;
