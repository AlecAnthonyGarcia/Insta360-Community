import React from 'react';

import { connect } from 'react-redux';
import {
	login,
	setSignupModalVisibility,
	setForgotPasswordModalVisibility,
} from '../authActions';
import { RESPONSE_CODE_SUCCESS } from '../../utils/Constants';

import { Modal, Form, Input, Button, Icon, Alert } from 'antd';

class LoginModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.getInitialState();
	}

	getInitialState = () => {
		return {
			loading: false,
			errorMessageText: null,
		};
	};

	handleSubmit = (e) => {
		const { form, login } = this.props;

		e.preventDefault();

		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.setState({ loading: true });

				login(values).then((response) => {
					const { code } = response;

					if (RESPONSE_CODE_SUCCESS === code) {
						this.onCancel();
					} else {
						this.setState({ loading: false });
						this.handleError(code);
					}
				});
			}
		});
	};

	handleError = (code) => {
		switch (code) {
			case 1001:
				this.setState({
					errorMessageText: "The account doesn't exist.",
				});
				break;
			case 1002:
				this.setState({ errorMessageText: 'Incorrect password' });
				break;
			case 1008:
			case 1009:
				this.setState({
					errorMessageText: 'This account is already bound',
				});
				break;
			default:
				this.setState({
					errorMessageText: 'There was an unknown error.',
				});
		}
	};

	onCancel = () => {
		const { onClose } = this.props;

		this.resetModal();

		if (onClose) {
			onClose();
		}
	};

	onSignupButtonClick = () => {
		const { setSignupModalVisibility } = this.props;
		setSignupModalVisibility(true);
		this.onCancel();
	};

	onForgotPasswordButtonClick = () => {
		const { setForgotPasswordModalVisibility } = this.props;
		setForgotPasswordModalVisibility(true);
		this.onCancel();
	};

	resetModal = () => {
		const { form } = this.props;

		this.setState(this.getInitialState());

		form.setFieldsValue({ email: '', password: '' });
	};

	render() {
		const { isOpen, form } = this.props;
		const { getFieldDecorator } = form;
		const { loading } = this.state;

		return (
			<Modal
				visible={isOpen}
				title="Welcome"
				centered
				footer={null}
				onCancel={this.onCancel}
			>
				<Form onSubmit={this.handleSubmit}>
					{this.state.errorMessageText !== null && (
						<p>
							<Alert message={this.state.errorMessageText} type="error" cl />
						</p>
					)}

					<Form.Item>
						{getFieldDecorator('email', {
							rules: [
								{
									type: 'email',
									message: 'Incorrect email address format.',
								},
								{
									required: true,
									message: 'Email address cannot be empty,',
								},
							],
						})(
							<Input
								prefix={
									<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
								}
								placeholder="Email"
								size="large"
							/>
						)}
					</Form.Item>

					<Form.Item>
						{getFieldDecorator('password', {
							rules: [
								{
									required: true,
									message: 'Password cannot be empty.',
								},
								{
									min: 8,
									message: 'Password must contain 8 characters at least.',
								},
							],
						})(
							<Input
								prefix={
									<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
								}
								placeholder="Password"
								type="password"
								size="large"
							/>
						)}
					</Form.Item>

					<div className="forgot-password-button-container">
						<Button type="link" onClick={this.onForgotPasswordButtonClick}>
							Forgot your password?
						</Button>
					</div>

					<Form.Item>
						<Button
							block
							size="large"
							type="primary"
							htmlType="submit"
							loading={loading}
						>
							Login
						</Button>
					</Form.Item>

					<div className="register-new-account-button-container">
						<Button type="link" onClick={this.onSignupButtonClick}>
							Register a new account?
						</Button>
					</div>
				</Form>
			</Modal>
		);
	}
}

const WrappedForm = Form.create({ name: 'login' })(LoginModal);

export default connect(null, {
	login,
	setSignupModalVisibility,
	setForgotPasswordModalVisibility,
})(WrappedForm);
