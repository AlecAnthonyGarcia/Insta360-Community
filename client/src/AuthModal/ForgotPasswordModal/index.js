import React from 'react';
import '../style.scss';

import { connect } from 'react-redux';
import { signup, setLoginModalVisibility } from '../authActions';

import { Modal, Form } from 'antd';

import ForgotPasswordForm from './ForgotPasswordForm.js';
import ResetPasswordForm from './ResetPasswordForm.js';

class ForgotPasswordModal extends React.Component {
	state = {
		currentFormComponent: null,
		modalTitle: '',
	};

	componentDidUpdate(prevProps) {
		const { isOpen } = this.props;

		if (prevProps.isOpen !== isOpen) {
			if (isOpen) {
				this.setForgotPasswordForm();
			} else {
				this.setCurrentComponent(null);
			}
		}
	}

	onCancel = () => {
		const { onClose } = this.props;

		if (onClose) {
			onClose();
		}
	};

	setForgotPasswordForm() {
		const onPasswordResetEmailSent = (email) => {
			this.setResetPasswordForm(email);
		};

		const forgotPasswordForm = (
			<ForgotPasswordForm onPasswordResetEmailSent={onPasswordResetEmailSent} />
		);

		this.setCurrentComponent(forgotPasswordForm, 'Forgot Password');
	}

	setResetPasswordForm(email) {
		const onLoginButtonClick = () => {
			const { setLoginModalVisibility } = this.props;

			setLoginModalVisibility(true);

			this.onCancel();
		};

		const resetPasswordForm = (
			<ResetPasswordForm
				onLoginButtonClick={onLoginButtonClick}
				email={email}
			/>
		);

		this.setCurrentComponent(resetPasswordForm, 'Reset Password');
	}

	setCurrentComponent(currentFormComponent, modalTitle) {
		this.setState({ currentFormComponent, modalTitle });
	}

	render() {
		const { isOpen } = this.props;
		const { currentFormComponent, modalTitle } = this.state;

		return (
			<Modal
				visible={isOpen}
				title={modalTitle}
				centered
				footer={null}
				onCancel={this.onCancel}
			>
				{currentFormComponent}
			</Modal>
		);
	}
}

const WrappedForm = Form.create({ name: 'forgotPassword' })(
	ForgotPasswordModal
);

export default connect(null, { signup, setLoginModalVisibility })(WrappedForm);
