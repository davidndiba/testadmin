"use strict";
// import React, { useState, useEffect } from 'react';
// import { ProTable, ProColumns } from '@ant-design/pro-components';
// import { Button, Space, Modal, Form, Input, message, Popconfirm, Card, Col, Row, Typography } from 'antd';
// import { request } from 'umi';
// import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined, TeamOutlined, DatabaseOutlined, FileDoneOutlined } from '@ant-design/icons';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// const { Title } = Typography;
// interface Role {
//   id: string;
//   role: string;
//   description: string;
// }
// const Roles: React.FC = () => {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [form] = Form.useForm();
//   // Fetch roles
//   const fetchRoles = async () => {
//     try {
//       const response = await request(`/roles`);
//       setRoles(response.data);
//     } catch (error) {
//       message.error('Failed to fetch roles');
//     }
//   };
//   useEffect(() => {
//     fetchRoles();
//   }, []);
//   // Handle add role
//   const handleAddRole = async (values: any) => {
//     try {
//       await request(`/roles`, {
//         method: 'POST',
//         data: values,
//       });
//       message.success('Role added successfully');
//       fetchRoles();
//       setIsModalVisible(false);
//     } catch (error) {
//       message.error('Failed to add role');
//     }
//   };
//   // Handle edit role
//   const handleEditRole = async (id: string, values: any) => {
//     try {
//       await request(`/roles/${id}`, {
//         method: 'PUT',
//         data: values,
//       });
//       message.success('Role updated successfully');
//       fetchRoles();
//       setSelectedRole(null);
//     } catch (error) {
//       message.error('Failed to update role');
//     }
//   };
//   // Handle delete role
//   const handleDeleteRole = async (id: string) => {
//     try {
//       await request(`/roles/${id}`, {
//         method: 'DELETE',
//       });
//       message.success('Role deleted successfully');
//       fetchRoles();
//     } catch (error) {
//       message.error('Failed to delete role');
//     }
//   };
//   // Handle view role
//   const handleViewRole = async (id: string) => {
//     try {
//       const response = await request(`/roles/${id}`);
//       setSelectedRole(response.data);
//     } catch (error) {
//       message.error('Failed to fetch role details');
//     }
//   };
//   const columns: ProColumns<Role>[] = [
//     { title: 'Role', dataIndex: 'name', key: 'name' },
//     { title: 'Description', dataIndex: 'description', key: 'description' },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => {
//               setIsEditing(true);
//               setSelectedRole(record);
//               form.setFieldsValue(record);
//               setIsModalVisible(true);
//             }}
//           />
//           <Popconfirm
//             title="Are you sure you want to delete this role?"
//             onConfirm={() => handleDeleteRole(record.id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];
//   // Mock data for statistics
//   const stats = {
//     totalRoles: roles.length,
//     activeRoles: roles.filter(role => role.status === 'active').length,
//     pendingRoles: roles.filter(role => role.status === 'pending').length,
//     archivedRoles: roles.filter(role => role.status === 'archived').length,
//   };
//   return (
//     <div style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
//       {/* Statistics Cards */}
//       <Row gutter={16} style={{ marginBottom: '16px' }}>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Total Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalRoles}</div>
//             <UserOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Active Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.activeRoles}</div>
//             <TeamOutlined style={{ fontSize: '36px', color: '#52c41a' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Pending Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.pendingRoles}</div>
//             <DatabaseOutlined style={{ fontSize: '36px', color: '#faad14' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Archived Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.archivedRoles}</div>
//             <FileDoneOutlined style={{ fontSize: '36px', color: '#ff4d4f' }} />
//           </Card>
//         </Col>
//       </Row>
//       {/* Roles Table */}
//       <Button
//         type="primary"
//         icon={<PlusOutlined />}
//         onClick={() => {
//           setIsEditing(false);
//           setSelectedRole(null);
//           form.resetFields();
//           setIsModalVisible(true);
//         }}
//         style={{ marginBottom: '16px' }}
//       >
//         Add Role
//       </Button>
//       <ProTable<Role>
//         columns={columns}
//         dataSource={roles}
//         rowKey="id"
//         onRow={(record) => ({
//           onClick: () => handleViewRole(record.id),
//         })}
//       />
//       {selectedRole && (
//         <div style={{ marginTop: 16 }}>
//           <h2>Selected Role</h2>
//           <p><strong>Role:</strong> {selectedRole.role}</p>
//           <p><strong>Description:</strong> {selectedRole.description}</p>
//         </div>
//       )}
//       <Modal
//         title={isEditing ? 'Edit Role' : 'Add Role'}
//         visible={isModalVisible}
//         onOk={() => {
//           form
//             .validateFields()
//             .then(values => {
//               if (isEditing) {
//                 handleEditRole(selectedRole!.id, values);
//               } else {
//                 handleAddRole(values);
//               }
//             })
//             .catch(info => {
//               console.log('Validate Failed:', info);
//             });
//         }}
//         onCancel={() => {
//           setIsModalVisible(false);
//           form.resetFields();
//         }}
//         destroyOnClose
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="role"
//             label="Role"
//             rules={[{ required: true, message: 'Please enter the role!' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[{ required: true, message: 'Please enter the description!' }]}
//           >
//             <Input />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };
// export default Roles;
// import {
//   DatabaseOutlined,
//   DeleteOutlined,
//   EditOutlined,
//   FileDoneOutlined,
//   PlusOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from '@ant-design/icons';
// import { ProColumns, ProTable } from '@ant-design/pro-components';
// import {
//   Button,
//   Card,
//   Col,
//   Form,
//   Input,
//   message,
//   Modal,
//   Popconfirm,
//   Row,
//   Space,
//   Typography,
// } from 'antd';
// import React, { useEffect, useState } from 'react';
// import { request } from 'umi';
// const { Title } = Typography;
// interface Role {
//   id: string;
//   role: string;
//   description: string;
//   status: string; // Assuming status is a part of the Role interface
// }
// const Roles: React.FC = () => {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [form] = Form.useForm();
//   // Fetch roles
//   const fetchRoles = async () => {
//     try {
//       const response = await request('/roles');
//       setRoles(response.data); // Update state with new roles data
//     } catch (error) {
//       message.error('Failed to fetch roles');
//     }
//   };
//   useEffect(() => {
//     fetchRoles();
//   }, []);
//   // Handle add role
//   const handleAddRole = async (values: any) => {
//     try {
//       await request('/roles', {
//         method: 'POST',
//         data: values,
//       });
//       message.success('Role added successfully');
//       fetchRoles(); // Refresh roles list
//       setIsModalVisible(false); // Close modal
//     } catch (error) {
//       message.error('Failed to add role');
//     }
//   };
//   // Handle edit role
//   const handleEditRole = async (id: string, values: any) => {
//     try {
//       await request(`/roles/${id}`, {
//         method: 'PUT',
//         data: values,
//       });
//       message.success('Role updated successfully');
//       fetchRoles(); // Refresh roles list
//       setIsModalVisible(false); // Close modal
//       setSelectedRole(null); // Clear selected role
//     } catch (error) {
//       message.error('Failed to update role');
//     }
//   };
//   // Handle delete role
//   const handleDeleteRole = async (id: string) => {
//     try {
//       await request(`/roles/${id}`, {
//         method: 'DELETE',
//       });
//       message.success('Role deleted successfully');
//       fetchRoles(); // Refresh roles list
//     } catch (error) {
//       message.error('Failed to delete role');
//     }
//   };
//   // Handle view role
//   const handleViewRole = async (id: string) => {
//     try {
//       const response = await request(`/roles/${id}`);
//       setSelectedRole(response.data);
//     } catch (error) {
//       message.error('Failed to fetch role details');
//     }
//   };
//   const columns: ProColumns<Role>[] = [
//     { title: 'Role', dataIndex: 'name', key: 'name' },
//     { title: 'Description', dataIndex: 'description', key: 'description' },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => {
//               setIsEditing(true);
//               setSelectedRole(record);
//               form.setFieldsValue(record);
//               setIsModalVisible(true);
//             }}
//           />
//           <Popconfirm
//             title="Are you sure you want to delete this role?"
//             onConfirm={() => handleDeleteRole(record.id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];
//   // Mock data for statistics
//   const stats = {
//     totalRoles: roles.length,
//     activeRoles: roles.filter((role) => role.status === 'active').length,
//     pendingRoles: roles.filter((role) => role.status === 'pending').length,
//     archivedRoles: roles.filter((role) => role.status === 'archived').length,
//   };
//   return (
//     <div style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
//       {/* Statistics Cards */}
//       <Row gutter={16} style={{ marginBottom: '16px' }}>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Total Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.totalRoles}
//             </div>
//             <UserOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Active Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.activeRoles}
//             </div>
//             <TeamOutlined style={{ fontSize: '36px', color: '#52c41a' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Pending Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.pendingRoles}
//             </div>
//             <DatabaseOutlined style={{ fontSize: '36px', color: '#faad14' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Archived Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.archivedRoles}
//             </div>
//             <FileDoneOutlined style={{ fontSize: '36px', color: '#ff4d4f' }} />
//           </Card>
//         </Col>
//       </Row>
//       {/* Roles Table */}
//       <Button
//         type="primary"
//         icon={<PlusOutlined />}
//         onClick={() => {
//           setIsEditing(false);
//           setSelectedRole(null);
//           form.resetFields();
//           setIsModalVisible(true);
//         }}
//         style={{ marginBottom: '16px' }}
//       >
//         Add Role
//       </Button>
//       <ProTable<Role>
//         columns={columns}
//         dataSource={roles}
//         rowKey="id"
//         onRow={(record) => ({
//           onClick: () => handleViewRole(record.id),
//         })}
//       />
//       {selectedRole && (
//         <div style={{ marginTop: 16 }}>
//           <h2>Selected Role</h2>
//           <p>
//             <strong>Role:</strong> {selectedRole?.name}
//           </p>
//           <p>
//             <strong>Description:</strong> {selectedRole?.description}
//           </p>
//         </div>
//       )}
//       <Modal
//         title={isEditing ? 'Edit Role' : 'Add Role'}
//         visible={isModalVisible}
//         onOk={() => {
//           form
//             .validateFields()
//             .then((values) => {
//               if (isEditing && selectedRole) {
//                 handleEditRole(selectedRole.id, values);
//               } else {
//                 handleAddRole(values);
//               }
//             })
//             .catch((info) => {
//               console.log('Validate Failed:', info);
//             });
//         }}
//         onCancel={() => {
//           setIsModalVisible(false);
//           form.resetFields();
//         }}
//         destroyOnClose
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="role"
//             label="Role"
//             rules={[{ required: true, message: 'Please enter the role!' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[
//               { required: true, message: 'Please enter the description!' },
//             ]}
//           >
//             <Input />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };
// export default Roles;
// import {
//   DatabaseOutlined,
//   DeleteOutlined,
//   EditOutlined,
//   FileDoneOutlined,
//   PlusOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from '@ant-design/icons';
// import { ProColumns, ProTable } from '@ant-design/pro-components';
// import {
//   Button,
//   Card,
//   Col,
//   Form,
//   Input,
//   message,
//   Modal,
//   Popconfirm,
//   Row,
//   Space,
//   Typography,
// } from 'antd';
// import React, { useEffect, useState } from 'react';
// import { request } from 'umi';
// const { Title } = Typography;
// interface Role {
//   id: string;
//   name: string;
//   description: string;
//   is_default: boolean;
//   can_be_deleted: boolean;
//   permissions: string[];
//   status?: string; // Optional field for status
// }
// const Roles: React.FC = () => {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [form] = Form.useForm();
//   // Fetch roles
//   const fetchRoles = async () => {
//     try {
//       const response = await request('/roles');
//       setRoles(response.data); // Update state with new roles data
//     } catch (error) {
//       message.error('Failed to fetch roles');
//     }
//   };
//   useEffect(() => {
//     fetchRoles();
//   }, []);
//   // Handle add role
//   const handleAddRole = async (values: any) => {
//     try {
//       // Ensure permissions is an array of strings
//       values.permissions = values.permissions.split(',').map((p: string) => p.trim());
//       await request('/roles', {
//         method: 'POST',
//         data: values,
//       });
//       message.success('Role added successfully');
//       fetchRoles(); // Refresh roles list
//       setIsModalVisible(false); // Close modal
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || 'Failed to add role';
//       message.error(errorMessage);
//     }
//   };
//   // Handle edit role
//   const handleEditRole = async (id: string, values: any) => {
//     try {
//       // Ensure permissions is an array of strings
//       values.permissions = values.permissions.split(',').map((p: string) => p.trim());
//       await request(`/roles/${id}`, {
//         method: 'PUT',
//         data: values,
//       });
//       message.success('Role updated successfully');
//       fetchRoles(); // Refresh roles list
//       setIsModalVisible(false); // Close modal
//       setSelectedRole(null); // Clear selected role
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || 'Failed to update role';
//       message.error(errorMessage);
//     }
//   };
//   // Handle delete role
//   const handleDeleteRole = async (id: string) => {
//     try {
//       await request(`/roles/${id}`, {
//         method: 'DELETE',
//       });
//       message.success('Role deleted successfully');
//       fetchRoles(); // Refresh roles list
//     } catch (error) {
//       message.error('Failed to delete role');
//     }
//   };
//   // Handle view role
//   const handleViewRole = async (id: string) => {
//     try {
//       const response = await request(`/roles/${id}`);
//       setSelectedRole(response.data);
//     } catch (error) {
//       message.error('Failed to fetch role details');
//     }
//   };
//   const columns: ProColumns<Role>[] = [
//     { title: 'Role', dataIndex: 'name', key: 'name' },
//     { title: 'Description', dataIndex: 'description', key: 'description' },
//     { title: 'Is Default', dataIndex: 'is_default', key: 'is_default', render: (text) => (text ? 'Yes' : 'No') },
//     { title: 'Can Be Deleted', dataIndex: 'can_be_deleted', key: 'can_be_deleted', render: (text) => (text ? 'Yes' : 'No') },
//     { title: 'Permissions', dataIndex: 'permissions', key: 'permissions', render: (text) => text.join(', ') },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => {
//               setIsEditing(true);
//               setSelectedRole(record);
//               form.setFieldsValue({
//                 ...record,
//                 permissions: record.permissions.join(', '), // Convert array to comma-separated string
//               });
//               setIsModalVisible(true);
//             }}
//           />
//           <Popconfirm
//             title="Are you sure you want to delete this role?"
//             onConfirm={() => handleDeleteRole(record.id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];
//   // Mock data for statistics
//   const stats = {
//     totalRoles: roles.length,
//     activeRoles: roles.filter((role) => role.status === 'active').length,
//     pendingRoles: roles.filter((role) => role.status === 'pending').length,
//     archivedRoles: roles.filter((role) => role.status === 'archived').length,
//   };
//   return (
//     <div style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
//       {/* Statistics Cards */}
//       <Row gutter={16} style={{ marginBottom: '16px' }}>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Total Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.totalRoles}
//             </div>
//             <UserOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Active Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.activeRoles}
//             </div>
//             <TeamOutlined style={{ fontSize: '36px', color: '#52c41a' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Pending Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.pendingRoles}
//             </div>
//             <DatabaseOutlined style={{ fontSize: '36px', color: '#faad14' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Archived Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.archivedRoles}
//             </div>
//             <FileDoneOutlined style={{ fontSize: '36px', color: '#ff4d4f' }} />
//           </Card>
//         </Col>
//       </Row>
//       {/* Roles Table */}
//       <Button
//         type="primary"
//         icon={<PlusOutlined />}
//         onClick={() => {
//           setIsEditing(false);
//           setSelectedRole(null);
//           form.resetFields();
//           setIsModalVisible(true);
//         }}
//         style={{ marginBottom: '16px' }}
//       >
//         Add Role
//       </Button>
//       <ProTable<Role>
//         columns={columns}
//         dataSource={roles}
//         rowKey="id"
//         onRow={(record) => ({
//           onClick: () => handleViewRole(record.id),
//         })}
//       />
//       {selectedRole && (
//         <div style={{ marginTop: 16 }}>
//           <h2>Selected Role</h2>
//           <p>
//             <strong>Role:</strong> {selectedRole?.name}
//           </p>
//           <p>
//             <strong>Description:</strong> {selectedRole?.description}
//           </p>
//           <p>
//             <strong>Is Default:</strong> {selectedRole?.is_default ? 'Yes' : 'No'}
//           </p>
//           <p>
//             <strong>Can Be Deleted:</strong> {selectedRole?.can_be_deleted ? 'Yes' : 'No'}
//           </p>
//           <p>
//             <strong>Permissions:</strong> {selectedRole?.permissions.join(', ')}
//           </p>
//         </div>
//       )}
//       <Modal
//         title={isEditing ? 'Edit Role' : 'Add Role'}
//         visible={isModalVisible}
//         onOk={() => {
//           form
//             .validateFields()
//             .then((values) => {
//               if (isEditing && selectedRole) {
//                 handleEditRole(selectedRole.id, values);
//               } else {
//                 handleAddRole(values);
//               }
//             })
//             .catch((info) => {
//               console.log('Validate Failed:', info);
//             });
//         }}
//         onCancel={() => {
//           setIsModalVisible(false);
//           form.resetFields();
//         }}
//         destroyOnClose
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="name"
//             label="Role"
//             rules={[{ required: true, message: 'Please enter the role!' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[{ required: true, message: 'Please enter a description!' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="is_default"
//             label="Is Default"
//             valuePropName="checked"
//           >
//             <Input type="checkbox" />
//           </Form.Item>
//           <Form.Item
//             name="can_be_deleted"
//             label="Can Be Deleted"
//             valuePropName="checked"
//           >
//             <Input type="checkbox" />
//           </Form.Item>
//           <Form.Item
//             name="permissions"
//             label="Permissions"
//             rules={[{ required: true, message: 'Please enter at least one permission!' }]}
//           >
//             <Input placeholder="Comma-separated permissions" />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };
// export default Roles;
// import {
//   DatabaseOutlined,
//   DeleteOutlined,
//   EditOutlined,
//   FileDoneOutlined,
//   PlusOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from '@ant-design/icons';
// import { ProColumns, ProTable } from '@ant-design/pro-components';
// import {
//   Button,
//   Card,
//   Col,
//   Form,
//   Input,
//   message,
//   Modal,
//   Popconfirm,
//   Row,
//   Space,
//   Typography,
// } from 'antd';
// import React, { useEffect, useState } from 'react';
// import { request } from 'umi';
// const { Title } = Typography;
// interface Role {
//   id: string;
//   name: string;
//   description: string;
//   is_default: boolean;
//   can_be_deleted: boolean;
//   permissions: string[];
//   status?: string; // Optional field for status
// }
// const Roles: React.FC = () => {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [form] = Form.useForm();
//   // Fetch roles
//   const fetchRoles = async () => {
//     try {
//       const response = await request('/roles');
//       setRoles(response.data); // Update state with new roles data
//     } catch (error) {
//       message.error('Failed to fetch roles');
//     }
//   };
//   useEffect(() => {
//     fetchRoles();
//   }, []);
//   // Handle add role
//   const handleAddRole = async (values: any) => {
//     try {
//       // Convert permissions from comma-separated string to an array
//       values.permissions = values.permissions.split(',').map((p: string) => p.trim());
//       await request('/roles', {
//         method: 'POST',
//         data: values,
//       });
//       message.success('Role added successfully');
//       fetchRoles(); // Refresh roles list
//       setIsModalVisible(false); // Close modal
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || 'Failed to add role';
//       message.error(errorMessage);
//     }
//   };
//   // Handle edit role
//   const handleEditRole = async (id: string, values: any) => {
//     try {
//       // Convert permissions from comma-separated string to an array
//       values.permissions = values.permissions.split(',').map((p: string) => p.trim());
//       await request(`/roles/${id}`, {
//         method: 'PUT',
//         data: values,
//       });
//       message.success('Role updated successfully');
//       fetchRoles(); // Refresh roles list
//       setIsModalVisible(false); // Close modal
//       setSelectedRole(null); // Clear selected role
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || 'Failed to update role';
//       message.error(errorMessage);
//     }
//   };
//   // Handle delete role
//   const handleDeleteRole = async (id: string) => {
//     try {
//       await request(`/roles/${id}`, {
//         method: 'DELETE',
//       });
//       message.success('Role deleted successfully');
//       fetchRoles(); // Refresh roles list
//     } catch (error) {
//       message.error('Failed to delete role');
//     }
//   };
//   // Handle view role
//   const handleViewRole = async (id: string) => {
//     try {
//       const response = await request(`/roles/${id}`);
//       setSelectedRole(response.data);
//     } catch (error) {
//       message.error('Failed to fetch role details');
//     }
//   };
//   const columns: ProColumns<Role>[] = [
//     { title: 'Role', dataIndex: 'name', key: 'name' },
//     { title: 'Description', dataIndex: 'description', key: 'description' },
//     { title: 'Is Default', dataIndex: 'is_default', key: 'is_default', render: (text) => (text ? 'Yes' : 'No') },
//     { title: 'Can Be Deleted', dataIndex: 'can_be_deleted', key: 'can_be_deleted', render: (text) => (text ? 'Yes' : 'No') },
//     { title: 'Permissions', dataIndex: 'permissions', key: 'permissions', render: (text) => text.join(', ') },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => {
//               setIsEditing(true);
//               setSelectedRole(record);
//               form.setFieldsValue({
//                 ...record,
//                 permissions: record.permissions.join(', '), // Convert array to comma-separated string
//               });
//               setIsModalVisible(true);
//             }}
//           />
//           <Popconfirm
//             title="Are you sure you want to delete this role?"
//             onConfirm={() => handleDeleteRole(record.id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];
//   // Mock data for statistics
//   const stats = {
//     totalRoles: roles.length,
//     activeRoles: roles.filter((role) => role.status === 'active').length,
//     pendingRoles: roles.filter((role) => role.status === 'pending').length,
//     archivedRoles: roles.filter((role) => role.status === 'archived').length,
//   };
//   return (
//     <div style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
//       {/* Statistics Cards */}
//       <Row gutter={16} style={{ marginBottom: '16px' }}>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Total Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.totalRoles}
//             </div>
//             <UserOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Active Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.activeRoles}
//             </div>
//             <TeamOutlined style={{ fontSize: '36px', color: '#52c41a' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Pending Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.pendingRoles}
//             </div>
//             <DatabaseOutlined style={{ fontSize: '36px', color: '#faad14' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Archived Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.archivedRoles}
//             </div>
//             <FileDoneOutlined style={{ fontSize: '36px', color: '#ff4d4f' }} />
//           </Card>
//         </Col>
//       </Row>
//       {/* Roles Table */}
//       <Button
//         type="primary"
//         icon={<PlusOutlined />}
//         onClick={() => {
//           setIsEditing(false);
//           setSelectedRole(null);
//           form.resetFields();
//           setIsModalVisible(true);
//         }}
//         style={{ marginBottom: '16px' }}
//       >
//         Add Role
//       </Button>
//       <ProTable<Role>
//         columns={columns}
//         dataSource={roles}
//         rowKey="id"
//         onRow={(record) => ({
//           onClick: () => handleViewRole(record.id),
//         })}
//       />
//       {selectedRole && (
//         <div style={{ marginTop: 16 }}>
//           <h2>Selected Role</h2>
//           <p>
//             <strong>Role:</strong> {selectedRole?.name}
//           </p>
//           <p>
//             <strong>Description:</strong> {selectedRole?.description}
//           </p>
//           <p>
//             <strong>Is Default:</strong> {selectedRole?.is_default ? 'Yes' : 'No'}
//           </p>
//           <p>
//             <strong>Can Be Deleted:</strong> {selectedRole?.can_be_deleted ? 'Yes' : 'No'}
//           </p>
//           <p>
//             <strong>Permissions:</strong> {selectedRole?.permissions.join(', ')}
//           </p>
//         </div>
//       )}
//       <Modal
//         title={isEditing ? 'Edit Role' : 'Add Role'}
//         visible={isModalVisible}
//         onOk={() => {
//           form
//             .validateFields()
//             .then((values) => {
//               if (isEditing && selectedRole) {
//                 handleEditRole(selectedRole.id, values);
//               } else {
//                 handleAddRole(values);
//               }
//             })
//             .catch((info) => {
//               console.log('Validate Failed:', info);
//             });
//         }}
//         onCancel={() => {
//           setIsModalVisible(false);
//           form.resetFields();
//         }}
//         destroyOnClose
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="name"
//             label="Role"
//             rules={[{ required: true, message: 'Please enter role name' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[{ required: true, message: 'Please enter description' }]}
//           >
//             <Input.TextArea rows={4} />
//           </Form.Item>
//           <Form.Item
//             name="is_default"
//             label="Is Default"
//             valuePropName="checked"
//           >
//             <Input type="checkbox" />
//           </Form.Item>
//           <Form.Item
//             name="can_be_deleted"
//             label="Can Be Deleted"
//             valuePropName="checked"
//           >
//             <Input type="checkbox" />
//           </Form.Item>
//           <Form.Item
//             name="permissions"
//             label="Permissions"
//             rules={[{ required: true, message: 'Please enter permissions' }]}
//           >
//             <Input placeholder="Comma-separated values" />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };
// export default Roles;
// import {
//   DatabaseOutlined,
//   DeleteOutlined,
//   EditOutlined,
//   FileDoneOutlined,
//   PlusOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from '@ant-design/icons';
// import { ProColumns, ProTable } from '@ant-design/pro-components';
// import {
//   Button,
//   Card,
//   Col,
//   Form,
//   Input,
//   message,
//   Modal,
//   Popconfirm,
//   Row,
//   Space,
//   Typography,
//   Checkbox,
// } from 'antd';
// import React, { useEffect, useState } from 'react';
// import { request } from 'umi';
// const { Title } = Typography;
// interface Role {
//   id: string;
//   name: string;
//   description: string;
//   is_default: boolean;
//   can_be_deleted: boolean;
//   permissions: string[];
//   status?: string; // Optional field for status
// }
// const Roles: React.FC = () => {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [form] = Form.useForm();
//   const [allPermissions, setAllPermissions] = useState<any[]>([]); // Load all permissions for the checkboxes
//   // Fetch roles
//   const fetchRoles = async () => {
//     try {
//       const response = await request('/roles');
//       setRoles(response.data); // Update state with new roles data
//     } catch (error) {
//       message.error('Failed to fetch roles');
//     }
//   };
//   // Fetch permissions
//   const fetchPermissions = async () => {
//     try {
//       const response = await request('/permissions'); // Assuming there's an endpoint to get all permissions
//       setAllPermissions(response.data);
//     } catch (error) {
//       message.error('Failed to fetch permissions');
//     }
//   };
//   useEffect(() => {
//     fetchRoles();
//     fetchPermissions();
//   }, []);
//   // Handle add role
//   const handleAddRole = async (values: any) => {
//     try {
//       const payload = {
//         ...values,
//         permissions: values.permissions.filter((p: any) => p).map((p: any) => p.id), // Convert permissions to array of IDs
//       };
//       await request('/roles', {
//         method: 'POST',
//         data: payload,
//       });
//       message.success('Role added successfully');
//       fetchRoles(); // Refresh roles list
//       setIsModalVisible(false); // Close modal
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || 'Failed to add role';
//       message.error(errorMessage);
//     }
//   };
//   // Handle edit role
//   const handleEditRole = async (id: string, values: any) => {
//     try {
//       const payload = {
//         ...values,
//         permissions: values.permissions.filter((p: any) => p).map((p: any) => p.id), // Convert permissions to array of IDs
//       };
//       await request(`/roles/${id}`, {
//         method: 'PUT',
//         data: payload,
//       });
//       message.success('Role updated successfully');
//       fetchRoles(); // Refresh roles list
//       setIsModalVisible(false); // Close modal
//       setSelectedRole(null); // Clear selected role
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || 'Failed to update role';
//       message.error(errorMessage);
//     }
//   };
//   // Handle delete role
//   const handleDeleteRole = async (id: string) => {
//     try {
//       await request(`/roles/${id}`, {
//         method: 'DELETE',
//       });
//       message.success('Role deleted successfully');
//       fetchRoles(); // Refresh roles list
//     } catch (error) {
//       message.error('Failed to delete role');
//     }
//   };
//   // Handle view role
//   const handleViewRole = async (id: string) => {
//     try {
//       const response = await request(`/roles/${id}`);
//       setSelectedRole(response.data);
//     } catch (error) {
//       message.error('Failed to fetch role details');
//     }
//   };
//   const columns: ProColumns<Role>[] = [
//     { title: 'Role', dataIndex: 'name', key: 'name' },
//     { title: 'Description', dataIndex: 'description', key: 'description' },
//     { title: 'Is Default', dataIndex: 'is_default', key: 'is_default', render: (text) => (text ? 'Yes' : 'No') },
//     { title: 'Can Be Deleted', dataIndex: 'can_be_deleted', key: 'can_be_deleted', render: (text) => (text ? 'Yes' : 'No') },
//     { title: 'Permissions', dataIndex: 'permissions', key: 'permissions', render: (text) => text.join(', ') },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => {
//               setIsEditing(true);
//               setSelectedRole(record);
//               form.setFieldsValue({
//                 ...record,
//                 permissions: record.permissions.map((p: any) => ({ id: p })), // Set permissions for editing
//               });
//               setIsModalVisible(true);
//             }}
//           />
//           <Popconfirm
//             title="Are you sure you want to delete this role?"
//             onConfirm={() => handleDeleteRole(record.id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];
//   // Mock data for statistics
//   const stats = {
//     totalRoles: roles.length,
//     activeRoles: roles.filter((role) => role.status === 'active').length,
//     pendingRoles: roles.filter((role) => role.status === 'pending').length,
//     archivedRoles: roles.filter((role) => role.status === 'archived').length,
//   };
//   return (
//     <div style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
//       {/* Statistics Cards */}
//       <Row gutter={16} style={{ marginBottom: '16px' }}>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Total Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.totalRoles}
//             </div>
//             <UserOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Active Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.activeRoles}
//             </div>
//             <TeamOutlined style={{ fontSize: '36px', color: '#52c41a' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Pending Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.pendingRoles}
//             </div>
//             <DatabaseOutlined style={{ fontSize: '36px', color: '#faad14' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Archived Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.archivedRoles}
//             </div>
//             <FileDoneOutlined style={{ fontSize: '36px', color: '#ff4d4f' }} />
//           </Card>
//         </Col>
//       </Row>
//       {/* Roles Table */}
//       <Button
//         type="primary"
//         icon={<PlusOutlined />}
//         onClick={() => {
//           setIsEditing(false);
//           setSelectedRole(null);
//           form.resetFields();
//           setIsModalVisible(true);
//         }}
//         style={{ marginBottom: '16px', float: 'right' }}
//       >
//         Add Role
//       </Button>
//       <ProTable<Role>
//         columns={columns}
//         dataSource={roles}
//         rowKey="id"
//         onRow={(record) => ({
//           onClick: () => handleViewRole(record.id),
//         })}
//       />
//       {selectedRole && (
//         <div style={{ marginTop: 16 }}>
//           <h2>Selected Role</h2>
//           <p>
//             <strong>Role:</strong> {selectedRole?.name}
//           </p>
//           <p>
//             <strong>Description:</strong> {selectedRole?.description}
//           </p>
//           <p>
//             <strong>Is Default:</strong> {selectedRole?.is_default ? 'Yes' : 'No'}
//           </p>
//           <p>
//             <strong>Can Be Deleted:</strong> {selectedRole?.can_be_deleted ? 'Yes' : 'No'}
//           </p>
//           <p>
//             <strong>Permissions:</strong> {selectedRole?.permissions.join(', ')}
//           </p>
//         </div>
//       )}
//       {/* Role Form Modal */}
//       <Modal
//         title={isEditing ? 'Edit Role' : 'Add Role'}
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={isEditing ? (values) => handleEditRole(selectedRole!.id, values) : handleAddRole}
//         >
//           <Form.Item
//             name="name"
//             label="Role Name"
//             rules={[{ required: true, message: 'Please input the role name!' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="description"
//             label="Description"
//           >
//             <Input.TextArea />
//           </Form.Item>
//           <Form.Item
//             name="is_default"
//             label="Is Default"
//             valuePropName="checked"
//           >
//             <Checkbox />
//           </Form.Item>
//           <Form.Item
//             name="permissions"
//             label="Permissions"
//             rules={[{ required: true, message: 'Please select permissions!' }]}
//           >
//             <Checkbox.Group options={allPermissions.map((perm) => ({ label: perm.name, value: perm.id }))} />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               {isEditing ? 'Update Role' : 'Add Role'}
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };
// export default Roles;
// import {
//   DatabaseOutlined,
//   DeleteOutlined,
//   EditOutlined,
//   FileDoneOutlined,
//   PlusOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from '@ant-design/icons';
// import { ProColumns, ProTable } from '@ant-design/pro-components';
// import {
//   Button,
//   Card,
//   Col,
//   Form,
//   Input,
//   message,
//   Modal,
//   Popconfirm,
//   Row,
//   Select,
//   Space,
//   Typography,
//   Checkbox,
// } from 'antd';
// import React, { useEffect, useState } from 'react';
// import { request } from 'umi';
// const { Title } = Typography;
// const { Option } = Select;
// interface Role {
//   id: string;
//   name: string;
//   description: string;
//   is_default: boolean;
//   can_be_deleted: boolean;
//   is_deleted: boolean;
//   permissions: string[];
//   status?: string;
// }
// interface Permission {
//   id: string;
//   name: string;
// }
// const Roles: React.FC = () => {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [form] = Form.useForm();
//   const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
//   const [loadingPermissions, setLoadingPermissions] = useState(false);
//   // Fetch roles
//   const fetchRoles = async () => {
//     try {
//       const response = await request('/roles');
//       setRoles(response.data);
//     } catch (error) {
//       message.error('Failed to fetch roles');
//     }
//   };
//   // Fetch permissions
//   const fetchPermissions = async () => {
//     setLoadingPermissions(true);
//     try {
//       const response = await request('/permissions');
//       const permissionsData = response.data.data; // Accessing the array of permissions
//       const permissions = permissionsData.map((perm: any) => ({
//         id: perm.id,
//         name: perm.name,
//       }));
//       setAllPermissions(permissions);
//     } catch (error) {
//       message.error('Failed to fetch permissions');
//     } finally {
//       setLoadingPermissions(false);
//     }
//   };
//   useEffect(() => {
//     fetchRoles();
//     fetchPermissions();
//   }, []);
//   // Handle add role
//   const handleAddRole = async (values: any) => {
//     try {
//       // Filter out null values and map permissions to their IDs
//       const payload = {
//         ...values,
//         permissions: values.permissions ? values.permissions.map((p: any) => p.id).filter(Boolean) : [],
//       };
//       await request('/roles', {
//         method: 'POST',
//         data: payload,
//       });
//       message.success('Role added successfully');
//       fetchRoles();
//       setIsModalVisible(false);
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || 'Failed to add role';
//       message.error(errorMessage);
//     }
//   };
//   // Handle edit role
//   const handleEditRole = async (id: string, values: any) => {
//     try {
//       // Filter out null values and map permissions to their IDs
//       const payload = {
//         ...values,
//         permissions: values.permissions ? values.permissions.map((p: any) => p.id).filter(Boolean) : [],
//       };
//       await request(`/roles/${id}`, {
//         method: 'PUT',
//         data: payload,
//       });
//       message.success('Role updated successfully');
//       fetchRoles();
//       setIsModalVisible(false);
//       setSelectedRole(null);
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || 'Failed to update role';
//       message.error(errorMessage);
//     }
//   };
//   // Handle delete role
//   const handleDeleteRole = async (id: string) => {
//     try {
//       await request(`/roles/${id}`, {
//         method: 'DELETE',
//       });
//       message.success('Role deleted successfully');
//       fetchRoles();
//     } catch (error) {
//       message.error('Failed to delete role');
//     }
//   };
//   // Handle view role
//   const handleViewRole = async (id: string) => {
//     try {
//       const response = await request(`/roles/${id}`);
//       setSelectedRole(response.data);
//     } catch (error) {
//       message.error('Failed to fetch role details');
//     }
//   };
//   const columns: ProColumns<Role>[] = [
//     { title: 'Role', dataIndex: 'name', key: 'name' },
//     { title: 'Description', dataIndex: 'description', key: 'description' },
//     { title: 'Is Default', dataIndex: 'is_default', key: 'is_default', render: (text) => (text ? 'Yes' : 'No') },
//     { title: 'Can Be Deleted', dataIndex: 'can_be_deleted', key: 'can_be_deleted', render: (text) => (text ? 'Yes' : 'No') },
//     { title: 'Is Deleted', dataIndex: 'is_deleted', key: 'is_deleted', render: (text) => (text ? 'Yes' : 'No') },
//     { title: 'Permissions', dataIndex: 'permissions', key: 'permissions', render: (text) => text.join(', ') },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => {
//               setIsEditing(true);
//               setSelectedRole(record);
//               form.setFieldsValue({
//                 ...record,
//                 permissions: record.permissions.map((p: any) => ({ id: p })),
//               });
//               setIsModalVisible(true);
//             }}
//           />
//           <Popconfirm
//             title="Are you sure you want to delete this role?"
//             onConfirm={() => handleDeleteRole(record.id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];
//   const stats = {
//     totalRoles: roles.length,
//     activeRoles: roles.filter((role) => role.status === 'active').length,
//     pendingRoles: roles.filter((role) => role.status === 'pending').length,
//     archivedRoles: roles.filter((role) => role.status === 'archived').length,
//   };
//   return (
//     <div style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
//       {/* Statistics Cards */}
//       <Row gutter={16} style={{ marginBottom: '16px' }}>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Total Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.totalRoles}
//             </div>
//             <UserOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Active Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.activeRoles}
//             </div>
//             <TeamOutlined style={{ fontSize: '36px', color: '#52c41a' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Pending Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.pendingRoles}
//             </div>
//             <DatabaseOutlined style={{ fontSize: '36px', color: '#faad14' }} />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card bordered>
//             <Title level={4}>Archived Roles</Title>
//             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//               {stats.archivedRoles}
//             </div>
//             <FileDoneOutlined style={{ fontSize: '36px', color: '#ff4d4f' }} />
//           </Card>
//         </Col>
//       </Row>
//       {/* Roles Table */}
//       <Button
//         type="primary"
//         icon={<PlusOutlined />}
//         onClick={() => {
//           setIsEditing(false);
//           setSelectedRole(null);
//           form.resetFields();
//           setIsModalVisible(true);
//         }}
//         style={{ marginBottom: '16px', float: 'right' }}
//       >
//         Add Role
//       </Button>
//       <ProTable<Role>
//         columns={columns}
//         dataSource={roles}
//         rowKey="id"
//         onRow={(record) => ({
//           onClick: () => handleViewRole(record.id),
//         })}
//       />
//       {selectedRole && (
//         <div style={{ marginTop: '24px' }}>
//           <Title level={4}>Role Details</Title>
//           <p>
//             <strong>Name:</strong> {selectedRole.name}
//           </p>
//           <p>
//             <strong>Description:</strong> {selectedRole.description}
//           </p>
//           <p>
//             <strong>Is Default:</strong> {selectedRole.is_default ? 'Yes' : 'No'}
//           </p>
//           <p>
//             <strong>Can Be Deleted:</strong> {selectedRole.can_be_deleted ? 'Yes' : 'No'}
//           </p>
//           <p>
//             <strong>Is Deleted:</strong> {selectedRole.is_deleted ? 'Yes' : 'No'}
//           </p>
//           <p>
//             <strong>Permissions:</strong> {selectedRole.permissions.join(', ')}
//           </p>
//         </div>
//       )}
//       {/* Modal Form */}
//       <Modal
//         title={isEditing ? 'Edit Role' : 'Add Role'}
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//         width={600}
//       >
//         <Form
//           form={form}
//           onFinish={(values) => {
//             if (isEditing && selectedRole) {
//               handleEditRole(selectedRole.id, values);
//             } else {
//               handleAddRole(values);
//             }
//           }}
//           layout="vertical"
//         >
//           <Form.Item
//             name="name"
//             label="Role Name"
//             rules={[{ required: true, message: 'Please input the role name!' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[{ required: true, message: 'Please input the description!' }]}
//           >
//             <Input.TextArea rows={4} />
//           </Form.Item>
//           <Form.Item
//             name="is_default"
//             label="Is Default"
//             valuePropName="checked"
//           >
//             <Checkbox />
//           </Form.Item>
//           <Form.Item
//             name="can_be_deleted"
//             label="Can Be Deleted"
//             valuePropName="checked"
//           >
//             <Checkbox />
//           </Form.Item>
//           <Form.Item
//             name="permissions"
//             label="Permissions"
//             rules={[{ required: true, message: 'Please select permissions!' }]}
//           >
//             <Select
//               mode="multiple"
//               placeholder="Select Permissions"
//               loading={loadingPermissions}
//               options={allPermissions.map((perm) => ({ label: perm.name, value: perm.id }))}
//             />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit" block>
//               {isEditing ? 'Update Role' : 'Add Role'}
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };
// export default Roles;
var icons_1 = require("@ant-design/icons");
var pro_components_1 = require("@ant-design/pro-components");
var antd_1 = require("antd");
var react_1 = require("react");
var umi_1 = require("umi");
var Title = antd_1.Typography.Title;
var Option = antd_1.Select.Option;
var Roles = function () {
    var _a = react_1.useState([]), roles = _a[0], setRoles = _a[1];
    var _b = react_1.useState(null), selectedRole = _b[0], setSelectedRole = _b[1];
    var _c = react_1.useState(false), isModalVisible = _c[0], setIsModalVisible = _c[1];
    var _d = react_1.useState(false), isEditing = _d[0], setIsEditing = _d[1];
    var form = antd_1.Form.useForm()[0];
    var _e = react_1.useState([]), allPermissions = _e[0], setAllPermissions = _e[1];
    var _f = react_1.useState(false), loadingPermissions = _f[0], setLoadingPermissions = _f[1];
    // Fetch roles
    var fetchRoles = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, umi_1.request('/roles')];
                case 1:
                    response = _a.sent();
                    console.log('Roles response:', response); // Debugging
                    if (Array.isArray(response.data)) {
                        setRoles(response.data);
                    }
                    else {
                        antd_1.message.error('Roles data is not in expected format');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    antd_1.message.error('Failed to fetch roles');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Fetch permissions
    var fetchPermissions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingPermissions(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, umi_1.request('/permissions')];
                case 2:
                    response = _a.sent();
                    console.log('Permissions response:', response); // Debugging
                    if (Array.isArray(response.data)) {
                        setAllPermissions(response.data);
                    }
                    else {
                        antd_1.message.error('Permissions data is not in expected format');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    antd_1.message.error('Failed to fetch permissions');
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingPermissions(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        fetchRoles();
        fetchPermissions();
    }, []);
    // Handle add role
    var handleAddRole = function (values) { return __awaiter(void 0, void 0, void 0, function () {
        var payload, response, error_3, errorMessage;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    payload = {
                        name: values.name,
                        description: values.description,
                        permissions: values.permissions ? values.permissions.filter(Boolean) : []
                    };
                    return [4 /*yield*/, umi_1.request('/roles', {
                            method: 'POST',
                            data: payload
                        })];
                case 1:
                    response = _c.sent();
                    if (response.success) {
                        antd_1.message.success('Role added successfully');
                        fetchRoles();
                        setIsModalVisible(false);
                    }
                    else {
                        antd_1.message.error(response.message || 'Failed to add role');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _c.sent();
                    errorMessage = ((_b = (_a = error_3 === null || error_3 === void 0 ? void 0 : error_3.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to add role';
                    antd_1.message.error(errorMessage);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Handle edit role
    var handleEditRole = function (id, values) { return __awaiter(void 0, void 0, void 0, function () {
        var payload, response, error_4, errorMessage;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    payload = {
                        name: values.name,
                        description: values.description,
                        permissions: values.permissions ? values.permissions.filter(Boolean) : []
                    };
                    return [4 /*yield*/, umi_1.request("/roles/" + id, {
                            method: 'PUT',
                            data: payload
                        })];
                case 1:
                    response = _c.sent();
                    if (response.success) {
                        antd_1.message.success('Role updated successfully');
                        fetchRoles();
                        setIsModalVisible(false);
                        setSelectedRole(null);
                    }
                    else {
                        antd_1.message.error(response.message || 'Failed to update role');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _c.sent();
                    errorMessage = ((_b = (_a = error_4 === null || error_4 === void 0 ? void 0 : error_4.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to update role';
                    antd_1.message.error(errorMessage);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Handle delete role
    var handleDeleteRole = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, umi_1.request("/roles/" + id, {
                            method: 'DELETE'
                        })];
                case 1:
                    response = _a.sent();
                    if (response.success) {
                        antd_1.message.success('Role deleted successfully');
                        fetchRoles();
                    }
                    else {
                        antd_1.message.error(response.message || 'Failed to delete role');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    antd_1.message.error('Failed to delete role');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Handle view role
    var handleViewRole = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, umi_1.request("/roles/" + id)];
                case 1:
                    response = _a.sent();
                    setSelectedRole(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    antd_1.message.error('Failed to fetch role details');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var columns = [
        { title: 'Role', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Is Default', dataIndex: 'is_default', key: 'is_default', render: function (text) { return (text ? 'Yes' : 'No'); } },
        { title: 'Can Be Deleted', dataIndex: 'can_be_deleted', key: 'can_be_deleted', render: function (text) { return (text ? 'Yes' : 'No'); } },
        { title: 'Is Deleted', dataIndex: 'is_deleted', key: 'is_deleted', render: function (text) { return (text ? 'Yes' : 'No'); } },
        { title: 'Permissions', dataIndex: 'permissions', key: 'permissions', render: function (text) { return text.join(', '); } },
        {
            title: 'Actions',
            key: 'actions',
            render: function (_, record) { return (react_1["default"].createElement(antd_1.Space, { size: "middle" },
                react_1["default"].createElement(antd_1.Button, { icon: react_1["default"].createElement(icons_1.EditOutlined, null), onClick: function () {
                        setIsEditing(true);
                        setSelectedRole(record);
                        form.setFieldsValue(__assign(__assign({}, record), { permissions: record.permissions.map(function (p) { return p.id; }) }));
                        setIsModalVisible(true);
                    } }),
                react_1["default"].createElement(antd_1.Popconfirm, { title: "Are you sure you want to delete this role?", onConfirm: function () { return handleDeleteRole(record.id); }, okText: "Yes", cancelText: "No" },
                    react_1["default"].createElement(antd_1.Button, { icon: react_1["default"].createElement(icons_1.DeleteOutlined, null) })))); }
        },
    ];
    var stats = {
        totalRoles: roles.length,
        activeRoles: roles.filter(function (role) { return role.status === 'active'; }).length,
        pendingRoles: roles.filter(function (role) { return role.status === 'pending'; }).length,
        archivedRoles: roles.filter(function (role) { return role.status === 'archived'; }).length
    };
    return (react_1["default"].createElement("div", { style: { padding: '24px', backgroundColor: '#f0f2f5' } },
        react_1["default"].createElement(antd_1.Row, { gutter: 16, style: { marginBottom: '16px' } },
            react_1["default"].createElement(antd_1.Col, { span: 6 },
                react_1["default"].createElement(antd_1.Card, { bordered: true },
                    react_1["default"].createElement(Title, { level: 4 }, "Total Roles"),
                    react_1["default"].createElement("div", { style: { fontSize: '24px', fontWeight: 'bold' } }, stats.totalRoles),
                    react_1["default"].createElement(icons_1.UserOutlined, { style: { fontSize: '36px', color: '#1890ff' } }))),
            react_1["default"].createElement(antd_1.Col, { span: 6 },
                react_1["default"].createElement(antd_1.Card, { bordered: true },
                    react_1["default"].createElement(Title, { level: 4 }, "Active Roles"),
                    react_1["default"].createElement("div", { style: { fontSize: '24px', fontWeight: 'bold' } }, stats.activeRoles),
                    react_1["default"].createElement(icons_1.TeamOutlined, { style: { fontSize: '36px', color: '#52c41a' } }))),
            react_1["default"].createElement(antd_1.Col, { span: 6 },
                react_1["default"].createElement(antd_1.Card, { bordered: true },
                    react_1["default"].createElement(Title, { level: 4 }, "Pending Roles"),
                    react_1["default"].createElement("div", { style: { fontSize: '24px', fontWeight: 'bold' } }, stats.pendingRoles),
                    react_1["default"].createElement(icons_1.DatabaseOutlined, { style: { fontSize: '36px', color: '#faad14' } }))),
            react_1["default"].createElement(antd_1.Col, { span: 6 },
                react_1["default"].createElement(antd_1.Card, { bordered: true },
                    react_1["default"].createElement(Title, { level: 4 }, "Archived Roles"),
                    react_1["default"].createElement("div", { style: { fontSize: '24px', fontWeight: 'bold' } }, stats.archivedRoles),
                    react_1["default"].createElement(icons_1.FileDoneOutlined, { style: { fontSize: '36px', color: '#ff4d4f' } })))),
        react_1["default"].createElement(pro_components_1.ProTable, { columns: columns, dataSource: roles, rowKey: "id", search: false, toolBarRender: function () { return [
                react_1["default"].createElement(antd_1.Button, { type: "primary", icon: react_1["default"].createElement(icons_1.PlusOutlined, null), onClick: function () {
                        setIsEditing(false);
                        setSelectedRole(null);
                        form.resetFields();
                        setIsModalVisible(true);
                    } }, "Add Role"),
            ]; } }),
        react_1["default"].createElement(antd_1.Modal, { title: isEditing ? 'Edit Role' : 'Add Role', visible: isModalVisible, onCancel: function () { return setIsModalVisible(false); }, footer: null },
            react_1["default"].createElement(antd_1.Form, { form: form, layout: "vertical", onFinish: isEditing ? function (values) { return selectedRole && handleEditRole(selectedRole.id, values); } : handleAddRole },
                react_1["default"].createElement(antd_1.Form.Item, { name: "name", label: "Role Name", rules: [{ required: true, message: 'Please input the role name!' }] },
                    react_1["default"].createElement(antd_1.Input, null)),
                react_1["default"].createElement(antd_1.Form.Item, { name: "description", label: "Description", rules: [{ required: true, message: 'Please input the description!' }] },
                    react_1["default"].createElement(antd_1.Input.TextArea, { rows: 4 })),
                react_1["default"].createElement(antd_1.Form.Item, { name: "permissions", label: "Permissions" },
                    react_1["default"].createElement(antd_1.Select, { mode: "multiple", placeholder: "Select permissions", loading: loadingPermissions, allowClear: true }, allPermissions.map(function (perm) { return (react_1["default"].createElement(Option, { key: perm.id, value: perm.id }, perm.name)); }))),
                react_1["default"].createElement(antd_1.Form.Item, null,
                    react_1["default"].createElement(antd_1.Button, { type: "primary", htmlType: "submit" }, isEditing ? 'Update Role' : 'Add Role'))))));
};
exports["default"] = Roles;
