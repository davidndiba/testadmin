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
} from 'antd';
import { UserOutlined, TeamOutlined, LoginOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
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

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [inactiveUsers, setInactiveUsers] = useState<number>(0);
  const [pendingActivation, setPendingActivation] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false); // Corrected visible state
  const [formValues, setFormValues] = useState<User | undefined>(undefined); // Corrected formValues state
  const { data: statuses } = useRequest(() => request('/statuses'));  

    // [visible, setVisible] = useState<boolean>(false), // Corrected visible state
    // [formValues, setFormValues] = useState<User | undefined>(undefined); // Corrected formValues state

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
            setPendingActivation(statistics?.user_counts_by_status?.['Pending Activation'] ?? 0); // Accessing Pending Activation
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
    // Fetch the user data if necessary
    const response = await request(`/users/${user.id}`);
    const userData = response?.data;
  
    // Set the form values
    addUserRef.current?.setFieldsValue({
      ...user,
      status: { key: user.name }, 
    });
  
    // Open the modal form
    setFormValues(user);
    setVisible(true);
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
            color: '#1890ff', // Blue color to indicate link
            textDecoration: 'none', // Remove underline
            cursor: 'pointer', // Pointer cursor on hover
          }}
          onClick={(e) => {
            e.preventDefault(); // Prevent default anchor behavior
            history.push(`/users/${record.id}`); // Use history for navigation
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
      // render: (text: any) => moment(text).format('ll'),
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
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
            <Title level={4}>Inactive Users</Title>
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
          onChange={(e) => handleSearch(e.target.value)} // Update search term and reload table
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
        onVisibleChange={setVisible} // Control modal visibility
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

            addUserRef.current?.resetFields();
            setVisible(false); // Close the modal
            tableActionRef.current?.reload(); // Refresh the table data
          } catch (error) {
            message.error('Failed to save user');
          }
        }}
        initialValues={formValues} // Set initial form values
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
              setFormValues(undefined); // Reset form values
              setVisible(true); // Show the modal for new user
            }}
          >
            Add New User
          </Button>
        }
      >
        <ProFormText
          label="Display Name"
          name="display_name"
          rules={[{ required: true }]}
        />
        <ProFormText
          label="Email"
          name="email"
          rules={[
            { required: true },
            { type: 'email', message: 'Invalid email address' },
          ]}
        />
        <ProFormText label="Phone Number" name="phone" />
        <ProFormText
          label="Username"
          name="username"
          rules={[{ required: true }]}
        />
        <ProFormSelect
          label="Status"
          name={['status', 'name']}
          options={statuses?.map((status) => ({ label: status.name, value: status.name })) || []}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          request={async () => {
            const resp = await request('/roles');
            return resp?.data ?? [];
          }}
          fieldProps={{
            fieldNames: {
              label: 'name',
              value: 'id',
            },
          }}
          label="Role"
          name="role"
          rules={[{ required: true }]}
        />
      </ModalForm>
    </div>


      <ProTable<User>
        columns={columns}
        actionRef={tableActionRef}
        rowKey="id"
        rowSelection={{ selectedRowKeys, onChange: handleRowSelection }}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          hideOnSinglePage: true,
        }}
        search={false}
        request={async (params) => {
          // Include search term as a query parameter
          const resp = await request('/users', {
            params: {
              ...params,
              search: searchTerm, // Pass search term
            },
          });

          return {
            data: resp?.data?.data,
            total: resp?.data?.total,
            success: true,
          };
        }}
        components={{
          header: {
            cell: (props) => (
              <th
                {...props}
                style={{
                  borderBottom: '2px solid #d9d9d9', // Customize the column line color
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
