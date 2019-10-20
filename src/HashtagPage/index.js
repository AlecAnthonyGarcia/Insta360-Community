import React from 'react';
import './style.scss';

import { Link } from 'react-router-dom';

import { Spin, Statistic, Row, Col, List, Avatar, Divider } from 'antd';

import Header from '../Header/index.js';
import FeedCard from '../FeedCard/index.js';

import Api from '../utils/Api';

class HashtagPage extends React.Component {
	state = {
		tag: {},
		loading: true,
		initiator: null,
		campaignTag: null,
		posts: [],
		popularPosts: []
	};

	componentDidMount() {
		this.loadHashtagData();
	}

	loadHashtagData() {
		this.setState({ loading: true });
		this.getTag();
		this.getTagPosts();
		this.getTagPopularPosts();
	}

	componentDidUpdate(prevProps) {
		const { tag } = this.props.match.params;
		const { tag: previousTag } = prevProps.match.params;
		if (tag !== previousTag) {
			this.loadHashtagData();
		}
	}

	getTag = async () => {
		const { tag } = this.props.match.params;
		const response = await Api.getTag(tag);
		const {
			data: { tag: tagInfo, initiator, campaign_tag: campaignTag }
		} = response;
		this.setState({ loading: false, tag: tagInfo, initiator, campaignTag });
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
		const {
			loading,
			tag,
			posts,
			popularPosts,
			initiator,
			campaignTag
		} = this.state;
		const { user_count, post_count } = tag;
		const { content } = campaignTag || {};

		return (
			<div>
				<Header />

				<div className="App-container">
					<div className="App-content">
						<Spin spinning={loading}>
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
						</Spin>

						{campaignTag && (
							<div>
								<a
									href={content.link}
									target="_blank"
									rel="noopener noreferrer"
								>
									<img
										alt=""
										className="campaign-tag-cover"
										src={content.cover}
									/>
								</a>
								<div className="campaign-info-container">
									<Link to={`/user/${initiator.id}`}>
										<Avatar src={initiator.avatar} />
										<span className="campaign-tag-user-nickname">
											{initiator.nickname}
										</span>
									</Link>
									<p className="campaign-tag-description ">
										{content.description}
									</p>
								</div>
								<Divider />
							</div>
						)}

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
