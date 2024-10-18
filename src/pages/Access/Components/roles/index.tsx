
  import {
    DatabaseOutlined,
    DeleteOutlined,
    EditOutlined,
    FileDoneOutlined,
    PlusOutlined,
    TeamOutlined,
    UserOutlined,
  } from '@ant-design/icons';
  import { ProColumns, ProTable } from '@ant-design/pro-components';
  import {
    Button,
    Card,
    Col,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Typography,
    Checkbox,
  } from 'antd';
  import React, { useEffect, useState } from 'react';
  import { request } from 'umi';
  
  const { Title } = Typography;
  const { Option } = Select;
  
  interface Role {
    id: string;
    name: string;
    description: string;
    is_default: boolean;
    can_be_deleted: boolean;
    is_deleted: boolean;
    permissions: string[];
    status?: string;
  }
  
  interface Permission {
    id: string;
    name: string;
  }
  
  const Roles: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [loadingPermissions, setLoadingPermissions] = useState(false);
  
    // Fetch roles
    const fetchRoles = async () => {
      try {
        const response = await request('/roles');
        console.log(response)
        setRoles(response.data.data);
      } catch (error) {
        message.error('Failed to fetch roles');
      }
    };
  
    // Fetch permissions
    const fetchPermissions = async () => {
      setLoadingPermissions(true);
      try {
        const response = await request('/permissions');
        const permissionsData = response?.data;
        const permissions = permissionsData.map((perm: any) => ({
          id: perm.id,
          name: perm.name,
        }));
        setAllPermissions(permissions);
      } catch (error) {
        message.error('Failed to fetch permissions');
      } finally {
        setLoadingPermissions(false);
      }
    };
  
    useEffect(() => {
      fetchRoles();
      fetchPermissions();
    }, []);
  
    // Handle add role
    const handleAddRole = async (values: any) => {
      try {
        const payload = {
          ...values,
          permission: values?.permissions || [],
        };
  
        await request('/roles', {
          method: 'POST',
          data: payload,
        });
        message.success('Role added successfully');
        fetchRoles();
        setIsModalVisible(false);
      } catch (error) {
        const errorMessage = error?.response?.data?.message || 'Failed to add role';
        message.error(errorMessage);
      }
    };
  
    // Handle edit role
    const handleEditRole = async (id: string, values: any) => {
      try {
        const payload = {
          ...values,
          permission: values.permissions || [],
        };
  
        await request(`/roles/${id}`, {
          method: 'PUT',
          data: payload,
        });
        message.success('Role updated successfully');
        fetchRoles();
        setIsModalVisible(false);
        setSelectedRole(null);
      } catch (error) {
        const errorMessage = error?.response?.data?.message || 'Failed to update role';
        message.error(errorMessage);
      }
    };
  
    // Handle delete role
    const handleDeleteRole = async (id: string) => {
      try {
        await request(`/roles/${id}`, {
          method: 'DELETE',
        });
        message.success('Role deleted successfully');
        fetchRoles();
      } catch (error) {
        message.error('Failed to delete role');
      }
    };
  
    // Handle view role
    const handleViewRole = async (id: string) => {
      try {
        const response = await request(`/roles/${id}`);
        setSelectedRole(response.data);
      } catch (error) {
        message.error('Failed to fetch role details');
      }
    };
  
    // Status mapping
    const statusMap: Record<string, string> = {
      active: 'Active',
      pending: 'Pending',
      archived: 'Archived',
      // Add other status mappings as necessary
    };
  
    const columns: ProColumns<Role>[] = [
      { title: 'Role', dataIndex: 'name', key: 'name' },
      { title: 'Description', dataIndex: 'description', key: 'description' },
      { title: 'Is Default', dataIndex: 'is_default', key: 'is_default', render: (text) => (text ? 'Yes' : 'No') },
      { title: 'Can Be Deleted', dataIndex: 'can_be_deleted', key: 'can_be_deleted', render: (text) => (text ? 'Yes' : 'No') },
      { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => statusMap[text] || 'Unknown' }, // Map status ID to name
      {
        title: 'Users Count',
        dataIndex: 'users_count',
        key: 'users_count',
        render: (usersCount: number) => (
          <div>{usersCount}</div>
        ),
      },
      // {
      //   title: 'Actions',
      //   key: 'actions',
      //   render: (_, record) => (
      //     <Space size="middle">
      //       <Button
      //         icon={<EditOutlined />}
      //         onClick={() => {
      //           setIsEditing(true);
      //           setSelectedRole(record);
      //           form.setFieldsValue({
      //             ...record,
      //             permissions: record.permissions.map((p: any) => ({ id: p })),
      //           });
      //           setIsModalVisible(true);
      //         }}
      //       />
      //       <Popconfirm
      //         title="Are you sure you want to delete this role?"
      //         onConfirm={() => handleDeleteRole(record.id)}
      //         okText="Yes"
      //         cancelText="No"
      //       >
      //         <Button icon={<DeleteOutlined />} />
      //       </Popconfirm>
      //     </Space>
      //   ),
      // },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space size="middle">
            <Button
              icon={<EditOutlined style={{color: '#1890ff'}} />}
              onClick={() => {
                setIsEditing(true);
                setSelectedRole(record);
                form.setFieldsValue({
                  ...record,
                  permissions: record.permissions.map((p: any) => ({ id: p })),
                });
                setIsModalVisible(true);
              }}
              type="text" // Use text button style for better alignment
            >
              <span style={{ color: '#1890ff' }}>Edit</span>
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this role?"
              onConfirm={() => handleDeleteRole(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<DeleteOutlined style={{ color:'#ff4d4f'}} />}
                type="text" 
              >
                <span style={{ color: '#ff4d4f' }}>Delete</span>
              </Button>
            </Popconfirm>
          </Space>
        ),
      }
      
    ];
  
    const stats = {
      totalRoles: roles.length,
      activeRoles: roles.filter((role) => role.status === 'active').length,
      pendingRoles: roles.filter((role) => role.status === 'pending').length,
      archivedRoles: roles.filter((role) => role.status === 'archived').length,
    };
  
    return (
      <div style={{ padding: '24px', backgroundColor: '#fff' }}>
        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={6}>
            <Card bordered style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}>
              <Title level={4}>Total Roles</Title>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {stats.totalRoles}
              </div>
              <UserOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}>
              <Title level={4}>Active Roles</Title>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {stats.activeRoles}
              </div>
              <TeamOutlined style={{ fontSize: '36px', color: '#52c41a' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }}>
              <Title level={4}>Pending Roles</Title>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {stats.pendingRoles}
              </div>
              <DatabaseOutlined style={{ fontSize: '36px', color: '#faad14' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered style={{ backgroundColor: '#fffbe6', color: '#faad14' }}>
              <Title level={4}>Archived Roles</Title>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {stats.archivedRoles}
              </div>
              <FileDoneOutlined style={{ fontSize: '36px', color: '#ff4d4f' }} />
            </Card>
          </Col>
        </Row>
  
        {/* Table */}
        <ProTable<Role>
          columns={columns}
          dataSource={roles}
          rowKey="id"
          search={false}
          loading={!roles.length}
          toolBarRender={() => [
            <Button
              key="add"
              type="primary"
              // icon={<PlusOutlined />}
              icon={<PlusOutlined />}
              style={{
                backgroundColor: '#6c5ce7',
                color: '#ffffff',
                borderColor: '#6c5ce7',
              }}
              onClick={() => {
                setIsEditing(false);
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              Add New Role
            </Button>,
          ]}
        />
  
        {/* Modal */}
        <Modal
          title={isEditing ? 'Edit Role' : 'Add Role'}
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedRole(null);
          }}
          footer={null}
        >
          <Form
            form={form}
            onFinish={(values) => {
              if (isEditing && selectedRole) {
                handleEditRole(selectedRole.id, values);
              } else {
                handleAddRole(values);
              }
            }}
            layout="vertical"
            initialValues={{ permissions: [] }}
          >
            <Form.Item
              name="name"
              label="Role Name"
              rules={[{ required: true, message: 'Please input the role name!' }]}
            >
              <Input />
            </Form.Item>
  
            <Form.Item
              name="description"
              label="Description"
              // rules={[{ required: true, message: 'Please input the role description!' }]}
            >
              <Input />
            </Form.Item>
  
            <Form.Item
              name="is_default"
              valuePropName="checked"
              label="Default Role"
            >
              <Checkbox />
            </Form.Item>
  
            <Form.Item
              name="permissions"
              label="Permissions"
              rules={[{ required: true, message: 'Please select at least one permission!' }]}
            >
              <Select
                mode="multiple"
                placeholder="Select permissions"
                loading={loadingPermissions}
              >
                {allPermissions.map((permission) => (
                  <Option key={permission.id} value={permission.id}>
                    {permission.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
  
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {isEditing ? 'Update Role' : 'Add Role'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };
  
  export default Roles;
  