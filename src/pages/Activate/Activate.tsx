import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
// import { useHistory } from 'umi';
import { history, request } from 'umi';

const AccountActivationModal = ({ visible, onClose, token }) => {
  const [loading, setLoading] = useState(false);
//   const history = useHistory();

  const handleSubmit = async (values) => {
    setLoading(true);
    const { password, password_confirmation } = values;

    try {
      const response = await request(`/auth/activate/${token}`, {
        method: 'POST',
        data: {
          password,
          password_confirmation,
        },
      });

      console.log(response); 

      if (response.success) {
        message.success('Account activated successfully. You can now log in.');
        history.push('/user/login');
      } else {
        message.error(response.message || 'Failed to activate account');
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred while activating your account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Activate Your Account"
    //   visible={visible}
    //   onCancel={onClose}
      footer={null}
    >
      <Form onFinish={handleSubmit}>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your new password!' }]}
        >
          <Input.Password placeholder="New Password" />
        </Form.Item>
        <Form.Item
          name="password_confirmation"
          rules={[
            { required: true, message: 'Please confirm your new password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Activate Account
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AccountActivationModal;
