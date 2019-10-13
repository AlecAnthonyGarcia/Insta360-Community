import React from 'react';
import './style.scss';

import { Link } from 'react-router-dom';

import { Statistic, Row, Col, List } from 'antd';

import Header from '../Header/index.js';
import FeedCard from '../FeedCard/index.js';

import Api from '../utils/Api';

class HashtagPage extends React.Component {
	state = {
		tag: {},
		posts: [],
		popularPosts: []
	};

	componentDidMount() {
		this.getTag();
		this.getTagPosts();
		this.getTagPopularPosts();
	}

	getTag = async () => {
		const { tag } = this.props.match.params;
		const response = await Api.getTag(tag);
		this.setState({ tag: response.data.tag });
	};

	getTagPosts = async () => {
		const { tag } = this.props.match.params;
		const response = await Api.getTagPosts(tag, 1);
		this.setState({ posts: response.data.shares });
	};

	getTagPopularPosts = async () => {
		const { tag } = this.props.match.params;
		const response = await Api.getTagPopularPosts(tag);
		this.setState({ popularPosts: response.data.shares });
	};

	render() {
		const { tag, posts, popularPosts } = this.state;
		const { user_count, post_count } = tag;

		return (
			<div>
				<Header />

				<div className="App-container">
					<div className="App-content">
						<div className="tag-info-header">
							<div className="tag-info-container">
								<span className="tag-name">{tag.value}</span>
								<Row gutter={16} className="stats-row">
									<Col span={12}>
										<Statistic title="Users" value={user_count} />
									</Col>
									<Col span={12}>
										<Statistic title="Posts" value={post_count} />
									</Col>
								</Row>
							</div>
						</div>

						<List
							grid={{
								gutter: 16,
								xs: 1,
								sm: 2,
								md: 3,
								lg: 3,
								xl: 3,
								xxl: 3
							}}
							dataSource={popularPosts}
							renderItem={item => {
								const { id: postId } = item;

								return (
									<List.Item>
										<Link to={`/post/${postId}`}>
											<img
												alt=""
												src={item.app_thumb}
												className="popular-post-thumbnail"
											/>
										</Link>
									</List.Item>
								);
							}}
						/>

						{posts.map(post => (
							<FeedCard post={post} />
						))}
					</div>
				</div>
			</div>
		);
	}
}

export default HashtagPage;
