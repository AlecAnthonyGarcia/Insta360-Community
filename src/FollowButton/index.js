import React from 'react';

import { connect } from 'react-redux';

import { setLoginModalVisibility } from '../AuthModal/authActions';
import { followUser, unfollowUser } from '../HomePage/homeActions';

import { Button } from 'antd';

const FollowButton = props => {
	const { userId, followsMap, authedUser } = props;

	const followed = followsMap[userId];
	const { id: authedUserId } = authedUser || {};

	const onFollowButtonClick = (e, userId) => {
		e.preventDefault();

		const { auth, followUser, unfollowUser, setLoginModalVisibility } = props;

		if (auth) {
			if (followed) {
				unfollowUser(userId);
			} else {
				followUser(userId);
			}
		} else {
			setLoginModalVisibility(true);
		}
	};

	if (authedUserId && authedUserId === userId) {
		return null;
	}

	return (
		<Button
			className="follow-button"
			shape="round"
			type={followed ? 'link' : 'primary'}
			icon={followed ? 'check-circle' : 'user-add'}
			onClick={e => onFollowButtonClick(e, userId)}
		>
			{followed ? 'Following' : 'Follow'}
		</Button>
	);
};

function mapStateToProps(state) {
	const { authReducer, homeReducer } = state;
	const { isAuthenticated, user } = authReducer;
	const { followsMap } = homeReducer;
	return {
		auth: isAuthenticated,
		authedUser: user,
		followsMap
	};
}

export default connect(
	mapStateToProps,
	{ followUser, unfollowUser, setLoginModalVisibility }
)(FollowButton);
