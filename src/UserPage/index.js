import React from 'react';
import './style.scss';

import { Link } from 'react-router-dom';

import { Avatar, Statistic, Row, Col, List } from 'antd';

import Header from '../Header/index.js';
import UserAvatar from '../UserAvatar/index.js';
import FeedCard from '../FeedCard/index.js';
import UserListModal from '../UserListModal/index.js';

import Api from '../utils/Api';

class UserPage extends React.Component {
	state = {
		user: {},
		posts: [],
		popularPosts: [],
		isUserListModalOpen: false,
		userListType: null
	};

	componentDidMount() {
		this.getUser();
		this.getUserPosts();
		this.getUserPopularPosts();
	}

	getUser = async () => {
		const { userId } = this.props.match.params;
		const response = await Api.getUser(userId);
		this.setState({ user: response.data });
	};

	getUserPosts = async () => {
		const { userId } = this.props.match.params;
		const response = await Api.getUserPosts(userId, 1);
		this.setState({ posts: response.data.list });
	};

	getUserPopularPosts = async () => {
		const { userId } = this.props.match.params;
		const response = await Api.getUserPopularPosts(userId);
		this.setState({ popularPosts: response.data.list });
	};

	showUserListModal = type => {
		this.setState({ isUserListModalOpen: true, userListType: type });
	};

	closeUserListModal = () => {
		this.setState({ isUserListModalOpen: false });
	};

	render() {
		const {
			user,
			posts,
			popularPosts,
			isUserListModalOpen,
			userListType
		} = this.state;
		const { account = {}, counts = {} } = user;
		const { id: userId, avatar, nickname, description } = account;
		const { follower, follows, got_like, public_post } = counts;

		return (
			<div>
				<Header />

				<div className="App-container">
					<div className="App-content">
						<div className="user-info-header">
							<UserAvatar size={64} src={avatar} className="user-avatar" />

							<div className="user-info-container">
								<span className="user-nickname">{nickname}</span>
								<Row gutter={16} className="stats-row">
									<Col span={6}>
										<Statistic title="Posts" value={public_post} />
									</Col>
									<Col
										span={6}
										onClick={() => this.showUserListModal('following')}
									>
										<Statistic
											className="clickable"
											title="Following"
											value={follows}
										/>
									</Col>
									<Col
										span={6}
										onClick={() => this.showUserListModal('followers')}
									>
										<Statistic
											className="clickable"
											title="Followers"
											value={follower}
										/>
									</Col>
									<Col span={6}>
										<Statistic title="Likes" value={got_like} />
									</Col>
								</Row>
								<p>{description}</p>
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
								const { app_thumb } = item;

								return (
									<List.Item>
										<Link to={`/post/${postId}`}>
											<img
												alt=""
												src={app_thumb}
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
				{isUserListModalOpen && (
					<UserListModal
						title={userListType === 'followers' ? 'Followers' : 'Following'}
						type={userListType}
						userId={userId}
						onClose={this.closeUserListModal}
					/>
				)}
			</div>
		);
	}
}

export default UserPage;
