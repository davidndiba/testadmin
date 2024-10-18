  import {
    ActionType,
    ModalForm,
    ProColumns,
    ProFormSelect,
    ProFormText,
    ProTable,
  } from '@ant-design/pro-components';
  import {
    Button,
    Card,
    Col,
    Divider,
    Input,
    message,
    Row,
    Space,
    Typography,
    Statistic,
    Pagination,
  } from 'antd';
  import { UserOutlined, TeamOutlined, LoginOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
  import moment from 'moment';
  import React, { useRef, useState, useEffect } from 'react';
  import { history, request, useRequest } from 'umi';
  const { Title } = Typography;

  interface User {
    id: string;
    display_name: string;
    email: string;
    ip_address: string;
    status: { name: string };
    roles: string[];
    last_login: string;
    login_count: number;
    created_at: string;
  }
  
  const Users: React.FC = () => {
    const addUserRef = useRef<any>();
    const tableActionRef = useRef<ActionType>();
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 15,
      total: 0,
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [activeUsers, setActiveUsers] = useState<number>(0);
    const [inactiveUsers, setInactiveUsers] = useState<number>(0);
    const [pendingActivation, setPendingActivation] = useState<number>(0);
    const [visible, setVisible] = useState<boolean>(false); 
    const [formValues, setFormValues] = useState<User | undefined>(undefined); 
    const { data: statuses } = useRequest(() => request('/statuses'));  
      useEffect(() => {
        const fetchStats = async () => {
          try {
            // Fetch data from the /users endpoint
            const response = await request('/users');
      
            if (response?.success) {
              const statistics = response.data?.statistics;
      
              // Set statistics using the response data
              setTotalUsers(statistics?.total_users ?? 0);
              setActiveUsers(statistics?.user_counts_by_status?.Active ?? 0);
              setInactiveUsers(
                (statistics?.user_counts_by_status?.Deactivated ?? 0) + 
                (statistics?.user_counts_by_status?.Deleted ?? 0)
              );
              setPendingActivation(statistics?.user_counts_by_status?.['Pending Activation'] ?? 0); 
            } else {
              message.error('Failed to retrieve users statistics.');
            }
          } catch (error) {
            message.error('Failed to fetch statistics');
          }
        };
      
        fetchStats();
      }, []);
      
    const handleRowSelection = (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    };

    const handleSearch = (value: string) => {
      setSearchTerm(value);
      // Trigger table reload on search
      tableActionRef.current?.reload();
    };

    const handleEdit = async (user: User) => {
      const response = await request(`/users/${user.id}`);
      const userData = response?.data;
      // Set the form values
      addUserRef.current?.setFieldsValue({
        ...user,
        status: { key: user.name }, 
        role: user.roles[0],
      });
      // Open the modal form
      setFormValues(user);
      setVisible(true);
    };
    const handleDelete = async (id: string) => {
      try {
        await request(`/users/${id}`, { method: 'DELETE' });
        message.success('User deleted successfully');
        tableActionRef.current?.reload(); 
      } catch (error) {
        message.error('Failed to delete user');
      }
    };
    const columns: ProColumns<User>[] = [
      {
        title: 'Display Name',
        dataIndex: 'display_name',
        key: 'display_name',
        render: (text, record) => (
          <a
            href={`/users/${record.id}`}
            style={{
              color: '#1890ff', 
              textDecoration: 'none', 
              cursor: 'pointer', 
            }}
            onClick={(e) => {
              e.preventDefault(); 
              history.push(`/users/${record.id}`); 
            }}
          >
            {text}
          </a>
        ),
      },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'IP Address', dataIndex: 'ip_address', key: 'ip_address' },
      {
        title: 'Status',
        dataIndex: ['status', 'name'],
        key: 'status',
      },
      {
        title: 'Role',
        dataIndex: 'roles',
        key: 'roles',
        render: (r: any) => r?.join(', '),
      },
      {
        title: 'Last Login',
        dataIndex: 'last_login',
        key: 'last_login',
        render: (text: any) => {
          return text && moment(text).isValid() ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-';
        },
      },
      { title: 'Login Count', dataIndex: 'login_count', key: 'login_count' },
      {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space size="middle">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="link"
            >
              Edit
            </Button>
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)} 
              type="link"
              danger
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ];
    return (
      <div style={{ padding: '24px', backgroundColor: '#fff' }}>
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={6}>
            <Card bordered style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}>
              <Title level={4}>Total Users</Title>
              <Statistic
                title="Total Users"
                value={totalUsers}
                prefix={<UserOutlined style={{ color: '#1890ff', fontSize: '24px' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}>
              <Title level={4}>Active Users</Title>
              <Statistic
                title="Active Users"
                value={activeUsers}
                prefix={<TeamOutlined style={{ color: '#52c41a', fontSize: '24px' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }}>
              <Title level={4}>Deactivated Users</Title>
              <Statistic
                title="Inactive Users"
                value={inactiveUsers}
                prefix={<UserOutlined style={{ color: '#fa8c16', fontSize: '24px' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered style={{ backgroundColor: '#fffbe6', color: '#faad14' }}>
              <Title level={4}>Pending Activation</Title>
              <Statistic
                title="Pending Activation"
                value={pendingActivation}
                prefix={<LoginOutlined style={{ color: '#faad14', fontSize: '24px' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Search field above the table */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col span={24}>
          <Input
            placeholder="Search Users"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)} 
            style={{ width: 200, marginBottom: '16px' }}
            allowClear
          />
        </Col>
      </Row>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '16px',
        }}
      >
        <ModalForm
  formRef={addUserRef}
  title={formValues ? 'Edit User' : 'Add New User'}
  visible={visible}
  onVisibleChange={(vis) => {
    setVisible(vis);
    if (!vis) {
      addUserRef.current?.resetFields(); 
      setFormValues(undefined); 
    }
  }}
  onFinish={async (values) => {
    try {
      if (formValues?.id) {
        // Update existing user
        await request(`/users/${formValues.id}`, {
          method: 'PUT',
          data: values,
        });
        message.success('User updated successfully');
      } else {
        // Create new user
        await request('/auth/admin/register', {
          method: 'POST',
          data: values,
        });
        message.success('User added successfully');
      }

      addUserRef.current?.resetFields(); // Reset the form after submit
      setVisible(false); // Close modal after successful save
      tableActionRef.current?.reload(); // Reload the table to reflect changes
    } catch (error) {
      message.error('Failed to save user');
    }
  }}
  initialValues={formValues} // Pre-fill form values when editing
  trigger={
    <Button
      type="primary"
      icon={<PlusOutlined />}
      style={{
        backgroundColor: '#6c5ce7',
        color: '#ffffff',
        borderColor: '#6c5ce7',
      }}
      onClick={() => {
        setFormValues(undefined); // Clear form values for adding a new user
        setVisible(true); // Open modal
      }}
    >
      Add New User
    </Button>
  }
>
  <ProFormText
    label="Display Name"
    name="display_name"
    rules={[{ required: true, message: 'Display Name is required' }]}
  />
  <ProFormText
    label="Email"
    name="email"
    rules={[
      { required: true, message: 'Email is required' },
      { type: 'email', message: 'Invalid email address' },
    ]}
  />
  <ProFormText
    label="Phone Number"
    name="phone"
    rules={[{ pattern: /^[0-9]+$/, message: 'Please enter a valid phone number' }]} // Ensure it's numeric
  />
  <ProFormText
    label="Username"
    name="username"
    rules={[{ required: true, message: 'Username is required' }]}
  />
  <ProFormSelect
    request={async () => {
      try {
        const resp = await request('/roles');
        const roles = resp?.data?.data ?? []; 
        return roles.map((role) => ({
          label: role.name,
          value: role.id,
        }));
      } catch (error) {
        message.error('Failed to load roles');
        return [];
      }
    }}
    label="Role"
    name="role"
    rules={[{ required: true, message: 'Role is required' }]}
  />
</ModalForm>
      </div>
        <ProTable<User>
          columns={columns}
          actionRef={tableActionRef}
          rowKey="id"
          rowSelection={{ selectedRowKeys, onChange: handleRowSelection }}
          search={false}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize });
              tableActionRef.current?.reload(); 
            },
          }}
          request={async (params) => {
            // Include search term as a query parameter
            const resp = await request('/users', {
              params: {
                ...params,
                search: searchTerm, 
                current:params.current,
                pageSize: params.pageSize,
              },
            });

            return {
              data: resp?.data?.data,
              total: resp?.data?.total || 0,
              success: true,
            };
          }}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    borderBottom: '2px solid #d9d9d9', 
                  }}
                />
              ),
            },
            body: {
              cell: (props) => (
                <td
                  {...props}
                  style={{
                    borderBottom: '1px solid #d9d9d9', // Customize the row line color
                  }}
                />
              ),
            },
          }}
          footer={() => (
            <Space split={<Divider type="vertical" />}>
              {statuses?.map((status: any) => (
                <Button
                  size="small"
                  key={status.id}
                  onClick={async () => {
                    selectedRowKeys?.forEach(async (id) => {
                      await request(`/users/${id}`, {
                        method: 'PUT',
                        data: { status: status.id },
                      });
                      tableActionRef?.current?.reload?.();
                      message.success(`User status updated to ${status.name}`);
                    });
                  }}
                  disabled={selectedRowKeys.length === 0}
                >
                  {status.name}
                </Button>
              ))}
            </Space>
          )}
          onRow={() => ({
          })} 
          rowSelection={{
            selectedRowKeys,
            onChange: handleRowSelection,
          }}
        />
      </div>
    );
  };

  export default Users;
