import React, { useEffect, useState } from 'react';
import { Table, Checkbox, Button, message, DatePicker, Form, Modal, Select, Input, Spin, Card } from 'antd';
import { request } from 'umi';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import moment from 'moment';
import { MailOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Queue = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [emailFormVisible, setEmailFormVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmails();
    fetchTemplates();
  }, []);

  const fetchEmails = async (params = {}) => {
    try {
      const response = await request('/emails', { params });
      setEmails(response.data);
    } catch (error) {
      message.error('Failed to fetch emails');
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await request('/templates');
      setTemplates(response.data);
    } catch (error) {
      message.error('Failed to fetch templates');
    }
  };

  const handleComposeEmail = async (values) => {
    const { recipient } = values;

    if (!recipient || !editorContent || (!subject && !selectedTemplate)) {
      message.error('Recipient and body are required. Subject is required if no template is used.');
      return;
    }

    const payload = {
      to: recipient,
      subject: subject || '',
      template_id: selectedTemplate || null,
      body: editorContent,
    };

    setLoading(true);
    try {
      await request('/compose-email', {
        method: 'POST',
        data: payload,
      });
      message.success('Email sent successfully');
      setEmailFormVisible(false);
      form.resetFields();
      setEditorContent('');
      setSelectedTemplate(null);
      setSubject('');
      fetchEmails(); // Refresh emails after sending
    } catch (error) {
      message.error('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  // const handleDeleteSelected = async () => {
  //   if (selectedEmails.length === 0) {
  //     message.error('No emails selected');
  //     return;
  //   }

  //   try {
  //     await request('/emails', {
  //       method: 'DELETE',
  //       data: { ids: selectedEmails },
  //     });
  //     message.success('Selected emails deleted successfully');
  //     setSelectedEmails([]);
  //     fetchEmails();
  //   } catch (error) {
  //     message.error('Failed to delete selected emails');
  //   }
  // };
  const handleDeleteSelected = async () => {
    if (selectedEmails.length === 0) {
      message.error('No emails selected');
      return;
    }
  
    try {
      // Create an array of delete requests for selected emails
      const deletePromises = selectedEmails.map(emailId =>
        request(`/emails/${emailId}`, { method: 'DELETE' })
      );
  
      await Promise.all(deletePromises);
      message.success('Selected emails deleted successfully');
      setSelectedEmails([]);
      fetchEmails(); // Refresh emails after deletion
    } catch (error) {
      message.error('Failed to delete selected emails');
    }
  };
  
  const handleClearAll = async () => {
    if (selectedEmails.length === 0) {
      message.error('No emails selected to clear');
      return;
    }
  
    try {
      // Fetch the current date range from the range picker (or keep it in state if you prefer)
      const { startDate, endDate } = dateRange; // Assuming you have a state for the date range
      const response = await request(`/emails?start_date=${startDate}&end_date=${endDate}`);
      
      // Perform bulk delete for all emails that match the current filters
      const deletePromises = response.data.map(email =>
        request(`/emails/${email.id}`, { method: 'DELETE' })
      );
  
      await Promise.all(deletePromises);
      message.success('All filtered emails cleared successfully');
      setSelectedEmails([]);
      fetchEmails(); // Refresh emails after deletion
    } catch (error) {
      message.error('Failed to clear all emails');
    }
  };
  const handleRetryEmail = async (emailId) => {
    try {
      await request(`/emails/retry/${emailId}`, { method: 'POST' });
      message.success('Retrying email sending');
      fetchEmails();
    } catch (error) {
      message.error('Failed to retry sending email');
    }
  };

  const handleDateFilter = (dates) => {
    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      fetchEmails({ start_date: startDate.format('YYYY-MM-DD'), end_date: endDate.format('YYYY-MM-DD') });
    } else {
      fetchEmails(); // Reset or fetch all emails if no date is selected
    }
  };

  const emailColumns = [
    {
      title: '',
      dataIndex: 'checkbox',
      render: (_, record) => (
        <Checkbox
          onChange={(e) => {
            const { checked } = e.target;
            setSelectedEmails((prevSelectedEmails) =>
              checked ? [...prevSelectedEmails, record.id] : prevSelectedEmails.filter((id) => id !== record.id)
            );
          }}
        />
      ),
    },
    { title: 'Recipient', dataIndex: 'to', key: 'recipient' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { title: 'Date Sent', dataIndex: 'sent_at', key: 'dateSent', render: (text) => moment(text).format('YYYY-MM-DD') },
    { title: 'Retry Count', dataIndex: 'retry_count', key: 'retryCount' },
    { title: 'Sent', dataIndex: 'sent', key: 'sent', render: (text) => (text === 'Yes' ? 'Yes' : 'No') },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button onClick={() => handleRetryEmail(record.id)} type="link">
          Retry
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '40vh',
      }}
    >
      <Card style={{ width: '100%', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ marginBottom: '16px' }}>
          <RangePicker onChange={(dates) => handleDateFilter(dates)} />
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            icon={<MailOutlined />} 
            onClick={() => setEmailFormVisible(true)} // Open the compose email modal
            style={{ 
              backgroundColor: '#1890ff', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px' 
            }}
          >
            Compose Email
          </Button>

          <Button
            danger
            onClick={handleDeleteSelected}
            style={{ marginRight: '8px', border: 'none', boxShadow: 'none' }}
          >
            Delete Selected
          </Button>
          {/* <Button
            danger
            onClick={() => message.info('Bulk delete functionality is not yet implemented.')}
          >
            Clear All
          </Button> */}
          <Button
  danger
  onClick={handleClearAll}
>
  Clear All
</Button>

        </div>

        <Table
          columns={emailColumns}
          dataSource={emails}
          rowKey="id"
          bordered
        />

        <Modal
          title="Compose Email"
          visible={emailFormVisible}
          onCancel={() => setEmailFormVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleComposeEmail}>
            <Form.Item
              label="To"
              name="recipient"
              rules={[{ required: true, message: 'Please enter the recipient email!' }]}
            >
              <Select
                mode="multiple"
                placeholder="Select users to send email"
                options={emails.map(email => ({ label: email.to, value: email.to }))} // Assuming emails have a `to` field
                onChange={(value) => form.setFieldsValue({ recipient: value })}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              label="Subject"
              name="subject"
              rules={[{ required: !selectedTemplate, message: 'Please enter the subject!' }]}
            >
              <Input onChange={(e) => setSubject(e.target.value)} value={subject} />
            </Form.Item>
            <Form.Item label="Select Template" name="template">
              <Select onChange={(value) => setSelectedTemplate(value)} placeholder="Select a template">
                {templates.map((template) => (
                  <Option key={template.id} value={template.id}>
                    {template.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Body" name="body" rules={[{ required: true, message: 'Please enter the email body!' }]}>
              <CKEditor
                editor={ClassicEditor}
                data={editorContent}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setEditorContent(data);
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Send Email
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default Queue;
