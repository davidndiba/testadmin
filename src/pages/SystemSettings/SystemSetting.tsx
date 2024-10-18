
import { ProCard } from '@ant-design/pro-components';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Switch,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { request } from 'umi';

const { Title } = Typography;
const { Option } = Select;

const SystemSetting = () => {
  // State management for settings
  const [isActive, setIsActive] = useState(true);
  const [timezone, setTimezone] = useState('');
  const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSetting, setNewSetting] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    // Fetch the current timezone of the site
    const fetchCurrentTimezone = async () => {
      try {
        const response = await request('/timezones');
        setTimezone(response.data?.timezone || 'UTC'); // Adjust based on actual API response
      } catch (error) {
        message.error('Failed to fetch current timezone');
        console.error(error);
      }
    };

    // Fetch the list of available timezones
    const fetchAvailableTimezones = async () => {
      try {
        // Assuming an endpoint to get available timezones or use a static list if needed
        const response = await request('/available-timezones');
        if (Array.isArray(response.data)) {
          setAvailableTimezones(response.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        message.error('Failed to fetch available timezones');
        console.error(error);
      }
    };

    fetchCurrentTimezone();
    fetchAvailableTimezones();
  }, []);

  const handleSwitchChange = (checked) => {
    setIsActive(checked);
  };

  const handleEmailNotificationsChange = (checked) => {
    setEmailNotifications(checked);
  };

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
  };

  const handleTimezoneChange = async (value) => {
    setTimezone(value);
    try {
      await request('/timezones/update', {
        method: 'POST',
        data: { timezone: value },
      });
      message.success('Timezone updated successfully');
    } catch (error) {
      message.error('Failed to update timezone');
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // Implement save settings logic here
    setIsModalVisible(false);
    message.success('Settings saved successfully');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <ProCard title="" bordered>
      <div style={{ padding: '16px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>
          System Settings
        </Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* System Status */}
          <ProCard bordered>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>System is currently {isActive ? 'Active' : 'Offline'}</div>
              <Switch checked={isActive} onChange={handleSwitchChange} />
            </div>
          </ProCard>

          {/* Default Timezone */}
          <ProCard bordered>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                Current timezone:
                <Select
                  value={timezone}
                  onChange={handleTimezoneChange}
                  style={{ width: 200, marginLeft: 10 }}
                >
                  {availableTimezones.length > 0 ? (
                    availableTimezones.map((tz) => (
                      <Option key={tz} value={tz}>
                        {tz}
                      </Option>
                    ))
                  ) : (
                    <Option value="">No timezones available</Option>
                  )}
                </Select>
              </div>
            </div>
          </ProCard>

          {/* Additional Setting */}
          <ProCard bordered>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>Additional Setting</div>
              <Button type="primary" onClick={showModal}>
                Change Setting
              </Button>
            </div>
          </ProCard>

          {/* Email Notifications */}
          <ProCard bordered>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>Email Notifications</div>
              <Switch
                checked={emailNotifications}
                onChange={handleEmailNotificationsChange}
              />
            </div>
          </ProCard>

          {/* Change Password */}
          <ProCard bordered>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>Change Password</div>
              <Button
                type="primary"
                onClick={() =>
                  message.info('Password change dialog to be implemented')
                }
              >
                Change Password
              </Button>
            </div>
          </ProCard>

          {/* API Settings HERE  */}
          <ProCard bordered>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>API Settings</div>
              <Button
                type="primary"
                onClick={() =>
                  message.info('API settings dialog to be implemented')
                }
              >
                Configure API
              </Button>
            </div>
          </ProCard>

          {/* Language Preference */}
          <ProCard bordered>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>Language Preference</div>
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                style={{ width: 200 }}
              >
                <Option value="en">English</Option>
                <Option value="es">Spanish</Option>
                <Option value="fr">French</Option>
                {/* Add more languages as needed aND DONE HERE  */}
              </Select>
            </div>
          </ProCard>
        </div>
      </div>

      {/* Modal for Additional Setting done here */}
      <Modal
        title="Change Setting"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Form.Item label="New Setting">
            <Input
              value={newSetting}
              onChange={(e) => setNewSetting(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </ProCard>
  );
};

export default SystemSetting;
