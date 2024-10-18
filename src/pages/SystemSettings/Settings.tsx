
import React, { useState, useEffect } from 'react';
import { Form, Select, message, Row, Col, Typography, Input, Button, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { request } from 'umi';
import { SaveOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const Settings = () => {
  const [form] = Form.useForm();
  const [serverOptions, setServerOptions] = useState([]);
  const [currentConfig, setCurrentConfig] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [selectedMailer, setSelectedMailer] = useState('');
  const [mailerConfigurations, setMailerConfigurations] = useState({});
  // Fetch mail configuration and available mailers
  useEffect(() => {
    const fetchMailConfig = async () => {
      try {
        const configResponse = await request('/mail-config');
        const mailerResponse = await request('/mailers');
        if (configResponse.success && mailerResponse) {
          setCurrentConfig(configResponse.data);
          setServerOptions(mailerResponse.map((mailer) => ({ value: mailer.name, label: mailer.description })));
          form.setFieldsValue({
            mailer: configResponse.data.mailer,
            host: configResponse.data.configurations.host,
            port: configResponse.data.configurations.port,
            fromName: configResponse.data.configurations.fromName,
            username: configResponse.data.configurations.username,
            fromEmail: configResponse.data.configurations.fromEmail,
            password: configResponse.data.configurations.password,
          });
          setSelectedMailer(configResponse.data.mailer); 
        } else {
          message.error(configResponse.message || 'Failed to fetch mail configuration');
        }
      } catch (error) {
        message.error('Error fetching data');
      }
    };
    fetchMailConfig();
  }, [form]);

  // Handle updating email configuration
  const handleUpdateConfig = async (values) => {
    try {
      const response = await request('/mail-config', {
        method: 'PUT',
        data: values,
      });
      if (response.success) {
        message.success('Mail configuration updated successfully');
      } else {
        message.error(response.message || 'Failed to update mail configuration');
      }
    } catch (error) {
      message.error('Error updating mail configuration');
    }
  };

  // Show modal for testing email config
  const showTestModal = () => {
    setIsModalVisible(true);
  };

  // Handle test email send
  const handleTestEmail = async () => {
    try {
      const response = await request('/mail-config/test', {
        method: 'POST',
        data: { email: testEmail },
      });
      if (response.success) {
        message.success('Test email sent successfully');
        setIsModalVisible(false);
      } else {
        message.error(response.message || 'Failed to send test email');
      }
    } catch (error) {
      message.error('Error sending test email');
    }
  };
  // const handleMailerChange = (mailer) => {
  //   setSelectedMailer(mailer);
  //   form.resetFields();
  //   // Set default values based on mailer if needed
  // };
  const handleMailerChange = (mailer) => {
    // Save the current form values for the currently selected mailer
    const currentValues = form.getFieldsValue();
    setMailerConfigurations((prevConfigs) => ({
      ...prevConfigs,
      [selectedMailer]: currentValues,
    }));

    // Set the newly selected mailer
    setSelectedMailer(mailer);

    // Restore the form values for the new mailer if they exist, otherwise reset
    const savedConfig = mailerConfigurations[mailer];
    if (savedConfig) {
      form.setFieldsValue(savedConfig);
    } else {
      form.resetFields(); // Reset the form if there's no saved configuration for the new mailer
    }
  };
   // Render different fields based on selected mailer
   const renderMailerFields = () => {
    switch (selectedMailer) {
      case 'smtp':
        return (
          <>
            <Form.Item label="Host" name="host" rules={[{ required: true, message: 'Please input the host!' }]}>
              <Input placeholder="e.g. smtp.gmail.com" />
            </Form.Item>
            <Form.Item label="Port" name="port" rules={[{ required: true, message: 'Please input the port!' }]}>
              <Input type="number" placeholder="e.g. 587" />
            </Form.Item>
            <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input the username!' }]}>
              <Input placeholder="e.g. sosmongare@gmail.com" />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input the password!' }]}>
              <Input.Password placeholder="Password" />
            </Form.Item>
          </>
        );
      case 'mailgun':
        return (
          <>
            <Form.Item label="Mailgun Domain" name="mailgun_domain" rules={[{ required: true, message: 'Please input the Mailgun domain!' }]}>
              <Input placeholder="e.g. mg.example.com" />
            </Form.Item>
            <Form.Item label="Mailgun Secret" name="mailgun_secret" rules={[{ required: true, message: 'Please input the Mailgun secret!' }]}>
              <Input placeholder="Your Mailgun secret key" />
            </Form.Item>
          </>
        );
      case 'ses':
        return (
          <>
            <Form.Item label="AWS Access Key ID" name="aws_access_key_id" rules={[{ required: true, message: 'Please input the AWS Access Key ID!' }]}>
              <Input placeholder="Your AWS Access Key ID" />
            </Form.Item>
            <Form.Item label="AWS Secret Access Key" name="aws_secret_access_key" rules={[{ required: true, message: 'Please input the AWS Secret Access Key!' }]}>
              <Input placeholder="Your AWS Secret Access Key" />
            </Form.Item>
            <Form.Item label="AWS Region" name="aws_default_region" rules={[{ required: true, message: 'Please input the AWS Region!' }]}>
              <Input placeholder="e.g. us-east-1" />
            </Form.Item>
          </>
        );
      case 'sendmail':
        return (
          <Form.Item label="Sendmail Path" name="sendmail_path" rules={[{ required: true, message: 'Please input the Sendmail path!' }]}>
            <Input placeholder="e.g. /usr/sbin/sendmail -bs" />
          </Form.Item>
        );
      default:
        return null;
    }
  };
  return (
    <PageContainer>
      <Row justify="center" align="middle" style={{ minHeight: '40vh' }}>
        <Col xs={24} sm={20} md={16} lg={12}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateConfig}
            style={{ padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <Title level={4} style={{ textAlign: 'center', marginBottom: '20px' }}>Email Configuration</Title>
            <Form.Item
              label="Mailer"
              name="mailer"
              rules={[{ required: true, message: 'Please select the mailer!' }]}
            >
              <Select placeholder="Select mailer" onChange={handleMailerChange}>
                {serverOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {renderMailerFields()}
            <Form.Item
              label="Host"
              name="host"
              rules={[{ required: true, message: 'Please input the host!' }]}
            >
              <Input placeholder="e.g. smtp.gmail.com" />
            </Form.Item>
            <Form.Item
              label="Port"
              name="port"
              rules={[{ required: true, message: 'Please input the port!' }]}
            >
              <Input type="number" placeholder="e.g. 587" />
            </Form.Item>
            <Form.Item
              label="From Name"
              name="fromName"
              rules={[{ required: true, message: 'Please input the from name!' }]}
            >
              <Input placeholder="e.g. Example App" />
            </Form.Item>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input the username!' }]}
            >
              <Input placeholder="e.g. sosmongare@gmail.com" />
            </Form.Item>
            <Form.Item
              label="From Email"
              name="fromEmail"
              rules={[{ required: true, message: 'Please input the from email!' }]}
            >
              <Input placeholder="e.g. sosmongare@gmail.com" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input the password!' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Row justify="space-between">
                <Col>
                  {/* <Button type="primary" htmlType="submit">
                    Save Settings
                  </Button> */}
                  <Button 
  icon={<SaveOutlined />} // Using the Save icon from Ant Design
  style={{
    backgroundColor: '#1890ff', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '4px'
  }} 
  type="primary" 
  htmlType="submit"
>
  Save Settings
</Button>

                </Col>
                <Col>
                  <Button type="dashed" onClick={showTestModal}>
                    Test Email Config
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Col>
      </Row>

      {/* Test email modal inside  here */}
      <Modal
        title="Test Email Configuration"
        visible={isModalVisible}
        onOk={handleTestEmail}
        onCancel={() => setIsModalVisible(false)}
        okText="Send Test Email"
      >
        <Form layout="vertical">
          <Form.Item label="Test Email Address">
            <Input
              placeholder="Enter email to send test"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Settings;
