import React from 'react';
import '../style.scss';

import { Form, Input, Button, Icon, Alert } from 'antd';

import Api from '../../utils/Api';

class ForgotPasswordForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.getInitialState();
	}

	getInitialState = () => {
		return {
			loading: false,
			errorMessageText: null
		};
	};

	handleSubmit = e => {
		const { form, onPasswordResetEmailSent } = this.props;

		e.preventDefault();

		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.setState({ loading: true });

				const { email } = values;

				Api.sendVerificationCode(email).then(response => {
					const { error, code } = response;

					if (!error) {
						this.setState({ loading: false });
						onPasswordResetEmailSent(email);
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
			case 1001:
				this.setState({
					errorMessageText: "The email can't be found."
				});
				break;
			default:
				this.setState({
					errorMessageText: 'There was an unknown error.'
				});
		}
	};

	onCancel = () => {
		const { onClose } = this.props;

		this.resetForm();

		if (onClose) {
			onClose();
		}
	};

	onLoginButtonClick = () => {
		const { setLoginModalVisibility } = this.props;
		setLoginModalVisibility(true);
		this.onCancel();
	};

	resetForm = () => {
		const { form } = this.props;

		this.setState(this.getInitialState());

		form.setFieldsValue({ email: '' });
	};

	render() {
		const { form } = this.props;
		const { getFieldDecorator } = form;
		const { loading, errorMessageText } = this.state;

		return (
			<Form onSubmit={this.handleSubmit}>
				{errorMessageText !== null && (
					<p>
						<Alert message={errorMessageText} type="error" />
					</p>
				)}

				<Form.Item>
					{getFieldDecorator('email', {
						rules: [
							{
								type: 'email',
								message: 'Incorrect email address format.'
							},
							{
								required: true,
								message: 'Email address cannot be empty,'
							}
						]
					})(
						<Input
							prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="Email"
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
						Send Reset Password Email
					</Button>
				</Form.Item>
			</Form>
		);
	}
}

const WrappedForm = Form.create({ name: 'forgotPassword' })(ForgotPasswordForm);

export default WrappedForm;
