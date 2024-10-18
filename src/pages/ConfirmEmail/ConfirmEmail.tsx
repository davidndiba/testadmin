// import React, { useState } from 'react';
// import { history, useNavigate, useLocation } from 'umi';
// import { Button, Typography, message, Spin, Input, Modal } from 'antd';
// import { MailOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
// import { request } from 'umi';

// const { Title, Text } = Typography;
// const useQuery = () => {
//     return new URLSearchParams(useLocation().search);
//   };
  
// const ConfirmEmail = () => {
// //   const { token } = useParams(); // Extract token from URL params
//   const [loading, setLoading] = useState(false);
//   const query = useQuery();
//   const token = query.get('token');
//   const [resendLoading, setResendLoading] = useState(false);
//   const [email, setEmail] = useState(''); // State for email input
//   const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
//   const navigate = useNavigate();

//   // Handle email verification
//   const handleConfirmEmail = async () => {
//     setLoading(true);
//     try {
//       const response = await request(`/auth/confirm-email`, {
//         method: 'GET',
//       });
//       message.success('Email successfully confirmed!');
//       history.push('/user/login'); // Redirect to login page
//     } catch (error) {
//       message.error('Failed to confirm email. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle resend confirmation email
//   const handleResendConfirmation = async () => {
//     if (!email) {
//       message.error('Please enter an email address.');
//       return;
//     }

//     setResendLoading(true);
//     try {
//       const response = await request('/auth/resend-confirmation-email', {
//         method: 'POST',
//         data: {
//           email,
//         },
//       });
//       message.success('Confirmation email has been resent. Please check your inbox.');
//       setIsModalVisible(false); // Close modal after successful resend
//     } catch (error) {
//       message.error('Failed to resend confirmation email. Please try again.');
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   // Open modal to input email
//   const showResendModal = () => {
//     setIsModalVisible(true);
//   };

//   // Close modal
//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   return (
//     <div style={styles.container}>
//       <Spin spinning={loading || resendLoading}>
//         <div style={styles.content}>
//           <MailOutlined style={styles.icon} />
//           <Title level={3} style={styles.title}>
//             Confirm Your Email
//           </Title>
//           <Text style={styles.description}>
//             To complete the email verification process, please click the button below to confirm your email address.
//           </Text>

//           <Button
//             type="primary"
//             icon={<CheckCircleOutlined />}
//             onClick={handleConfirmEmail}
//             style={styles.confirmButton}
//             loading={loading}
//           >
//             Verify Email
//           </Button>

//           <Text style={styles.orText}>or</Text>

//           <Button
//             type="default"
//             icon={<ReloadOutlined />}
//             onClick={showResendModal} // Open modal on click
//             style={styles.resendButton}
//           >
//             Resend Confirmation Email
//           </Button>
//         </div>
//       </Spin>

//       {/* Modal for entering email */}
//       <Modal
//         title="Resend Confirmation Email"
//         visible={isModalVisible}
//         onOk={handleResendConfirmation}
//         onCancel={handleCancel}
//         confirmLoading={resendLoading}
//       >
//         <Input
//           placeholder="Enter your email address"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </Modal>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//     backgroundColor: '#f0f2f5',
//   },
//   content: {
//     textAlign: 'center' as React.CSSProperties['textAlign'], // Explicitly typing textAlign
//     padding: '40px',
//     background: '#fff',
//     borderRadius: '8px',
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//     width: '400px',
//   },
//   icon: {
//     fontSize: '48px',
//     color: '#1890ff',
//     marginBottom: '20px',
//   },
//   title: {
//     marginBottom: '16px',
//   },
//   description: {
//     marginBottom: '24px',
//     color: '#595959',
//   },
//   confirmButton: {
//     width: '100%',
//     backgroundColor: '#1890ff',
//     borderColor: '#1890ff',
//     marginBottom: '16px',
//   },
//   orText: {
//     display: 'block',
//     marginBottom: '16px',
//   },
//   resendButton: {
//     width: '100%',
//   },
// };

// export default ConfirmEmail;
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'umi';
// import { Button, Typography, message, Spin, Input, Modal } from 'antd';
// import { MailOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
// import { request } from 'umi';

