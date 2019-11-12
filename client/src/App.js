import React from 'react';
import './App.css';
import 'antd/dist/antd.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './HomePage/index.js';
import UserPage from './UserPage/index.js';
import UserLikedPostsPage from './UserLikedPostsPage/index.js';
import PostPage from './PostPage/index.js';
import HashtagPage from './HashtagPage/index.js';
import NoMatchPage from './NoMatchPage';

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route exact path="/user/:userId" component={UserPage} />
				<Route
					exact
					path="/user/:userId/liked"
					component={UserLikedPostsPage}
				/>
				<Route exact path="/post/:postId" component={PostPage} />
				<Route exact path="/tag/:tag" component={HashtagPage} />
				<Route component={NoMatchPage} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
