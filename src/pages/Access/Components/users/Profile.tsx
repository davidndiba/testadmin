import {  Avatar,  Card, Form, Input, Row, Spin, Table, Typography, Divider,
  message,
  Tabs,
  Layout,
  DatePicker,
  Select,
  Col,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { request, useParams } from 'umi';
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Sider, Content } = Layout;

interface ProfileData {
  id: string;
  display_name: string;
  email: string;
  ip_address: string | null;
  status: string;
  last_login: string | null;
  login_count: number;
  phone: string | null;
  location: string | null;
  website: string;
  [key: string]: any;
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
}
const { RangePicker } = DatePicker;
const { Option } = Select;
const Profile: React.FC = () => {
  
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('edit-profile');
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await request(`/user/profile`);
        if (response.data) {
          const user = response.data.user;
          setProfile(user);
          setActivityLogs(response.data.activity_logs);
          form.setFieldsValue(user);
        } else {
          message.error('Failed to fetch profile');
        }
      } catch (error) {
        message.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, form]);
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const moduleData = await request('/modules');
        if (Array.isArray(moduleData)) {
          setModules(moduleData);
        } else {
          setModules([]); // Set as an empty array if the data is not as expected
        }
      } catch (error) {
        message.error('Failed to fetch modules');
        setModules([]); // Set as an empty array in case of error
      }
    };
    fetchModules();
  }, []);  
  const handleFilterChange = async () => {
    const filters = {
      module: selectedModule,
      startDate: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : null,
      endDate: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : null,
    };
    try {
      const filteredLogs = await request('/activity-logs', {
        method: 'GET',
        params: filters,
      });
      setActivityLogs(filteredLogs);
    } catch (error) {
      message.error('Failed to fetch filtered activity logs');
    }
  };
  const handleFieldChange = async (changedFields: any, allFields: any) => {
    try {
      await request(`/users/${profile?.id || 'profile'}`, {
        method: 'PUT',
        data: allFields,
      });
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  if (loading) {
    return <Spin />; 
  };
  
  const columns = [
    { title: 'Module', dataIndex: 'module', key: 'module' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Created At', dataIndex: 'updated_at', key: 'updated_at' },
  ];

  return (
    <Layout>
      <Sider
        width={200}
        style={{ backgroundColor: '#f0f2f5', padding: '16px' }}
      >
        <Title level={4}>Profile Management</Title>
        <Tabs
          defaultActiveKey="edit-profile"
          activeKey={activeTab}
          onChange={setActiveTab}
          tabPosition="left"
        >
          <TabPane tab="Edit Profile" key="edit-profile" />
          <TabPane tab="Activity Logs" key="activity-logs" />
          <TabPane tab="Change Password" key="change-password" />
        </Tabs>
      </Sider>

      <Layout style={{ padding: '24px' }}>
        <Content>
          {activeTab === 'edit-profile' && (
            <Card bordered={false}>
              <Row align="middle" justify="space-between">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: 16 }} />
                  
                  <div>
                    <Title level={2}>
                      {profile?.display_name || 'System Administrator'}
                    </Title>
                    <Text strong>Super Admin</Text>
                    <br />
                    <Text type="secondary">
                      Responsible for overseeing system-wide functions and user management.
                    </Text>
                  </div>
                </div>
                {/* <Text strong>Login Count: {profile?.login_count}</Text> */}
                <div style={{ textAlign: 'right' }}>
                  <Text type="secondary" style={{ fontWeight: 'bold', color: '#faad14' }}>Login Count</Text>
                  <Title level={5} >{profile?.login_count}</Title>
                </div>
              </Row>
              <Divider />
              <Form
                form={form}
                layout="vertical"
                onValuesChange={handleFieldChange} // Automatically update on field change
              >
                <Form.Item label="Display Name" name="display_name">
                  <Input />
                </Form.Item>
                <Form.Item label="Email" name="email">
                  <Input />
                </Form.Item>
                <Form.Item label="Username" name="username">
                  <Input />
                </Form.Item>
                <Form.Item label="Phone" name="phone">
                  <Input />
                </Form.Item>
                <Form.Item label="Timezone" name="timezone">
                  <Input />
                </Form.Item>
                <Form.Item label="Language" name="language">
                  <Input />
                </Form.Item>
              </Form>
            </Card>
          )}

          {/* {activeTab === 'activity-logs' && (
            <Card title="Activity Logs">
              <Table columns={columns} dataSource={activityLogs} rowKey="id" pagination={false} />
            </Card>
          )} */}
          {activeTab === 'activity-logs' && (
            <Card title="Activity Logs">
              <Row gutter={16}>
                <Col>
                  <RangePicker
                    onChange={(dates) => setDateRange(dates || [null, null])}
                  />
                </Col>
                <Col>
                {/* <Select
              placeholder="Filter by Module"
              onChange={(value) => setSelectedModule(value)}
               >
              {Array.isArray(modules) && modules.map((module) => (
              <Option key={module.id} value={module.id}>
              {module.name}
             </Option>
             ))}
             </Select> */}
             <Select
  placeholder="Filter by Module"
  onChange={(value) => setSelectedModule(value)}
>
  {Array.isArray(modules) && modules.map((module) => (
    <Option key={module} value={module}>
      {module} {/* Since it's a string, directly use `module` */}
    </Option>
  ))}
</Select>

                </Col>
                <Col>
                  <button onClick={handleFilterChange} className="ant-btn ant-btn-primary">
                    Apply Filters
                  </button>
                </Col>
              </Row>
              <Table columns={columns} dataSource={activityLogs} rowKey="id" pagination={false} />
            </Card>
          )}

          {activeTab === 'change-password' && (
            <Card title="Change Password">
              <Form
                layout="vertical"
                onFinish={async (values) => {
                  try {
                    await request(`/auth/reset-password`, {
                      method: 'POST',
                      data: {
                        password: values.password,
                        password_confirmation: values.password_confirmation,
                      },
                    });
                    message.success('Password changed successfully');
                  } catch (error) {
                    message.error('Failed to change password');
                  }
                }}
              >
                <Form.Item label="New Password" name="password" rules={[{ required: true }]}>
                  <Input.Password />
                </Form.Item>
                <Form.Item label="Confirm Password" name="password_confirmation" rules={[{ required: true }]}>
                  <Input.Password />
                </Form.Item>
                <Form.Item>
                  <button type="submit" className="ant-btn ant-btn-primary">
                    Change Password
                  </button>
                </Form.Item>
              </Form>
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Profile;
// import {
//   Avatar,
//   Card,
//   Form,
//   Input,
//   Row,
//   Spin,
//   Table,
//   Typography,
//   Divider,
//   message,
//   Tabs,
//   Layout,
//   DatePicker,
//   Select,
//   Col,
// } from 'antd';
// import { UserOutlined } from '@ant-design/icons';
// import React, { useEffect, useState } from 'react';
// import { request, useParams } from 'umi';
// const { Title, Text } = Typography;
// const { TabPane } = Tabs;
// const { Sider, Content } = Layout;

// interface ProfileData {
//   id: string;
//   display_name: string;
//   email: string;
//   ip_address: string | null;
//   status: string;
//   last_login: string | null;
//   login_count: number;
//   phone: string | null;
//   location: string | null;
//   website: string;
//   [key: string]: any;
// }

// interface ActivityLog {
//   id: string;
//   action: string;
//   timestamp: string;
// }
// const { RangePicker } = DatePicker;
// const { Option } = Select;
// const Profile: React.FC = () => {
  
//   const { id } = useParams<{ id: string }>();
//   const [profile, setProfile] = useState<ProfileData | null>(null);
//   const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [form] = Form.useForm();
//   const [activeTab, setActiveTab] = useState('edit-profile');
//   const [modules, setModules] = useState([]);
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [dateRange, setDateRange] = useState([null, null]);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         // Use the id if it exists, otherwise fetch the logged-in user
//         const response = await request(id ? `/users/${id}` : `/user/profile`);
//         if (response.data) {
//           const user = response.data.user || response.data.user; // Use response.data.user for /user/profile
//           setProfile(user);
//           setActivityLogs(response.data.activity_logs);
//           form.setFieldsValue(user);
//         } else {
//           message.error('Failed to fetch profile');
//         }
//       } catch (error) {
//         message.error('Failed to fetch profile');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [id, form]);
  
//   useEffect(() => {
//     const fetchModules = async () => {
//       try {
//         const moduleData = await request('/modules');
//         if (Array.isArray(moduleData)) {
//           setModules(moduleData);
//         } else {
//           setModules([]); // Set as an empty array if the data is not as expected
//         }
//       } catch (error) {
//         message.error('Failed to fetch modules');
//         setModules([]); // Set as an empty array in case of error
//       }
//     };
//     fetchModules();
//   }, []);  

//   const handleFilterChange = async () => {
//     const filters = {
//       module: selectedModule,
//       startDate: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : null,
//       endDate: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : null,
//     };
//     try {
//       const filteredLogs = await request('/activity-logs', {
//         method: 'GET',
//         params: filters,
//       });
//       setActivityLogs(filteredLogs);
//     } catch (error) {
//       message.error('Failed to fetch filtered activity logs');
//     }
//   };

//   const handleFieldChange = async (changedFields: any, allFields: any) => {
//     try {
//       await request(`/users/${profile?.id || 'profile'}`, {
//         method: 'PUT',
//         data: allFields,
//       });
//       message.success('Profile updated successfully');
//     } catch (error) {
//       message.error('Failed to update profile');
//     }
//   };

//   if (loading) {
//     return <Spin />; 
//   }
  
//   const columns = [
//     { title: 'Module', dataIndex: 'module', key: 'module' },
//     { title: 'Description', dataIndex: 'description', key: 'description' },
//     { title: 'Created At', dataIndex: 'updated_at', key: 'updated_at' },
//   ];

//   return (
//     <Layout>
//       <Sider
//         width={200}
//         style={{ backgroundColor: '#f0f2f5', padding: '16px' }}
//       >
//         <Title level={4}>Profile Management</Title>
//         <Tabs
//           defaultActiveKey="edit-profile"
//           activeKey={activeTab}
//           onChange={setActiveTab}
//           tabPosition="left"
//         >
//           <TabPane tab="Edit Profile" key="edit-profile" />
//           <TabPane tab="Activity Logs" key="activity-logs" />
//           <TabPane tab="Change Password" key="change-password" />
//         </Tabs>
//       </Sider>

//       <Layout style={{ padding: '24px' }}>
//         <Content>
//           {activeTab === 'edit-profile' && (
//             <Card bordered={false}>
//               <Row align="middle" justify="space-between">
//                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                   <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: 16 }} />
                  
//                   <div>
//                     <Title level={2}>
//                       {profile?.display_name || 'System Administrator'}
//                     </Title>
//                     <Text strong>Super Admin</Text>
//                     <br />
//                     <Text type="secondary">
//                       Responsible for overseeing system-wide functions and user management.
//                     </Text>
//                   </div>
//                 </div>
//                 <div style={{ textAlign: 'right' }}>
//                   <Text type="secondary" style={{ fontWeight: 'bold', color: '#faad14' }}>Login Count</Text>
//                   <Title level={5} >{profile?.login_count}</Title>
//                 </div>
//               </Row>
//               <Divider />
//               <Form
//                 form={form}
//                 layout="vertical"
//                 onValuesChange={handleFieldChange}
//               >
//                 <Form.Item label="Display Name" name="display_name">
//                   <Input />
//                 </Form.Item>
//                 <Form.Item label="Email" name="email">
//                   <Input />
//                 </Form.Item>
//                 <Form.Item label="Username" name="username">
//                   <Input />
//                 </Form.Item>
//                 <Form.Item label="Phone" name="phone">
//                   <Input />
//                 </Form.Item>
//                 <Form.Item label="Timezone" name="timezone">
//                   <Input />
//                 </Form.Item>
//                 <Form.Item label="Language" name="language">
//                   <Input />
//                 </Form.Item>
//               </Form>
//             </Card>
//           )}

//           {activeTab === 'activity-logs' && (
//             <Card title="Activity Logs">
//               <Row gutter={16}>
//                 <Col>
//                   <RangePicker
//                     onChange={(dates) => setDateRange(dates || [null, null])}
//                   />
//                 </Col>
//                 <Col>
//                   <Select
//                     placeholder="Filter by Module"
//                     onChange={(value) => setSelectedModule(value)}
//                   >
//                     {Array.isArray(modules) && modules.map((module) => (
//                       <Option key={module.id} value={module.id}>
//                         {module.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Col>
//                 <Col>
//                   <button onClick={handleFilterChange} className="ant-btn ant-btn-primary">
//                     Apply Filters
//                   </button>
//                 </Col>
//               </Row>
//               <Table columns={columns} dataSource={activityLogs} rowKey="id" pagination={false} />
//             </Card>
//           )}

//           {activeTab === 'change-password' && (
//             <Card title="Change Password">
//               <Form
//                 layout="vertical"
//                 onFinish={async (values) => {
//                   try {
//                     await request(`/auth/reset-password`, {
//                       method: 'POST',
//                       data: {
//                         password: values.password,
//                         password_confirmation: values.password_confirmation,
//                       },
//                     });
//                     message.success('Password changed successfully');
//                   } catch (error) {
//                     message.error('Failed to change password');
//                   }
//                 }}
//               >
//                 <Form.Item label="New Password" name="password" rules={[{ required: true }]}>
//                   <Input.Password />
//                 </Form.Item>
//                 <Form.Item label="Confirm Password" name="password_confirmation" rules={[{ required: true }]}>
//                   <Input.Password />
//                 </Form.Item>
//                 <Form.Item>
//                   <button type="submit" className="ant-btn ant-btn-primary">Change Password</button>
//                 </Form.Item>
//               </Form>
//             </Card>
//           )}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default Profile;
