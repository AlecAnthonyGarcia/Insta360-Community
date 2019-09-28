import React from 'react';
import './style.scss';

import { Link } from 'react-router-dom';

import logo from '../static/img/logo.png';

import { Avatar, Col, Row, Tabs, Button } from 'antd';

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

	render() {
		const { isSearchModalOpen } = this.state;

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
							<Avatar className="header-avatar" icon="user" />
						</Col>
					</Row>
				</div>
				<SearchModal
					isOpen={isSearchModalOpen}
					onClose={this.onSearchModalClose}
				/>
			</div>
		);
	}
}

export default Header;
