// import React, { useRef, useState, useEffect } from 'react';
// import {
//   ActionType,
//   ProColumns,
//   ProFormText,
//   ProTable,
// } from '@ant-design/pro-components';
// import { Button, Card, Row, Col, message, Popconfirm, Space, Tooltip, Typography, Form, Input } from 'antd';
// import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { request } from 'umi';
// import moment from 'moment';

// const { Title, Paragraph } = Typography;

// const JobTypeManagement: React.FC = () => {
//   const [form] = Form.useForm();
//   const tableActionRef = useRef<ActionType>();
//   const [formValues, setFormValues] = useState(undefined);
//   const [jobTypes, setJobTypes] = useState([]);
//   const [newJobType, setNewJobType] = useState('');
//   const [newSymbol, setNewSymbol] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState(undefined);
//   const [statuses, setStatuses] = useState([]);

//   // Fetch job types from the API
//   useEffect(() => {
//     const fetchJobTypes = async () => {
//       try {
//         const response = await request('/job-types');
//         setJobTypes(Array.isArray(response.data.data) ? response.data.data : []);
//       } catch (error) {
//         message.error('Failed to fetch job types.');
//       }
//     };
//     fetchJobTypes();
//   }, []);

//   // Handle editing of a job type
//   const handleEdit = (record) => {
//     setFormValues(record);
//     setNewJobType(record.name);
//     setNewSymbol(record.symbol);
//     setSelectedStatus(record.status_id);
//   };

//   // Handle deletion of a job type
//   const handleDelete = async (id) => {
//     try {
//       await request(`/job-types/${id}`, { method: 'DELETE' });
//       message.success('Job type deleted successfully.');
//       setJobTypes(jobTypes.filter(jobType => jobType.id !== id)); // Remove job type from state
//     } catch (error) {
//       message.error('Failed to delete job type.');
//     }
//   };

//   // Handle adding a new job type
//   const handleAddJobType = async () => {
//     if (!newJobType || !newSymbol) {
//       message.error('Both Job Type Name and Symbol are required.');
//       return;
//     }
//     try {
//       const response = await request(`/job-types`, {
//         method: 'POST',
//         data: {
//           name: newJobType,
//           symbol: newSymbol,
//           status_id: selectedStatus,
//         },
//       });

//       if (response.success) {
//         setJobTypes([...jobTypes, response.data]);
//         message.success('Job type added successfully.');
//         setNewJobType('');
//         setNewSymbol('');
//         setSelectedStatus(undefined);
//       } else {
//         message.error('Failed to add job type.');
//       }
//     } catch (error) {
//       message.error('Failed to add job type.');
//     }
//   };

//   // Define columns for the table
//   const columns: ProColumns[] = [
//     {
//       title: '#',
//       dataIndex: 'index',
//       key: 'index',
//       render: (_, __, index) => index + 1,
//     },
//     {
//       title: 'Job Type',
//       dataIndex: 'name',
//       key: 'name',
//       sorter: (a, b) => a.name.localeCompare(b.name),
//     },
//    {
//     title: 'Created By',
//     dataIndex: ['created_by', 'display_name'],  // Access nested data
//     key: 'created_by',
//     render: (text, record) => record.created_by?.display_name || 'N/A',  // Use optional chaining for safety
//   },

