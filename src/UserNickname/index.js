import React from 'react';

import { Link } from 'react-router-dom';

import OfficialIcon from '../static/img/icon_official.png';

function UserNickname(props) {
	const { user, disableLink, ...other } = props;
	const { id: userId, nickname, is_official } = user;

	return (
		<React.Fragment>
			<Link
				{...other}
				to={`/user/${userId}`}
				disabled={disableLink}
				style={{ color: 'black' }}
			>
				{nickname}
			</Link>
			{is_official && (
				<img alt="Official" className="official-icon" src={OfficialIcon} />
			)}
		</React.Fragment>
	);
}

export default UserNickname;
