import React from 'react';
import './style.scss';

import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';

import logo from '../static/img/logo.png';

import {
	Avatar,
	Col,
	Row,
	Tabs,
	Button,
	Menu,
	Dropdown,
	Icon,
	Badge
} from 'antd';

import { setCurrentTabKey } from '../HomePage/homeActions';
import {
	logout,
	setLoginModalVisibility,
	setSignupModalVisibility,
	setForgotPasswordModalVisibility
} from '../AuthModal/authActions';

import UserAvatar from '../UserAvatar/index.js';
import LoginModal from '../AuthModal/LoginModal/index.js';
import SearchModal from '../SearchModal/index.js';
import SignupModal from '../AuthModal/SignupModal';
import NotificationListModal from '../NotificationListModal';

import Api from '../utils/Api';
import ForgotPasswordModal from '../AuthModal/ForgotPasswordModal';

const { TabPane } = Tabs;

class Header extends React.Component {
	state = {
		isSearchModalOpen: false,
		isNotificationsModalOpen: false,
		unreadNotificationsCount: 0
	};

	componentDidMount() {
		this.getUnreadNotificationsCount();
	}

	getUnreadNotificationsCount = async () => {
		const response = await Api.getUnreadNotificationsCount();
		const { data } = response;
		const { count: unreadNotificationsCount } = data;
		this.setState({ unreadNotificationsCount });
	};

	onSearchButtonClick = () => {
		this.setState({ isSearchModalOpen: true });
	};

	onSearchModalClose = () => {
		this.setState({ isSearchModalOpen: false });
	};

	onNotificationsButtonClick = () => {
		Api.setNotificationsRead();
		this.setState({
			isNotificationsModalOpen: true,
			unreadNotificationsCount: 0
		});
	};

	onNotificationsModalClose = () => {
		this.setState({ isNotificationsModalOpen: false });
	};

	onLoginButtonClick = () => {
		const { setLoginModalVisibility } = this.props;
		setLoginModalVisibility(true);
	};

	onLoginModalClose = () => {
		const { setLoginModalVisibility } = this.props;
		setLoginModalVisibility(false);
	};

	onSignupButtonClick = () => {
		const { setSignupModalVisibility } = this.props;
		setSignupModalVisibility(true);
	};

	onSignupModalClose = () => {
		const { setSignupModalVisibility } = this.props;
		setSignupModalVisibility(false);
	};

	onForgotPasswordModalClose = () => {
		const { setForgotPasswordModalVisibility } = this.props;
		setForgotPasswordModalVisibility(false);
	};

	onTabChange = activeTabKey => {
		const { setCurrentTabKey } = this.props;
		setCurrentTabKey(activeTabKey);
	};

	renderTabs = () => {
		const { location, auth } = this.props;
		const { pathname } = location;

		if (pathname === '/') {
			return (
				<Tabs defaultActiveKey="featured" onChange={this.onTabChange}>
					{auth && <TabPane tab="Following" key="timeline" />}
					<TabPane tab="Featured" key="featured" />
					<TabPane tab="Recent" key="recent" />
				</Tabs>
			);
		}

		return null;
	};

	render() {
		const {
			auth,
			user,
			logout,
			isLoginModalOpen,
			isSignupModalOpen,
			isForgotPasswordModalOpen
		} = this.props;
		const {
			isSearchModalOpen,
			isNotificationsModalOpen,
			unreadNotificationsCount
		} = this.state;
		const { avatar } = user;

		const headerMenu = (
			<Menu>
				<Menu.Item key="profile">
					<Link to={`/user/${user.id}`}>
						<Icon type="user" /> View Profile
					</Link>
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="logout" onClick={logout}>
					<Icon type="logout" /> Logout
				</Menu.Item>
			</Menu>
		);

		return (
			<div className="header">
				<div className="header-content">
					<Row className="header-row">
						<Col span={8} className="header-logo-container">
							<Link to="/">
								<img src={logo} alt="" className="App-logo" />
							</Link>
						</Col>

						<MediaQuery minWidth={992}>
							<Col span={8} className="header-tabs-container">
								{this.renderTabs()}
							</Col>
						</MediaQuery>

						<Col xs={16} lg={8} className="header-actions-container">
							<Button
								className="header-search-button"
								shape="circle"
								icon="search"
								onClick={this.onSearchButtonClick}
							/>

							{auth && (
								<Badge count={unreadNotificationsCount}>
									<Button
										shape="circle"
										icon="bell"
										onClick={this.onNotificationsButtonClick}
									/>
								</Badge>
							)}

							{auth ? (
								<Dropdown overlay={headerMenu} trigger={['click']}>
									<UserAvatar className="header-avatar" src={avatar} />
								</Dropdown>
							) : (
								<div>
									<Button
										className="header-login-button"
										onClick={this.onLoginButtonClick}
									>
										Login
									</Button>
									<Button
										className="header-signup-button"
										type="link"
										onClick={this.onSignupButtonClick}
									>
										Signup
									</Button>
								</div>
							)}
						</Col>
					</Row>
				</div>

				<MediaQuery maxWidth={992}>{this.renderTabs()}</MediaQuery>

				<SearchModal
					isOpen={isSearchModalOpen}
					onClose={this.onSearchModalClose}
				/>

				{isNotificationsModalOpen && (
					<NotificationListModal
						title="Notifications"
						onClose={this.onNotificationsModalClose}
					/>
				)}

				{!auth && (
					<LoginModal
						isOpen={isLoginModalOpen}
						onClose={this.onLoginModalClose}
					/>
				)}

				{!auth && (
					<SignupModal
						isOpen={isSignupModalOpen}
						onClose={this.onSignupModalClose}
					/>
				)}

				{!auth && (
					<ForgotPasswordModal
						isOpen={isForgotPasswordModalOpen}
						onClose={this.onForgotPasswordModalClose}
					/>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { authReducer } = state;
	const {
		isAuthenticated,
		isLoginModalOpen,
		isSignupModalOpen,
		isForgotPasswordModalOpen,
		user
	} = authReducer;
	return {
		auth: isAuthenticated,
		user,
		isLoginModalOpen,
		isSignupModalOpen,
		isForgotPasswordModalOpen
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		{
			logout,
			setCurrentTabKey,
			setLoginModalVisibility,
			setSignupModalVisibility,
			setForgotPasswordModalVisibility
		}
	)(Header)
);
