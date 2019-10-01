import React from 'react';
import './style.scss';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import logo from '../static/img/logo.png';

import { Avatar, Col, Row, Tabs, Button, Menu, Dropdown, Icon } from 'antd';

import { logout } from '../LoginModal/loginActions';
import LoginModal from '../LoginModal/index.js';
import SearchModal from '../SearchModal/index.js';

const { TabPane } = Tabs;

class Header extends React.Component {
	state = {
		isSearchModalOpen: false,
		isLoginModalOpen: false
	};

	onSearchButtonClick = () => {
		this.setState({ isSearchModalOpen: true });
	};

	onSearchModalClose = () => {
		this.setState({ isSearchModalOpen: false });
	};

	onLoginButtonClick = () => {
		this.setState({ isLoginModalOpen: true });
	};

	onLoginModalClose = () => {
		this.setState({ isLoginModalOpen: false });
	};

	render() {
		const { auth, user, logout } = this.props;
		const { isSearchModalOpen, isLoginModalOpen } = this.state;
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
							<Tabs defaultActiveKey="2">
								<TabPane tab="Following" key="1"></TabPane>
								<TabPane tab="Featured" key="2"></TabPane>
								<TabPane tab="Recent" key="3"></TabPane>
							</Tabs>
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
	const { isAuthenticated, user } = loginReducer;
	return {
		auth: isAuthenticated,
		user
	};
}

export default connect(
	mapStateToProps,
	{ logout }
)(Header);
