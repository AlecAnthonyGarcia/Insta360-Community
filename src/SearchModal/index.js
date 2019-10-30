import React from 'react';
import './style.scss';

import { setFollowsMap } from '../HomePage/homeActions';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Modal, Input, Tabs, List, Avatar } from 'antd';

import Api from '../utils/Api';
import FollowButton from '../FollowButton';

const { Search } = Input;
const { TabPane } = Tabs;

class SearchModal extends React.Component {
	constructor(props) {
		super(props);
		this.searchRef = React.createRef();
		this.state = {
			...this.getInitialState(),
			recommendedSearchTags: [],
			recommendedSearchUsers: []
		};
	}

	componentDidMount() {
		this.getRecommendedSearchTags();
		this.getRecommendedSearchUsers();
	}

	getInitialState = () => {
		return {
			tags: [],
			users: [],
			activeTabKey: '1'
		};
	};

	getRecommendedSearchTags = async () => {
		const response = await Api.getRecommendedSearchTags();
		const recommendedSearchTags = response.data.tags;
		this.setState({ recommendedSearchTags, tags: recommendedSearchTags });
	};

	getRecommendedSearchUsers = async () => {
		const response = await Api.getRecommendedSearchUsers();
		const recommendedSearchUsers = response.data.accounts;
		this.setState({ recommendedSearchUsers, users: recommendedSearchUsers });
	};

	searchTags = async query => {
		const response = await Api.searchTags(query);
		this.setState({ tags: response.data.tags });
	};

	searchUsers = async query => {
		const response = await Api.searchUsers(query);
		const {
			data: { accounts: users }
		} = response;

		setFollowsMap(users);

		this.setState({ users });
	};

	onSearch = query => {
		const { activeTabKey } = this.state;
		switch (activeTabKey) {
			case '1':
				this.searchTags(query);
				break;
			case '2':
				this.searchUsers(query);
				break;
			default:
		}
	};

	onTabChange = activeTabKey => {
		this.setState({ activeTabKey });
	};

	onListItemClick = () => {
		this.onCancel();
	};

	onCancel = () => {
		const { onClose } = this.props;

		this.resetModal();

		if (onClose) {
			onClose();
		}
	};

	resetModal = () => {
		const { recommendedSearchTags, recommendedSearchUsers } = this.state;

		this.setState({
			...this.getInitialState(),
			tags: recommendedSearchTags,
			users: recommendedSearchUsers
		});

		const {
			current: {
				input: { state: searchBarState }
			}
		} = this.searchRef;

		searchBarState.value = '';
	};

	render() {
		const { isOpen } = this.props;
		const { activeTabKey, tags, users } = this.state;

		return (
			<Modal
				className="search-modal"
				visible={isOpen}
				title="Search"
				centered
				footer={null}
				style={{ maxHeight: '70vh ' }}
				onCancel={this.onCancel}
			>
				<Search
					ref={this.searchRef}
					className="search-bar"
					placeholder={
						'Search ' + (activeTabKey === '1' ? 'hashtags' : 'users')
					}
					onSearch={this.onSearch}
				/>

				<Tabs
					defaultActiveKey="1"
					activeKey={activeTabKey}
					onChange={this.onTabChange}
				>
					<TabPane tab="Hashtags" key="1">
						<List
							itemLayout="horizontal"
							dataSource={tags}
							renderItem={item => (
								<Link to={`/tag/${item.value}`} onClick={this.onListItemClick}>
									<List.Item key={item.id}>
										<List.Item.Meta
											avatar={<Avatar icon="tag" />}
											title={item.value}
											description={`${item.post_count} posts`}
										/>
									</List.Item>
								</Link>
							)}
						/>
					</TabPane>
					<TabPane tab="Users" key="2">
						<List
							itemLayout="horizontal"
							dataSource={users}
							renderItem={item => (
								<Link to={`/user/${item.id}`} onClick={this.onListItemClick}>
									<List.Item key={item.id}>
										<List.Item.Meta
											avatar={<Avatar src={item.avatar} />}
											title={item.nickname}
											description={`${item.counts.public_post} posts ${item.counts.follower} followers`}
										/>

										<FollowButton userId={item.id} />
									</List.Item>
								</Link>
							)}
						/>
					</TabPane>
				</Tabs>
			</Modal>
		);
	}
}

export default connect(
	null,
	{ setFollowsMap }
)(SearchModal);
