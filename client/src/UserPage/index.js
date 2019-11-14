import React from 'react';
import './style.scss';

import {
	setFollowed,
	setFollowsMap,
	setLikesMap,
	extractAccountsFromPosts
} from '../HomePage/homeActions';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Spin, Statistic, Row, Col, List, Skeleton, Card } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';

import NoMatchPage from '../NoMatchPage';
import Header from '../Header/index.js';
import UserAvatar from '../UserAvatar/index.js';
import FeedCard from '../FeedCard/index.js';
import UserListModal from '../UserListModal/index.js';

import { renderPostThumbnail, kFormatter } from '../utils/Utils.js';
import Api from '../utils/Api';
import FollowButton from '../FollowButton';
import UserNickname from '../UserNickname';

class UserPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.getInitialState();
	}

	getInitialState = () => {
		return {
			user: {},
			posts: [],
			popularPosts: [],
			isFirstLoad: true,
			loading: true,
			hasMore: true,
			currentPage: 1,
			totalPages: 1,
			totalCount: null,
			userListType: null,
			isUserListModalOpen: false
		};
	};

	componentDidMount() {
		this.loadUserData();
	}

	loadUserData() {
		this.setState(this.getInitialState(), async () => {
			const user = await this.getUser();

			if (user) {
				this.getUserPosts();
				this.getUserPopularPosts();
			}
		});
	}

	componentDidUpdate(prevProps) {
		const {
			match: { params },
			auth
		} = this.props;
		const { userId } = params;
		const { userId: previousUserId } = prevProps.match.params;
		if (userId !== previousUserId || prevProps.auth !== auth) {
			this.loadUserData();
		}
	}

	getUser = async () => {
		const {
			match: { params },
			setFollowed
		} = this.props;
		const { userId } = params;

		const response = await Api.getUser(userId);

		const { data: user } = response;

		this.setState({ user });

		if (!user) {
			return user;
		}

		const { account } = user;
		const { followed } = account;

		setFollowed(userId, followed);

		return user;
	};

	getUserPosts = async () => {
		const { posts, currentPage } = this.state;
		const {
			match: { params },
			setFollowsMap,
			setLikesMap
		} = this.props;
		const { userId } = params;

		const response = await Api.getUserPosts(userId, currentPage);
		const { data } = response;
		const { list, total_page: totalPages, total_count: totalCount } = data;

		setFollowsMap(extractAccountsFromPosts(list));
		setLikesMap({ shares: list });

		this.setState({
			loading: false,
			isFirstLoad: false,
			posts: posts.concat(list),
			totalPages,
			totalCount
		});
	};

	getUserPopularPosts = async () => {
		const {
			match: { params },
			setFollowsMap
		} = this.props;
		const { userId } = params;

		const response = await Api.getUserPopularPosts(userId);
		const { data } = response;
		const { list: popularPosts } = data;

		setFollowsMap(extractAccountsFromPosts(popularPosts));

		this.setState({ popularPosts });
	};

	onLoadMore = () => {
		let { currentPage, totalPages } = this.state;

		if (currentPage < totalPages) {
			currentPage = currentPage + 1;

			this.setState(
				prevState => ({
					loading: true,
					hasMore: currentPage < totalPages,
					currentPage: prevState.currentPage + 1
				}),
				() => {
					this.getUserPosts();
				}
			);
		}
	};

	showUserListModal = type => {
		this.setState({ isUserListModalOpen: true, userListType: type });
	};

	closeUserListModal = () => {
		this.setState({ isUserListModalOpen: false });
	};

	renderPopularPosts = () => {
		const { popularPosts } = this.state;

		if (popularPosts.length === 0) {
			return null;
		}

		return (
			<List
				className="popular-posts-list"
				header={<div>Popular</div>}
				grid={{ gutter: 16, column: 3 }}
				dataSource={popularPosts}
				renderItem={item => {
					return <List.Item>{renderPostThumbnail(item)}</List.Item>;
				}}
			/>
		);
	};

	renderUserPosts = () => {
		const { isFirstLoad, loading, hasMore, totalCount, posts } = this.state;

		const renderHeader = () => {
			if (!loading && posts.length > 0) {
				return <div>Posts ({totalCount})</div>;
			}
			return null;
		};

		return (
			<InfiniteScroll
				initialLoad={false}
				pageStart={0}
				loadMore={this.onLoadMore}
				hasMore={!loading && hasMore}
				useWindow={true}
			>
				<List
					className="posts-list"
					header={renderHeader()}
					dataSource={posts}
					loading={loading}
					renderItem={item => <FeedCard key={item.id} post={item} />}
				>
					{loading && !isFirstLoad && hasMore && (
						<div className="loading-container">
							<Spin />
						</div>
					)}
				</List>
			</InfiniteScroll>
		);
	};

	render() {
		const { loading, user, isUserListModalOpen, userListType } = this.state;
		const { account = {}, counts = {} } = user || {};
		const { id: userId, avatar, description } = account;
		const { follower, follows, got_like, like, public_post } = counts;

		if (!user) {
			return <NoMatchPage />;
		}

		return (
			<div>
				<Header />

				<div className="App-container">
					<div className="App-content">
						<Skeleton loading={loading} active avatar>
							<Card className="user-info-header-card">
								<div className="user-info-header-container">
									<UserAvatar size={77} src={avatar} className="user-avatar" />

									<div className="user-info-container">
										<div className="user-nickname-row">
											<div className="user-nickname-container">
												<span className="user-nickname">
													<UserNickname user={account} disableLink />
												</span>
												<span>
													{got_like && got_like.toLocaleString()} likes
												</span>
											</div>
											<FollowButton userId={userId} />
										</div>

										<p className="user-bio">{description}</p>

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
													value={kFormatter(follower)}
												/>
											</Col>
											<Col span={6}>
												<Link to={`/user/${userId}/liked`}>
													<Statistic title="Liked" value={like} />
												</Link>
											</Col>
										</Row>
									</div>
								</div>
							</Card>
						</Skeleton>

						{this.renderPopularPosts()}

						{this.renderUserPosts()}
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

function mapStateToProps(state) {
	const { authReducer } = state;
	const { isAuthenticated } = authReducer;
	return {
		auth: isAuthenticated
	};
}

export default connect(mapStateToProps, {
	setFollowed,
	setFollowsMap,
	setLikesMap,
	extractAccountsFromPosts
})(UserPage);
