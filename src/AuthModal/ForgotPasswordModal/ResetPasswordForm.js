import React from 'react';
import '../style.scss';

import { Form, Input, Button, Icon, Alert } from 'antd';

import Api from '../../utils/Api';

class ResetPasswordForm extends React.Component {
	state = {
		loading: false,
		errorMessageText: null,
		isPasswordResetSuccessful: false
	};

	handleSubmit = e => {
		const { form, email } = this.props;

		e.preventDefault();

		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.setState({ loading: true });

				Api.resetPassword({ email, ...values }).then(response => {
					const { error, code } = response;

					if (!error) {
						this.setState({ loading: false, isPasswordResetSuccessful: true });
					} else {
						this.setState({ loading: false });
						this.handleError(code);
					}
				});
			}
		});
	};

	handleError = code => {
		switch (code) {
			case 1011:
				this.setState({
					errorMessageText: 'The verification code is invalid.'
				});
				break;
			default:
				this.setState({
					errorMessageText: 'There was an unknown error.'
				});
		}
	};

	onLoginButtonClick = () => {
		const { onLoginButtonClick } = this.props;
		onLoginButtonClick();
	};

	render() {
		const { form, email } = this.props;
		const { getFieldDecorator } = form;
		const { loading, errorMessageText, isPasswordResetSuccessful } = this.state;

		return (
			<Form onSubmit={this.handleSubmit}>
				{errorMessageText !== null && !isPasswordResetSuccessful && (
					<p>
						<Alert message={errorMessageText} type="error" />
					</p>
				)}

				{!isPasswordResetSuccessful && (
					<React.Fragment>
						<p>
							<Alert
								message={`Verification code has been sent to ${email}`}
								description="Please check your email and enter the verfication code below."
								type="success"
							/>
						</p>

						<Form.Item>
							{getFieldDecorator('verificationCode', {
								rules: [
									{
										required: true,
										message: 'Verification code cannot be empty.'
									}
								]
							})(
								<Input
									prefix={
										<Icon type="number" style={{ color: 'rgba(0,0,0,.25)' }} />
									}
									placeholder="Verification code"
									size="large"
								/>
							)}
						</Form.Item>

						<Form.Item>
							{getFieldDecorator('password', {
								rules: [
									{
										required: true,
										message: 'Password cannot be empty.'
									},
									{
										min: 8,
										message: 'Password must contain 8 characters at least.'
									}
								]
							})(
								<Input
									prefix={
										<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
									}
									placeholder="New password"
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
								Reset Password
							</Button>
						</Form.Item>
					</React.Fragment>
				)}

				{isPasswordResetSuccessful && (
					<React.Fragment>
						<p>
							<Alert
								message={'Password reset was successful!'}
								type="success"
							/>
						</p>
						<Form.Item>
							<Button
								block
								size="large"
								type="primary"
								onClick={this.onLoginButtonClick}
							>
								Login
							</Button>
						</Form.Item>
					</React.Fragment>
				)}
			</Form>
		);
	}
}

const WrappedForm = Form.create({ name: 'resetPassword' })(ResetPasswordForm);

export default WrappedForm;
