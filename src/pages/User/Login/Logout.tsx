import { LogoutOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import React from 'react';
import { history, request } from 'umi';


const LogoutPage: React.FC = () => {
  const handleLogout = async () => {
    try {
      const response = await request(`/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('planner_t')}`, 
        },
      });

      if (response.success) {
        message.success('Logout successful!');
        localStorage.removeItem('planner_t'); 
        history.push('/user/login'); 
      } else {
        message.error('Logout failed. Please try again.');
      }
    } catch (error) {
      message.error('An error occurred during logout. Please try again.');
    }
  };

  return (
    <div className="logout-container">
      <Button
        type="primary"
        icon={<LogoutOutlined />}
        onClick={() => Modal.confirm({
          title: 'Confirm Logout',
          content: 'Are you sure you want to log out?',
          onOk: handleLogout,
        })}
        className="logout-button"
      >
        Logout
      </Button>
    </div>
  );
};

export default LogoutPage;
