import React from 'react';

import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import Header from '../Header/index.js';
import TimelineFeed from '../feeds/TimelineFeed/index.js';
import FeaturedFeed from '../feeds/FeaturedFeed/index.js';
import RecentFeed from '../feeds/RecentFeed/index.js';

class HomePage extends React.Component {
	state = {
		currentFeedComponent: null,
	};

	componentDidMount() {
		const { currentTabKey } = this.props;
		this.updateFeedComponent(currentTabKey);
	}

	componentDidUpdate(prevProps) {
		let { currentTabKey, auth } = this.props;
		if (prevProps.currentTabKey !== currentTabKey || prevProps.auth !== auth) {
			if (!auth && currentTabKey === 'timeline') {
				currentTabKey = 'featured';
			}

			this.updateFeedComponent(currentTabKey);
		}
	}

	updateFeedComponent = (currentTabKey) => {
		switch (currentTabKey) {
			case 'timeline':
				this.setCurrentFeedComponent(<TimelineFeed />);
				break;
			case 'featured':
				this.setCurrentFeedComponent(<FeaturedFeed />);
				break;
			case 'recent':
				this.setCurrentFeedComponent(<RecentFeed />);
				break;
			default:
		}
	};

	setCurrentFeedComponent = (component) => {
		this.setState({ currentFeedComponent: component });
	};

	render() {
		const { currentFeedComponent } = this.state;

		const HomePageComponent = () => {
			const isTabletOrMobile = useMediaQuery({ maxWidth: 992 });

			return (
				<div
					className={
						isTabletOrMobile ? 'App-container-tabbed-header' : 'App-container'
					}
				>
					<div className="App-content">{currentFeedComponent}</div>
				</div>
			);
		};

		return (
			<div>
				<Header />
				<HomePageComponent />
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { authReducer, homeReducer } = state;
	const { isAuthenticated } = authReducer;
	const { currentTabKey } = homeReducer;
	return {
		currentTabKey,
		auth: isAuthenticated,
	};
}

export default connect(mapStateToProps, null)(HomePage);
