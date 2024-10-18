import logo from '@/assets/Microvision LOgo.png';
import { GoogleOutlined } from '@ant-design/icons';
import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Divider, Image, message, Modal } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { history, request, useModel } from 'umi';
import './login.less';
const LoginPage: React.FC = () => {
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [isResetPasswordVisible, setIsResetPasswordVisible] = useState(false);
  const { setInitialState } = useModel('@@initialState');
  const handleFinish = async (values: any) => {
    const { email, password } = values;
    try {
      const response = await request(`/auth/login`, {
        method: 'POST',
        data: { login: email, password },
      });
      if (response.success) {
        message.success('Login successful!');
        localStorage.setItem('planner_t', response.token);
        const resp = await request('/user/profile', {});
        flushSync(() => {
          setInitialState((s: any) => ({
            ...s,
            currentUser: { ...resp?.data },
          }));
        });

        // TODO: Redirect based on user role
        // if (user === "ADMIN") {
        //   history.push('/dashboard');
        // }

        // if (user === "EDITOR") {
        //   history.push('/planner');
        // }

        // if (user === "USER") {
        //   history.push('/planner');
        // }

        history.push('/');
      } else {
        message.error('Login failed. Please try again.');
      }
    } catch (error) {
      message.error('An error occurred. Please try again.');
    }
  };
  const handleGoogleSignIn = () => {
    // Implement Google Sign-In logic here
  };
  // const handleForgotPassword = async (email: string) => {
  //   try {
  //     const response = await request('/auth/forgot-password', {
  //       method: 'POST',
  //       data: { email },
  //     });
  //     console.log("Forgot Password Response:", response); 

  //     if (response.status === 200) {
  //       message.success('Password reset link sent to your email!');
  //       setIsResetPasswordVisible(false); 
  //     } else {
  //       message.error(response.message || 'Failed to send password reset link.');
  //     }
  //   } catch (error: any) {
  //     console.error("Error:", error);
  //     message.error(
  //       error?.response?.data?.message || 'An error occurred. Please try again.'
  //     );
  //   }
  // };
  const handleForgotPassword = async (email: string) => {
    try {
      const response = await request('/auth/forgot-password', {
        method: 'POST',
        data: { email },
      });
      console.log("Forgot Password Response:", response);
  
      if (response.success) {
        message.success('Password reset link sent to your email!');
        
        // Ensure state updates immediately after success
        flushSync(() => {
          setIsResetPasswordVisible(false);
        });
      } else {
        message.error(response.message || 'Failed to send password reset link.');
      }
    } catch (error: any) {
      console.error("Error:", error);
      message.error(
        error?.response?.data?.message || 'An error occurred. Please try again.'
      );
    }
  };
  
  const handleSignUp = async (values: any) => {
    try {
      const response = await request('/auth/register', {
        method: 'POST',
        data: {
          email: values.email,
          display_name: values.displayName,
          username: values.username,
          password: values.password,
          password_confirmation: values.passwordConfirmation,
          timezone: 'UTC',
          role: '9cffe655-dc69-4d80-b4b3-2dde5f0cfb85',
        },
      });
      console.log("Response:", response);
      if (response.status === true) {
        message.success(response.message || 'Sign-up successful! Please log in.');
        console.log("Modal closing...");
        setIsSignUpVisible(false);
      } else if (response.errors) {
        message.error(response.errors[0]?.message || 'An error occurred. Please try again.');
      } else {
        message.error('Sign-up failed. Please try again.');
      }
    } catch (error: any) {
      console.error("Error:", error);
      if (error?.response?.data?.errors) {
        message.error(error.response.data.errors[0]?.message || 'An error occurred on the server.');
      } else {
        message.error('An error occurred. Please try again.');
      }
    }
  };  
  return (
    <div className="login-container">
      <ProCard bordered className="login-card">
        <div className="login-content">
          <div className="login-left">
            {/* <img src="/logo.png" alt="Company Logo" className="login-logo" /> */}
            <Image width={140} src={logo} />
            <h2 className="login-title">Planner Admin Dashboard</h2>
          </div>
          <div className="login-right">
            <Button
              type="primary"
              icon={<GoogleOutlined />}
              className="google-signin-button"
              onClick={handleGoogleSignIn}
            >
              Sign in with Google
            </Button>
            <Divider plain>or</Divider>
            <ProForm
              onFinish={handleFinish}
              layout="vertical"
              submitter={{
                render: () => null, // Remove default submit and reset buttons
              }}
            >
              <ProFormText
                name="email"
                label="Email"
                placeholder="Enter your email"
                rules={[{ required: true, message: 'Email is required' }]}
              />
              <ProFormText.Password
                name="password"
                label="Password"
                placeholder="Enter your password"
                rules={[{ required: true, message: 'Password is required' }]}
              />
              <ProForm.Item>
                <Button
                  type="link"
                  className="forgot-password-link"
                  onClick={() => setIsResetPasswordVisible(true)}
                >
                  Forgot Password?
                </Button>
                <Button
                  type="link"
                  className="signup-link"
                  onClick={() => setIsSignUpVisible(true)}
                >
                  Sign Up
                </Button>
              </ProForm.Item>
              <ProForm.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-button"
                >
                  Login
                </Button>
              </ProForm.Item>
            </ProForm>
          </div>
        </div>
      </ProCard>

      {/* Sign-Up Modal */}
      <Modal
        title="Sign Up"
        visible={isSignUpVisible}
        onCancel={() => setIsSignUpVisible(false)}
        footer={null}
        className="signup-modal"
      >
        <ProForm
          onFinish={handleSignUp}
          layout="vertical"
          submitter={{
            render: (props) => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}
              >
                <Button
                  type="default"
                  onClick={() => props?.reset?.()} // Reset fields on button click
                >
                  Reset
                </Button>
                <Button type="primary" htmlType="submit">
                  Sign Up
                </Button>
              </div>
            ),
          }}
        >
          <ProFormText
            name="email"
            label="Email"
            placeholder="Enter your email"
            rules={[{ required: true, message: 'Email is required' }]}
          />
          <ProFormText
            name="displayName"
            label="Display Name"
            placeholder="Enter your display name"
            rules={[{ required: true, message: 'Display Name is required' }]}
          />
          <ProFormText
            name="username"
            label="Username"
            placeholder="Enter your username"
            rules={[{ required: true, message: 'Username is required' }]}
          />
          <ProFormText.Password
            name="password"
            label="Password"
            placeholder="Enter your password"
            rules={[{ required: true, message: 'Password is required' }]}
          />
          <ProFormText.Password
            name="passwordConfirmation"
            label="Confirm Password"
            placeholder="Confirm your password"
            rules={[
              { required: true, message: 'Password confirmation is required' },
            ]}
          />
        </ProForm>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title="Forgot Password"
        visible={isResetPasswordVisible}
        onCancel={() => setIsResetPasswordVisible(false)}
        footer={null}
        className="reset-password-modal"
      >
       <ProForm
  onFinish={(values) => handleForgotPassword(values.email)}
  layout="vertical"
  submitter={{
    render: (props) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <Button type="default" onClick={() => props?.reset?.()}>
          Reset
        </Button>
        <Button type="primary" htmlType="submit">
          Send Reset Link
        </Button>
      </div>
    ),
  }}
>
  <ProFormText
    name="email"
    label="Email"
    placeholder="Enter your email"
    rules={[{ required: true, message: 'Email is required' }]}
  />
</ProForm>
      </Modal>
    </div>
  );
};

export default LoginPage;