// const { Title, Text } = Typography;

// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

// const ConfirmEmail = () => {
//   const query = useQuery();
//   const token = query.get('token');
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);
//   const [email, setEmail] = useState(''); 
//   const [isModalVisible, setIsModalVisible] = useState(false); 
//   const navigate = useNavigate();


// // const handleConfirmEmail = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await request(`/auth/confirm-email`, {
// //         method: 'GET',
// //         params: { token }, // Include the token in the request
// //       });
  
// //       // Assuming the API returns a message in response.data.message
// //       if (response?.data?.message) {
// //         message.success(response.data.message); // Use the message from the response
// //       } else {
// //         message.success('Email successfully confirmed!'); // Fallback message
// //       }
// //       navigate('/user/login'); // Redirect to login page after confirmation
// //     } catch (error) {
// //       // Use type assertion to handle the error properly
// //       if (error instanceof Response) {
// //         const errorData = await error.json(); // Assuming the error is a Response object
// //         message.error(errorData?.message || 'Failed to confirm email. Please try again.');
// //       } else if (error && typeof error === 'object' && 'message' in error) {
// //         // This covers if the error object has a message property
// //         message.error((error as { message?: string }).message || 'Failed to confirm email. Please try again.');
// //       } else {
// //         message.error('Failed to confirm email. Please try again.');
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// const handleConfirmEmail = async () => {
//   setLoading(true);
//   try {
//       // Directly include the token in the URL
//       const response = await request(`/auth/confirm-email?token=${token}`, {
//           method: 'GET',
//       });

//       // Assuming the API returns a message in response.data.message
//       if (response?.data?.message) {
//           message.success(response.data.message); // Use the message from the response
//       } else {
//           message.success('Email successfully confirmed!'); // Fallback message
//       }
//       navigate('/user/login'); // Redirect to login page after confirmation
//   } catch (error) {
//       // Use type assertion to handle the error properly
//       if (error instanceof Response) {
//           const errorData = await error.json(); // Assuming the error is a Response object
//           message.error(errorData?.message || 'Failed to confirm email. Please try again.');
//       } else if (error && typeof error === 'object' && 'message' in error) {
//           // This covers if the error object has a message property
//           message.error((error as { message?: string }).message || 'Failed to confirm email. Please try again.');
//       } else {
//           message.error('Failed to confirm email. Please try again.');
//       }
//   } finally {
//       setLoading(false);
//   }
// };

//   // Handle resend confirmation email
//   const handleResendConfirmation = async () => {
//     if (!email) {
//       message.error('Please enter an email address.');
//       return;
//     }

//     setResendLoading(true);
//     try {
//       const response = await request('/auth/resend-confirmation-email', {
//         method: 'POST',
//         data: { email },
//       });
//       message.success('Confirmation email has been resent. Please check your inbox.');
//       setIsModalVisible(false); // Close modal after successful resend
//     } catch (error) {
//       message.error('Failed to resend confirmation email. Please try again.');
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   // Open modal to input email
//   const showResendModal = () => {
//     setIsModalVisible(true);
//   };

//   // Close modal
//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   return (
//     <div style={styles.container}>
//       <Spin spinning={loading || resendLoading}>
//         <div style={styles.content}>
//           <MailOutlined style={styles.icon} />
//           <Title level={3} style={styles.title}>
//             Confirm Your Email
//           </Title>
//           <Text style={styles.description}>
//             To complete the email verification process, please click the button below to confirm your email address.
//           </Text>

//           <Button
//             type="primary"
//             icon={<CheckCircleOutlined />}
//             onClick={handleConfirmEmail}
//             style={styles.confirmButton}
//             loading={loading}
//           >
//             Verify Email
//           </Button>

//           <Text style={styles.orText}>or</Text>

//           <Button
//             type="default"
//             icon={<ReloadOutlined />}
//             onClick={showResendModal}
//             style={styles.resendButton}
//           >
//             Resend Confirmation Email
//           </Button>
//         </div>
//       </Spin>

