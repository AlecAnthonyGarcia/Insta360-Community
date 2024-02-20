import React from 'react';
import '../style.scss';

import { connect } from 'react-redux';
import { signup, setLoginModalVisibility } from '../authActions';

import { Modal, Form, Input, Button, Icon, Alert } from 'antd';

class SignupModal extends React.Component {
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
		const { form, signup } = this.props;

		e.preventDefault();

		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.setState({ loading: true });

				signup(values).then((response) => {
					const { error, code } = response;

					if (!error) {
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
			case 1000:
				this.setState({
					errorMessageText: 'The email was used.',
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

	onLoginButtonClick = () => {
		const { setLoginModalVisibility } = this.props;
		setLoginModalVisibility(true);
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
				title="Signup"
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

					<Form.Item>
						<Button
							block
							size="large"
							type="primary"
							htmlType="submit"
							loading={loading}
						>
							Signup now
						</Button>
					</Form.Item>

					<div className="login-now-button-container">
						Already have an account?
						<Button type="link" onClick={this.onLoginButtonClick}>
							Log in now
						</Button>
					</div>
				</Form>
			</Modal>
		);
	}
}

const WrappedForm = Form.create({ name: 'signup' })(SignupModal);

export default connect(null, { signup, setLoginModalVisibility })(WrappedForm);
