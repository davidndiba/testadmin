// src/pages/Users.tsx
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import { request } from 'umi';

const { Title } = Typography;

interface Status {
  id: string;
  name: string;
}

interface User {
  id: string;
  display_name: string;
  email: string;
  status: Status;
  roles: string[];
}

const Users: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch statuses from the API from the api 
    request('/statuses')
      .then((response) => {
        setStatuses(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch statuses:', error);
      });

    // Fetch users from the API in the profile page 
    request('/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch users:', error);
      });
  }, []);

  const columns: ProColumns<User>[] = [
    { title: 'Display Name', dataIndex: 'display_name', key: 'display_name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => status?.name || 'N/A' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setIsEditing(true);
              setSelectedUser(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (isEditing && selectedUser) {
        // Handle edit user
        request(`/api/users/${selectedUser.id}`, {
          method: 'PUT',
          data: values,
        })
          .then(() => {
            setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? { ...user, ...values } : user)));
            setIsModalVisible(false);
          })
          .catch((error) => console.error('Failed to update user:', error));
      } else {
        // Handle add new user input in the rpofile 
        request('/api/users', {
          method: 'POST',
          data: values,
        })
          .then((newUser) => {
            setUsers((prev) => [...prev, newUser]);
            setIsModalVisible(false);
          })
          .catch((error) => console.error('Failed to add user:', error));
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (userId: string) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this user?',
      onOk: () => {
        request(`/api/users/${userId}`, { method: 'DELETE' })
          .then(() => {
            setUsers((prev) => prev.filter((user) => user.id !== userId));
          })
          .catch((error) => console.error('Failed to delete user:', error));
      },
    });
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Title level={4}>Total Users</Title>
            <UserOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
          </Card>
        </Col>
      </Row>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsEditing(false);
          setSelectedUser(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
      >
        Add User
      </Button>
      <ProTable<User>
        columns={columns}
        dataSource={users}
        rowKey="id"
      />
      <Modal
        title={isEditing ? 'Edit User' : 'Add User'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="display_name" label="Display Name" rules={[{ required: true, message: 'Please enter display name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status' }]}>
            <Select>
              {statuses.map((status) => (
                <Select.Option key={status.id} value={status.id}>
                  {status.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