//     {
//       title: 'Created On',
//       dataIndex: 'created_at',
//       key: 'created_on',
//       render: (text) => (text ? moment(text).format('DD-MMM-YYYY HH:mm') : 'N/A'),
//       sorter: (a, b) => moment(a.created_at).unix() - moment(b.created_at).unix(),
//     },
//     {
//       title: 'Modified On',
//       dataIndex: 'updated_at',
//       key: 'updated_on',
//       render: (text) => (text ? moment(text).format('DD-MMM-YYYY HH:mm') : 'N/A'),
//       sorter: (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix(),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <Tooltip title="Edit">
//             <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} type="link" />
//           </Tooltip>
//           <Tooltip title="Delete">
//             <Popconfirm
//               title="Are you sure you want to delete this job type?"
//               onConfirm={() => handleDelete(record.id)}
//               okText="Yes"
//               cancelText="No"
//             >
//               <Button icon={<DeleteOutlined />} type="link" danger />
//             </Popconfirm>
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: '20px', backgroundColor: '#fff' }}>
//       <div style={{ marginBottom: '20px' }}>
//         {/* <Title level={3}>Home / Job Types</Title> */}
//         <Title level={2} style={{ marginBottom: '0' }}>Job Types</Title>
//         <Paragraph>Job Types are linked to job areas and lines.</Paragraph>
//       </div>

//       <Row gutter={16}>
//         <Col span={16}>
//           <ProTable
//             actionRef={tableActionRef}
//             rowKey="id"
//             dataSource={jobTypes}
//             columns={columns}
//             bordered
//             search={false}
//             pagination={{ pageSize: 15 }}
//             // Important: Ensure you have the editable features enabled if needed
//             // editable={{ type: 'multiple' }} // Uncomment if you need inline editing
//           />
//         </Col>
//         <Col span={8} style={{ paddingLeft: '20px' }}>
//       <Card title="Add Job Type" bordered={true}>
//         <Form
//           form={form}
//           layout="vertical"  // Ensures labels are on top of the fields
//           style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
//         >
//           <Form.Item
//             label="Job Type Name"
//             name="jobTypeName"
//             rules={[{ required: true, message: 'Please enter the job type name' }]}
//           >
//             <Input placeholder="Enter Job Type Name" />
//           </Form.Item>
//           <Form.Item
//             label="Symbol"
//             name="symbol"
//             rules={[{ required: true, message: 'Please enter the symbol' }]}
//           >
//             <Input placeholder="Enter Symbol" />
//           </Form.Item>
//           <Button type="primary" onClick={handleAddJobType} style={{ marginTop: '20px', alignSelf: 'flex-end' }}>
//             Add Job Type
//           </Button>
//         </Form>
//       </Card>
//     </Col>

//       </Row>
//     </div>
//   );
// };

// export default JobTypeManagement;
// //  <Col span={8} style={{ paddingLeft: '20px' }}>
// //           <Card title="Add Job Type" bordered={true}>
// //             <ProFormText
// //               label="Job Type Name"
// //               placeholder="Enter Job Type Name"
// //               value={newJobType}
// //               onChange={(e) => setNewJobType(e.target.value)}
// //             />
// //             <ProFormText
// //               label="Symbol"
// //               placeholder="Enter Symbol"
// //               value={newSymbol}
// //               onChange={(e) => setNewSymbol(e.target.value)}
// //             />
// //             <Button type="primary" onClick={handleAddJobType} style={{ marginTop: '20px' }}>
// //               Add Job Type
// //             </Button>
// //           </Card>
// //         </Col>


