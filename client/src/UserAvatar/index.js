import React from 'react';

import defaultAvatar from '../static/img/icon_default_avatar.png';

import { Avatar } from 'antd';

function UserAvatar(props) {
	let { src } = props;

	if (src === '' || src === undefined) {
		src = defaultAvatar;
	}

	return <Avatar {...props} src={src} />;
}

export default UserAvatar;
