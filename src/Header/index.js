import React from 'react';
import './style.scss';

import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import logo from '../static/img/logo.png';

import { Avatar, Col, Row, Tabs, Button, Menu, Dropdown, Icon } from 'antd';

import { setCurrentTabKey } from '../HomePage/homeActions';
import {
	logout,
	setLoginModalVisibility,
	setSignupModalVisibility
} from '../AuthModal/authActions';
import LoginModal from '../AuthModal/LoginModal/index.js';
import SearchModal from '../SearchModal/index.js';
import SignupModal from '../AuthModal/SignupModal';

const { TabPane } = Tabs;

class Header extends React.Component {
	state = {
		isSearchModalOpen: false
	};

	onSearchButtonClick = () => {
		this.setState({ isSearchModalOpen: true });
	};

	onSearchModalClose = () => {
		this.setState({ isSearchModalOpen: false });
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

	onTabChange = activeTabKey => {
		const { setCurrentTabKey } = this.props;
		setCurrentTabKey(activeTabKey);
	};

	render() {
		const {
			location,
			auth,
			user,
			logout,
			isLoginModalOpen,
			isSignupModalOpen
		} = this.props;
		const { pathname } = location;
		const { isSearchModalOpen } = this.state;
		const { avatar } = user;

		const headerMenu = (
			<Menu>
				<Menu.Item key="profile">
					<Link to={`/user/${user.id}`}>
						<Icon type="user" /> View Profile
					</Link>
				</Menu.Item>
				<Menu.Item key="settings">
					<Link to={`/settings`}>
						<Icon type="setting" /> Settings
					</Link>
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="logout" onClick={logout}>
					<Icon type="logout" />
					Logout
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

						<Col span={8} className="header-tabs-container">
							{pathname === '/' && (
								<Tabs defaultActiveKey="featured" onChange={this.onTabChange}>
									<TabPane tab="Following" key="timeline"></TabPane>
									<TabPane tab="Featured" key="featured"></TabPane>
									<TabPane tab="Recent" key="recent"></TabPane>
								</Tabs>
							)}
						</Col>

						<Col span={8} className="header-actions-container">
							<Button
								shape="circle"
								icon="search"
								onClick={this.onSearchButtonClick}
							/>

							{auth ? (
								<Dropdown overlay={headerMenu} trigger={['click']}>
									<Avatar className="header-avatar" src={avatar} />
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
										className="header-login-button"
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

				<SearchModal
					isOpen={isSearchModalOpen}
					onClose={this.onSearchModalClose}
				/>

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
		user
	} = authReducer;
	return {
		auth: isAuthenticated,
		user,
		isLoginModalOpen,
		isSignupModalOpen
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		{
			logout,
			setCurrentTabKey,
			setLoginModalVisibility,
			setSignupModalVisibility
		}
	)(Header)
);