import React, { useRef, useState, useEffect } from 'react';
import {
  ActionType,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Card, Row, Col, message, Popconfirm, Space, Tooltip, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { request } from 'umi';
import moment from 'moment';

const JobTypeManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm(); // Separate form for editing
  const tableActionRef = useRef<ActionType>();
  const [jobTypes, setJobTypes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState(null); // Holds the job type being edited

  // Fetch job types from the API
  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        const response = await request('/job-types');
        setJobTypes(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        message.error('Failed to fetch job types.');
      }
    };
    fetchJobTypes();
  }, []);

  // Open modal for editing job type
  const openEditModal = (jobType) => {
    setIsModalVisible(true);
    setSelectedJobType(jobType);
    editForm.setFieldsValue({
      jobTypeName: jobType.name,
      symbol: jobType.symbol,
    });
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedJobType(null);
  };

  // Handle adding a new job type
  const handleAddJobType = async () => {
    try {
      const values = await form.validateFields();
      const response = await request('/job-types', {
        method: 'POST',
        data: {
          name: values.jobTypeName,
          symbol: values.symbol,
        },
      });
      setJobTypes([...jobTypes, response.data]);
      form.resetFields(); // Clear the form after submission
      message.success('Job type added successfully.');
    } catch (error) {
      message.error('Failed to add job type.');
    }
  };

  // Handle saving (editing) a job type
  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      if (selectedJobType) {
        await request(`/job-types/${selectedJobType.id}`, {
          method: 'PUT',
          data: {
            name: values.jobTypeName,
            symbol: values.symbol,
          },
        });
        setJobTypes(jobTypes.map(jobType => 
          jobType.id === selectedJobType.id ? { ...jobType, name: values.jobTypeName, symbol: values.symbol } : jobType
        ));
        message.success('Job type updated successfully.');
        closeModal();
      }
    } catch (error) {
      message.error('Failed to update job type.');
    }
  };

  // Handle deleting a job type
  const handleDelete = async (id) => {
    try {
      await request(`/job-types/${id}`, { method: 'DELETE' });
      setJobTypes(jobTypes.filter(jobType => jobType.id !== id));
      message.success('Job type deleted successfully.');
    } catch (error) {
      message.error('Failed to delete job type.');
    }
  };

  // Define columns for the table
  const columns: ProColumns[] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Job Type',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      sorter: (a, b) => a.symbol.localeCompare(b.symbol),
    },
    {
      title: 'Created On',
      dataIndex: 'created_at',
      key: 'created_on',
      render: (text) => (text ? moment(text).format('DD-MMM-YYYY HH:mm') : 'N/A'),
      sorter: (a, b) => moment(a.created_at).unix() - moment(b.created_at).unix(),
    },
    {
      title: 'Updated On',
      dataIndex: 'updated_at',
      key: 'updated_on',
      render: (text) => (text ? moment(text).format('DD-MMM-YYYY HH:mm') : 'N/A'),
      sorter: (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} type="link" />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this job type?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} type="link" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff' }}>
      <Row gutter={16}>
        <Col span={16}>
          <ProTable
            actionRef={tableActionRef}
            rowKey="id"
            dataSource={jobTypes}
            columns={columns}
            bordered
            search={false}
            pagination={{ pageSize: 15 }}
          />
        </Col>
        
        {/* Add Job Type Form */}
        <Col span={8} style={{ paddingLeft: '20px' }}>
          <Card title="Add Job Type" bordered={true}>
            <Form
              form={form}
              layout="vertical"  // Ensures labels are on top of the fields
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <Form.Item
                label="Job Type Name"
                name="jobTypeName"
                rules={[{ required: true, message: 'Please enter the job type name' }]}
              >
                <Input placeholder="Enter Job Type Name" />
              </Form.Item>
              <Form.Item
                label="Symbol"
                name="symbol"
                rules={[{ required: true, message: 'Please enter the symbol' }]}
              >
                <Input placeholder="Enter Symbol" />
              </Form.Item>
              <Button type="primary" onClick={handleAddJobType} style={{ marginTop: '10px', alignSelf: 'flex-end', width: '100%'}} icon={<PlusOutlined />}>
                Add Job Type
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Edit Job Type Modal */}
      <Modal
        title="Edit Job Type"
        visible={isModalVisible}
        onCancel={closeModal}
        onOk={handleSaveEdit}
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Form.Item
            label="Job Type Name"
            name="jobTypeName"
            rules={[{ required: true, message: 'Please enter the job type name' }]}
          >
            <Input placeholder="Enter Job Type Name" />
          </Form.Item>
          <Form.Item
            label="Symbol"
            name="symbol"
            rules={[{ required: true, message: 'Please enter the symbol' }]}
          >
            <Input placeholder="Enter Symbol" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobTypeManagement;
