import React, { useRef, useState, useEffect } from 'react';
import {
  ActionType,
  ProColumns,
  ProFormText,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Card, Row, Col, message, Popconfirm, Space, Tooltip, Typography, Tabs, Form, Modal, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { request } from 'umi';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const JobAreas: React.FC = () => {
  const [editForm] = Form.useForm();
  const tableActionRef = useRef<ActionType>();
  const [formValues, setFormValues] = useState(undefined);
  const [jobTypes, setJobTypes] = useState([]);
  const [newJobArea, setNewJobArea] = useState('');
  const [selectedJobType, setSelectedJobType] = useState(undefined);
  const [activeJobType, setActiveJobType] = useState(undefined);
  const [filteredJobAreas, setFilteredJobAreas] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJobArea, setSelectedJobArea] = useState(null);
  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        const response = await request('/job-types');
        setJobTypes(Array.isArray(response.data.data) ? response.data.data : []);
        // Set the default active job type
        if (response.data.data.length > 0) {
          setActiveJobType(response.data.data[0].id);
        }
      } catch (error) {
        message.error('Failed to fetch job types.');
      }
    };
    fetchJobTypes();
  }, []);

  useEffect(() => {
    const fetchJobAreas = async () => {
      try {
        const response = await request(`/job-areas`);
        const areas = response.data.data || [];
        const filteredAreas = areas.filter(area => area.job_type_id === activeJobType);
        setFilteredJobAreas(filteredAreas);
      } catch (error) {
        message.error('Failed to fetch job areas.');
      }
    };
    if (activeJobType) {
      fetchJobAreas();
    }
  }, [activeJobType]);

  const handleEdit = (record) => {
    setIsModalVisible(true);
    setSelectedJobArea(record);
    // Prefill the form with the selected job area's data
    editForm.setFieldsValue({
      name: record.name,
      job_type_id: record.job_type_id,
    });
  };
 // Handle closing the modal
 const closeModal = () => {
  setIsModalVisible(false);
  setSelectedJobArea(null);
};
 // Handle saving (editing) a job area
 const handleSaveEdit = async () => {
  try {
    const values = await editForm.validateFields();
    if (selectedJobArea) {
      // Update the job area with a PUT request
      await request(`/job-areas/${selectedJobArea.id}`, {
        method: 'PUT',
        data: {
          name: values.name,
          job_type_id: values.job_type_id,
        },
      });
      // Update the UI with the modified data
      setFilteredJobAreas((prevAreas) =>
        prevAreas.map((area) =>
          area.id === selectedJobArea.id
            ? { ...area, name: values.name, job_type_id: values.job_type_id }
            : area
        )
      );
      message.success('Job area updated successfully.');
      closeModal();
    }
  } catch (error) {
    message.error('Failed to update job area.');
  }
};

  const handleDelete = async (id) => {
    try {
      await request(`/job-areas/${id}`, { method: 'DELETE' });
      message.success('Job Area deleted successfully.');
      tableActionRef.current?.reload();
    } catch (error) {
      message.error('Failed to delete job area.');
    }
  };

  const columns: ProColumns[] = [
    {
      title: '#',
      render: (_, __, index) => index + 1, // to show the index + 1
    },
    {
      title: 'Job Areas',
      dataIndex: 'name',
      key: 'job_area',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Job Types',
      dataIndex: 'job_type_id',
      key: 'job_type',
      render: (jobTypeId) => {
        const jobType = jobTypes.find(type => type.id === jobTypeId);
        return jobType ? jobType.name : 'N/A';
      },
    },
    {
      title: 'Modified By',
      dataIndex: 'modified_by', // assuming you have this field in your data
      key: 'modified_by',
    },
    {
      title: 'Modified On',
      dataIndex: 'updated_at',
      key: 'modified_on',
      render: (text) => (text ? new Date(text).toLocaleString() : 'N/A'),
      sorter: (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
           <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} type="link" />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this job area?"
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

  const handleAddJobArea = async () => {
    if (!newJobArea || !selectedJobType) {
      message.error('Both fields are required.');
      return;
    }
    try {
      const response = await request(`/job-areas`, {
        method: 'POST',
        data: {
          name: newJobArea,
          job_type_id: selectedJobType,
        },
      });

      // Append new job area to filteredJobAreas
      const newJobAreaData = { 
        id: response.data.id, // assuming your API returns the new job area's ID
        name: newJobArea,
        job_type_id: selectedJobType,
        updated_at: new Date().toISOString(), // Assuming the current time as updated time
        modified_by: 'Your User Name', // Replace with actual logic to get the user's name
      };

      setFilteredJobAreas(prev => [...prev, newJobAreaData]);
      message.success('Job Area added successfully.');
      setNewJobArea('');
      setSelectedJobType(undefined);
      tableActionRef.current?.reload();
    } catch (error) {
      message.error('Failed to add job area.');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff' }}>
      <Title level={2} style={{ textAlign: 'left', marginBottom: '10px' }}>Job Areas Management</Title>
      <Text type="secondary" style={{ textAlign: 'left', marginBottom: '20px' }}>
        Manage job areas effectively by adding, editing, and deleting them based on job types.
      </Text>

      <Tabs activeKey={activeJobType} onChange={setActiveJobType}>
        {jobTypes.map(type => (
          <TabPane tab={type.name} key={type.id}>
            {/* The tab content can be customized further if needed */}
          </TabPane>
        ))}
      </Tabs>

      <Row gutter={16}>
        <Col span={16}>
          <ProTable
            actionRef={tableActionRef}
            rowKey="id"
            dataSource={filteredJobAreas}
            columns={columns}
            bordered
            search={false}
            pagination={{ pageSize: 15 }}
          />
        </Col>
        <Col span={8} style={{ paddingLeft: '20px' }}>
          <Title level={4}>Add Job Area</Title>
          <div>
            <label>Job Area</label>
            <ProFormText
              value={newJobArea}
              onChange={(e) => setNewJobArea(e.target.value)}
              placeholder="Enter job area"
              rules={[{ required: true, message: 'Job Area is required.' }]}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>Job Type</label>
            <ProFormSelect
              value={selectedJobType}
              onChange={(value) => setSelectedJobType(value)}
              options={jobTypes.map(type => ({ label: type.name, value: type.id }))}
              rules={[{ required: true, message: 'Job Type is required.' }]}
            />
          </div>
          <Button
            type="primary"
            onClick={handleAddJobArea}
            icon={<PlusOutlined />}
            style={{ marginTop: '10px', width: '100%' }}
          >
            Add Job Area
          </Button>
        </Col>
      </Row>
 {/* Edit Job Area Modal */}
 <Modal
        title="Edit Job Area"
        visible={isModalVisible}
        onCancel={closeModal}
        onOk={handleSaveEdit}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Job Area Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the job area name' }]}
          >
            <Input placeholder="Enter Job Area Name" />
          </Form.Item>
          <Form.Item
            label="Job Type"
            name="job_type_id"
            rules={[{ required: true, message: 'Please select a job type' }]}
          >
            <ProFormSelect
              options={jobTypes.map(type => ({ label: type.name, value: type.id }))}
            />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default JobAreas;