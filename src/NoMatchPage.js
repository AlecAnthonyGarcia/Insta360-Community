import React from 'react';

import LogoErrorIcon from './static/img/icon_logo_error.png';

import { Link } from 'react-router-dom';

import Header from './Header';

const NoMatch = () => {
	return (
		<div style={{ textAlign: 'center' }}>
			<img alt="Error" src={LogoErrorIcon} style={{ width: '200px' }} />

			<h2>Sorry, this page isn't available.</h2>
			<p>
				The link you followed may be broken, or the page may have been removed.{' '}
				<Link to="/">Go back home.</Link>
			</p>
		</div>
	);
};

const NoMatchPage = () => {
	return (
		<div className="App-container">
			<Header />
			<NoMatch />
		</div>
	);
};

export default NoMatchPage;