//       {/* Modal for entering email */}
//       <Modal
//         title="Resend Confirmation Email"
//         visible={isModalVisible}
//         onOk={handleResendConfirmation}
//         onCancel={handleCancel}
//         confirmLoading={resendLoading}
//       >
//         <Input
//           placeholder="Enter your email address"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </Modal>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//     backgroundColor: '#f0f2f5',
//   },
//   content: {
//     textAlign: 'center' as React.CSSProperties['textAlign'],
//     padding: '40px',
//     background: '#fff',
//     borderRadius: '8px',
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//     width: '400px',
//   },
//   icon: {
//     fontSize: '48px',
//     color: '#1890ff',
//     marginBottom: '20px',
//   },
//   title: {
//     marginBottom: '16px',
//   },
//   description: {
//     marginBottom: '24px',
//     color: '#595959',
//   },
//   confirmButton: {
//     width: '100%',
//     backgroundColor: '#1890ff',
//     borderColor: '#1890ff',
//     marginBottom: '16px',
//   },
//   orText: {
//     display: 'block',
//     marginBottom: '16px',
//   },
//   resendButton: {
//     width: '100%',
//   },
// };

// export default ConfirmEmail;
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'umi';
// import { Button, Typography, message, Spin, Input, Modal } from 'antd';
// import { MailOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
// import { request } from 'umi';

// const { Title, Text } = Typography;

// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

// const ConfirmEmail = () => {
//   const query = useQuery();
//   const token = query.get('token');
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);
//   const [email, setEmail] = useState(''); 
//   const [isModalVisible, setIsModalVisible] = useState(false); 
//   const navigate = useNavigate();


// const handleConfirmEmail = async () => {
//     setLoading(true);
//     try {
//       const response = await request(`/auth/confirm-email`, {
//         method: 'GET',
//         params: { token }, // Include the token in the request
//       });
  
//       // Assuming the API returns a message in response.data.message
//       if (response?.data?.message) {
//         message.success(response.data.message); // Use the message from the response
//       } else {
//         message.success('Email successfully confirmed!'); // Fallback message
//       }
//       navigate('/user/login'); // Redirect to login page after confirmation
//     } catch (error) {
//       // Use type assertion to handle the error properly
//       if (error instanceof Response) {
//         const errorData = await error.json(); // Assuming the error is a Response object
//         message.error(errorData?.message || 'Failed to confirm email. Please try again.');
//       } else if (error && typeof error === 'object' && 'message' in error) {
//         // This covers if the error object has a message property
//         message.error((error as { message?: string }).message || 'Failed to confirm email. Please try again.');
//       } else {
//         message.error('Failed to confirm email. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Handle resend confirmation email
//   const handleResendConfirmation = async () => {
//     if (!email) {
//       message.error('Please enter an email address.');
//       return;
//     }

//     setResendLoading(true);
//     try {
//       const response = await request('/auth/resend-confirmation-email', {
//         method: 'POST',
//         data: { email },
//       });
//       message.success('Confirmation email has been resent. Please check your inbox.');
//       setIsModalVisible(false); // Close modal after successful resend
//     } catch (error) {
//       message.error('Failed to resend confirmation email. Please try again.');
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   // Open modal to input email
//   const showResendModal = () => {
//     setIsModalVisible(true);
//   };

//   // Close modal
//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   return (
//     <div style={styles.container}>
//       <Spin spinning={loading || resendLoading}>
//         <div style={styles.content}>
//           <MailOutlined style={styles.icon} />
//           <Title level={3} style={styles.title}>
//             Confirm Your Email
//           </Title>
//           <Text style={styles.description}>
//             To complete the email verification process, please click the button below to confirm your email address.
//           </Text>

//           <Button
//             type="primary"
//             icon={<CheckCircleOutlined />}
//             onClick={handleConfirmEmail}
//             style={styles.confirmButton}
//             loading={loading}
//           >
//             Verify Email
//           </Button>

//           <Text style={styles.orText}>or</Text>

//           <Button
//             type="default"
//             icon={<ReloadOutlined />}
//             onClick={showResendModal}
//             style={styles.resendButton}
//           >
//             Resend Confirmation Email
//           </Button>
//         </div>
//       </Spin>

