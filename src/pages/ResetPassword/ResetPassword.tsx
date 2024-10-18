// import React, { useState } from 'react';
// import { useLocation, history } from 'umi';
// import { Form, Input, Button, message } from 'antd';
// import { request } from 'umi';

// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

// const ResetPassword: React.FC = () => {
//   const query = useQuery();
//   const token = query.get('token');
//   const email = query.get('email');
//   const [loading, setLoading] = useState(false);

//   const handlePasswordReset = async (values: { password: string; password_confirmation: string }) => {
//     setLoading(true);
//     try {
//       const response = await request(`/reset-password`, {
//         method: 'POST',
//         data: {
//           email, 
//           token, 
//           password: values.password,
//           password_confirmation: values.password_confirmation, 
//         },
//       });

//       message.success('Password reset successful!');
//       history.push('/user/login');
//     } catch (error: any) {
//       if (error && error.response) {
//         const backendMessage = error.response.data?.message || 'Failed to reset password.';
//         message.error(backendMessage);
//       } else {
//         message.error('An unknown error occurred.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Reset Your Password</h2>
//       <Form onFinish={handlePasswordReset}>
//         <Form.Item
//           name="password"
//           label="New Password"
//           rules={[{ required: true, message: 'Please input your new password!' }]}
//         >
//           <Input.Password />
//         </Form.Item>
//         <Form.Item
//           name="password_confirmation"
//           label="Confirm Password"
//           rules={[{ required: true, message: 'Please confirm your new password!' }]}
//         >
//           <Input.Password />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" loading={loading}>
//             Reset Password
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default ResetPassword;
// import React, { useState } from 'react';
// import { useLocation, history } from 'umi';
// import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
// import { Button, message } from 'antd';
// import { request } from 'umi';
// import './ResetPassword.less'; // Ensure this CSS file is included

// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

// const ResetPassword: React.FC = () => {
//   const query = useQuery();
//   const token = query.get('token');
//   const email = query.get('email');
//   const [loading, setLoading] = useState(false);

//   const handlePasswordReset = async (values: { password: string; password_confirmation: string }) => {
//     setLoading(true);
//     try {
//       await request(`/reset-password`, {
//         method: 'POST',
//         data: {
//           email,
//           token,
//           password: values.password,
//           password_confirmation: values.password_confirmation,
//         },
//       });

//       message.success('Password reset successful!');
//       history.push('/user/login');
//     } catch (error: any) {
//       const backendMessage = error?.response?.data?.message || 'Failed to reset password.';
//       message.error(backendMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="reset-password-container"> {/* Custom styling */}
//       <ProCard title="Reset Your Password" bordered style={{ width: 400 }}>
//         <ProForm onFinish={handlePasswordReset}>
//           <ProFormText.Password
//             name="password"
//             label="New Password"
//             rules={[{ required: true, message: 'Please input your new password!' }]}
//           />
//           <ProFormText.Password
//             name="password_confirmation"
//             label="Confirm Password"
//             rules={[{ required: true, message: 'Please confirm your new password!' }]}
//           />
//           <ProForm.Item>
//             <Button type="primary" htmlType="submit" loading={loading}>
//               Reset Password
//             </Button>
//           </ProForm.Item>
//         </ProForm>
//       </ProCard>
//     </div>
//   );
// };

// export default ResetPassword;
import React, { useState } from 'react';
import { useLocation, history } from 'umi';
import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { request } from 'umi';
import './ResetPassword.less';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ResetPassword: React.FC = () => {
  const query = useQuery();
  const token = query.get('token');
  const email = query.get('email');
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<{ password: string; password_confirmation: string }>({
    password: '',
    password_confirmation: '',
  });

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      await request(`/auth/reset-password`, {
        method: 'POST',
        data: {
          email,
          token,
          password: formValues.password,
          password_confirmation: formValues.password_confirmation,
        },
      });

      message.success('Password reset successful!');
      history.push('/user/login');
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || 'Failed to reset password.';
      message.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container"> 
      <ProCard title="Reset Your Password" bordered style={{ width: 400 }}>
        <ProForm
          onFinish={() => {}}
          onValuesChange={(changedValues) => {
            setFormValues((prevValues) => ({ ...prevValues, ...changedValues }));
          }}
        >
          <ProFormText.Password
            name="password"
            label="New Password"
            rules={[{ required: true, message: 'Please input your new password!' }]}
          />
          <ProFormText.Password
            name="password_confirmation"
            label="Confirm Password"
            rules={[{ required: true, message: 'Please confirm your new password!' }]}
          />
        </ProForm>
        <Button 
          type="primary" 
          onClick={handlePasswordReset} 
          loading={loading} 
          style={{ marginTop: '16px' }}
        >
          Reset Password
        </Button>
      </ProCard>
    </div>
  );
};

export default ResetPassword;
