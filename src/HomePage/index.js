import React from 'react';

import { connect } from 'react-redux';

import Header from '../Header/index.js';
import TimelineFeed from '../feeds/TimelineFeed/index.js';
import FeaturedFeed from '../feeds/FeaturedFeed/index.js';
import RecentFeed from '../feeds/RecentFeed/index.js';

class HomePage extends React.Component {
	state = {
		currentFeedComponent: null
	};

	componentDidMount() {
		const { currentTabKey } = this.props;
		this.updateFeedComponent(currentTabKey);
	}

	componentDidUpdate(prevProps) {
		const { currentTabKey } = this.props;
		if (prevProps.currentTabKey !== currentTabKey) {
			this.updateFeedComponent(currentTabKey);
		}
	}

	updateFeedComponent = currentTabKey => {
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

	setCurrentFeedComponent = component => {
		this.setState({ currentFeedComponent: component });
	};

	render() {
		const { currentFeedComponent } = this.state;

		return (
			<div>
				<Header />
				<div className="App-container">
					<div className="App-content">{currentFeedComponent}</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { homeReducer } = state;
	const { currentTabKey } = homeReducer;
	return {
		currentTabKey
	};
}

export default connect(
	mapStateToProps,
	null
)(HomePage);
