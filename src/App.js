import React from 'react';
import './App.css';
import 'antd/dist/antd.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './HomePage/index.js';
import UserPage from './UserPage/index.js';
import PostPage from './PostPage/index.js';
import HashtagPage from './HashtagPage/index.js';

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route exact path="/user/:userId" component={UserPage} />
				<Route exact path="/post/:postId" component={PostPage} />
				<Route exact path="/tag/:tag" component={HashtagPage} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
