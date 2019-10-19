import React from 'react';
import './style.scss';

import { Link } from 'react-router-dom';

import { Modal, List, Spin } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';

import UserAvatar from '../UserAvatar/index.js';

import Api from '../utils/Api';

class CommentListModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			comments: [],
			isFirstLoad: true,
			loading: true,
			hasMore: true,
			currentPage: 1,
			totalPages: 1,
			totalCount: null
		};
	}

	componentDidMount() {
		this.getComments();
	}

	getComments = async () => {
		const { comments, currentPage } = this.state;
		const { postId } = this.props;

		const response = await Api.getComments(postId, currentPage);

		const { data } = response;
		const { list, total_page: totalPages, total_count: totalCount } = data;

		this.setState({
			loading: false,
			isFirstLoad: false,
			comments: comments.concat(list),
			totalPages,
			totalCount
		});
	};

	onLoadMore = () => {
		let { currentPage, totalPages } = this.state;

		if (currentPage < totalPages) {
			currentPage = currentPage + 1;

			this.setState(
				prevState => ({
					loading: true,
					hasMore: currentPage < totalPages,
					currentPage: prevState.currentPage + 1
				}),
				() => {
					this.getComments();
				}
			);
		}
	};

	onCancel = () => {
		const { onClose } = this.props;

		if (onClose) {
			onClose();
		}
	};

	render() {
		const { title } = this.props;
		const { isFirstLoad, loading, hasMore, totalCount, comments } = this.state;

		return (
			<Modal
				className="comment-list-modal"
				visible
				title={title + (totalCount ? ` (${totalCount})` : '')}
				centered
				footer={null}
				style={{ maxHeight: '70vh ' }}
				onCancel={this.onCancel}
			>
				<InfiniteScroll
					initialLoad={false}
					pageStart={0}
					loadMore={this.onLoadMore}
					hasMore={!loading && hasMore}
					useWindow={false}
				>
					<List
						dataSource={comments}
						loading={loading}
						renderItem={item => {
							const { account, content, create_time } = item;
							const { id: userId, avatar, nickname } = account;

							return (
								<List.Item key={item.post_id}>
									<List.Item.Meta
										avatar={
											<Link to={`/user/${userId}`}>
												<UserAvatar src={avatar} />
											</Link>
										}
										title={<Link to={`/user/${userId}`}>{nickname}</Link>}
										description={content}
									/>
									<div>{moment(create_time).fromNow()}</div>
								</List.Item>
							);
						}}
					>
						{loading && !isFirstLoad && hasMore && (
							<div className="loading-container">
								<Spin />
							</div>
						)}
					</List>
				</InfiniteScroll>
			</Modal>
		);
	}
}

export default CommentListModal;
