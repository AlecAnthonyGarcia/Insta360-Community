import React from 'react';
import './style.scss';

import logo from '../static/img/logo.png';

import { Link } from 'react-router-dom';
import { Avatar, Col, Row, Tabs, Button } from 'antd';

const { TabPane } = Tabs;

class Header extends React.Component {
	onSearchButtonClick = () => {
		this.setState({ isSearchModalOpen: true });
	};

	onSearchModalClose = () => {
		this.setState({ isSearchModalOpen: false });
	};

	render() {
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
			</div>
		);
	}
}

export default Header;