//       {/* Modal for entering email */}
//       <Modal
//         title="Resend Confirmation Email"
//         visible={isModalVisible}
//         onOk={handleResendConfirmation}
//         onCancel={handleCancel}
//         confirmLoading={resendLoading}
//       >
//         <Input
//           placeholder="Enter your email address"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </Modal>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//     backgroundColor: '#f0f2f5',
//   },
//   content: {
//     textAlign: 'center' as React.CSSProperties['textAlign'],
//     padding: '40px',
//     background: '#fff',
//     borderRadius: '8px',
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//     width: '400px',
//   },
//   icon: {
//     fontSize: '48px',
//     color: '#1890ff',
//     marginBottom: '20px',
//   },
//   title: {
//     marginBottom: '16px',
//   },
//   description: {
//     marginBottom: '24px',
//     color: '#595959',
//   },
//   confirmButton: {
//     width: '100%',
//     backgroundColor: '#1890ff',
//     borderColor: '#1890ff',
//     marginBottom: '16px',
//   },
//   orText: {
//     display: 'block',
//     marginBottom: '16px',
//   },
//   resendButton: {
//     width: '100%',
//   },
// };

// export default ConfirmEmail;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'umi';
import { Button, Typography, message, Spin, Input, Modal } from 'antd';
import { MailOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { request } from 'umi';

const { Title, Text } = Typography;

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ConfirmEmail = () => {
  const query = useQuery();
  const token = query.get('token'); // Get the token from the query parameters
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  // Check if the token is valid
  useEffect(() => {
    if (!token) {
      message.error('Invalid token. Please try again.');
      navigate('/user/login'); // Redirect if token is missing
    }
  }, [token, navigate]);

  const handleConfirmEmail = async () => {
    setLoading(true);
    try {
      const response = await request(`/auth/confirm-email`, {
        method: 'GET',
        params: { token }, // Include the token in the request as a query parameter
      });

      if (response?.data?.message) {
        message.success(response.data.message); // Use the message from the response
      } else {
        message.success('Email successfully confirmed!'); // Fallback message
      }
      navigate('/user/login'); // Redirect to login page after confirmation
    } catch (error) {
      // Handle the error properly
      const errorMessage = error?.response?.data?.message || 'Failed to confirm email. Please try again.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      message.error('Please enter an email address.');
      return;
    }

    setResendLoading(true);
    try {
      const response = await request('/auth/resend-confirmation-email', {
        method: 'POST',
        data: { email },
      });
      message.success('Confirmation email has been resent. Please check your inbox.');
      setIsModalVisible(false); // Close modal after successful resend
    } catch (error) {
      message.error('Failed to resend confirmation email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const showResendModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={styles.container}>
      <Spin spinning={loading || resendLoading}>
        <div style={styles.content}>
          <MailOutlined style={styles.icon} />
          <Title level={3} style={styles.title}>
            Confirm Your Email
          </Title>
          <Text style={styles.description}>
            To complete the email verification process, please click the button below to confirm your email address.
          </Text>

          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleConfirmEmail}
            style={styles.confirmButton}
            loading={loading}
          >
            Verify Email
          </Button>

          <Text style={styles.orText}>or</Text>

          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={showResendModal}
            style={styles.resendButton}
          >
            Resend Confirmation Email
          </Button>
        </div>
      </Spin>

      {/* Modal for entering email */}
      <Modal
        title="Resend Confirmation Email"
        visible={isModalVisible}
        onOk={handleResendConfirmation}
        onCancel={handleCancel}
        confirmLoading={resendLoading}
      >
        <Input
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  content: {
    textAlign: 'center' as React.CSSProperties['textAlign'],
    padding: '40px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '400px',
  },
  icon: {
    fontSize: '48px',
    color: '#1890ff',
    marginBottom: '20px',
  },
  title: {
    marginBottom: '16px',
  },
  description: {
    marginBottom: '24px',
    color: '#595959',
  },
  confirmButton: {
    width: '100%',
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
    marginBottom: '16px',
  },
  orText: {
    display: 'block',
    marginBottom: '16px',
  },
  resendButton: {
    width: '100%',
  },
};

export default ConfirmEmail;
