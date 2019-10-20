import React from 'react';
import './style.scss';

import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import logo from '../static/img/logo.png';

import { Avatar, Col, Row, Tabs, Button, Menu, Dropdown, Icon } from 'antd';

import { setCurrentTabKey } from '../HomePage/homeActions';
import { logout, setLoginModalVisibility } from '../LoginModal/loginActions';
import LoginModal from '../LoginModal/index.js';
import SearchModal from '../SearchModal/index.js';

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

	onTabChange = activeTabKey => {
		const { setCurrentTabKey } = this.props;
		setCurrentTabKey(activeTabKey);
	};

	render() {
		const { location, auth, user, logout, isLoginModalOpen } = this.props;
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
								<Button
									className="header-login-button"
									onClick={this.onLoginButtonClick}
								>
									Login
								</Button>
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
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { loginReducer } = state;
	const { isAuthenticated, isLoginModalOpen, user } = loginReducer;
	return {
		auth: isAuthenticated,
		user,
		isLoginModalOpen
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		{ logout, setCurrentTabKey, setLoginModalVisibility }
	)(Header)
);
