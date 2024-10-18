import React, { useState, useEffect } from 'react';
import { Table, Button, Switch, message, Modal, Form, Input, Card, Divider } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { request } from 'umi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Email.less'

const EmailTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await request('/templates');
      setTemplates(response.data);
    } catch (error) {
      message.error('Failed to fetch templates');
    }
  };

  const handleCreateTemplate = async (values) => {
    try {
      const response = await request('/templates', {
        method: 'POST',
        data: values,
      });
      message.success(response.message || 'Template created successfully');
      setIsModalVisible(false);
      fetchTemplates();
    } catch (error) {
      message.error('Failed to create template');
    }
  };

  const handleDelete = async (templateId) => {
    try {
      await request(`/templates/${templateId}`, { method: 'DELETE' });
      message.success('Template deleted successfully');
      setTemplates(templates.filter((template) => template.id !== templateId));
    } catch (error) {
      message.error('Failed to delete template');
    }
  };

  const handleStatusChange = async (templateId, checked) => {
    try {
      await request(`/templates/${templateId}/status`, {
        method: 'PATCH',
        data: { status: checked ? 'Active' : 'Inactive' },
      });
      message.success('Status updated successfully');
      fetchTemplates();
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template);
    setIsViewModalVisible(true);
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setIsEditModalVisible(true);
    form.setFieldsValue(template);
  };

  const templateColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    // { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
       render: (text) => text ? text : <hr style={{ width: '20%', margin: '0 auto', border: '1px solid #ccc' }} /> 
    },
    {
      title: 'Actions',
      fixed: 'right', // Fix the Actions column to the right edge
      render: (text, record) => (
        <>
          <Button 
  icon={<EyeOutlined />} 
  onClick={() => handleViewTemplate(record)} 
  style={{ 
    marginRight: 18, 
    color: '#faad14', 
    borderColor: 'transparent', // Remove the border color
    border: 'none', // Remove the border
    borderRadius: '4px' 
  }}
>
  View
</Button>

<Button 
  icon={<EditOutlined />} 
  onClick={() => handleEditTemplate(record)} 
  style={{ 
    marginRight: 18, 
    color: '#1890ff', 
    borderColor: 'transparent', // Remove the border color
    border: 'none', // Remove the border
    borderRadius: '4px' 
  }}
>
  Edit
</Button>

<Button 
  danger 
  icon={<DeleteOutlined />} 
  onClick={() => handleDelete(record.id)}
  style={{ 
    color: '#ff4d4f', 
    borderColor: 'transparent', // Remove the border color
    border: 'none', // Remove the border
    borderRadius: '4px' 
  }}
>
  Delete
</Button>

        </>
      ),
      className:'column-actions'
    },
  ];

  return (
    <PageContainer
      title={null} // Remove the title
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '40vh' }}>
        <Card
          style={{
            width: '105%',
            // maxWidth: '1200px',
            // padding: '20px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}style={{
                backgroundColor: '#6c5ce7',
                color: '#ffffff',
                borderColor: '#6c5ce7',
              }}>
              Create Template
            </Button>
          </div>
          <Table
            columns={templateColumns}
            dataSource={templates}
            rowKey="id"
            bordered
            pagination={{ pageSize: 10 }}
            title={() => null} // Removes the default title
          />  
          {/* Create Template Modal */}
<Modal
      title="Create Email Template"
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      centered
      width={800} // Adjust the width as needed
    >
      <Form form={form} layout="vertical" onFinish={handleCreateTemplate}>
        <Form.Item
          label="Template Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the template name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Subject"
          name="subject"
          rules={[{ required: true, message: 'Please enter the subject' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Body"
          name="body"
          rules={[{ required: true, message: 'Please enter the body' }]}
        >
          <ReactQuill theme="snow" style={{ height: '200px', width: '100%' }} />
        </Form.Item>

        {/* Divider for separating content from buttons */}
        <Divider style={{ margin: '24px 0', backgroundColor: 'transparent' }} />

        <div style={{ textAlign: 'left', marginBottom: '10px' }}>
          <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" onClick={() => form.submit()}>
            OK
          </Button>
        </div>
      </Form>
    </Modal>
          {/* View Template Modal */}
          {selectedTemplate && (
            <Modal
              title="View Template"
              visible={isViewModalVisible}
              onCancel={() => setIsViewModalVisible(false)}
              footer={null}
              centered
            >
              <h3>{selectedTemplate.name}</h3>
              <p><strong>Subject:</strong> {selectedTemplate.subject}</p>
              <div dangerouslySetInnerHTML={{ __html: selectedTemplate.body }} />
            </Modal>
          )}

          {/* Edit Template Modal */}
          {selectedTemplate && (
            <Modal
              title="Edit Email Template"
              visible={isEditModalVisible}
              onCancel={() => setIsEditModalVisible(false)}
              onOk={() => form.submit()}
              centered
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={async (values) => {
                  try {
                    await request(`/templates/${selectedTemplate.id}`, {
                      method: 'PUT',
                      data: values,
                    });
                    message.success('Template updated successfully');
                    setIsEditModalVisible(false);
                    fetchTemplates();
                  } catch (error) {
                    message.error('Failed to update template');
                  }
                }}
              >
                <Form.Item label="Template Name" name="name" rules={[{ required: true, message: 'Please enter the template name' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Subject" name="subject" rules={[{ required: true, message: 'Please enter the subject' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Body" name="body" rules={[{ required: true, message: 'Please enter the body' }]}>
                  <ReactQuill theme="snow" />
                </Form.Item>
              </Form>
            </Modal>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};

export default EmailTemplate;
