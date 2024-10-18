import React, { useState, useEffect } from 'react';
import { Form, Input, message, Select, Typography, Switch, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout'; // Import PageContainer
import { request } from 'umi';
import moment from 'moment-timezone';

const { Title } = Typography;
const { Option } = Select;

const GeneralSettings = () => {
  const [form] = Form.useForm();
  const [timezones, setTimezones] = useState<string[]>([]);
  const [languages, setLanguages] = useState<any[]>([]); // State for languages
  const [currentTime, setCurrentTime] = useState<string>(''); // System time
  const [timezone, setTimezone] = useState<string>(''); // Timezone state
  const [clockInterval, setClockInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch system settings, timezones, and languages
  useEffect(() => {
    // Fetch system settings including current time and timezone
    request(`/system-settings`, { method: 'GET' })
      .then((response: any) => {
        if (response.settings) {
          const { settings, current_system_time } = response;
          form.setFieldsValue({
            system_status: settings.system_status,
            system_name: settings.system_name,
            contact_email: settings.contact_email,
            contact_phone: settings.contact_phone,
            timezone: settings.timezone,
            language_preference: settings.language_preference,
          });
          setTimezone(settings.timezone); // Set the system timezone
          setCurrentTime(current_system_time); // Set the system time from the endpoint
          updateClock(settings.timezone); // Update clock based on the system timezone
        } else {
          message.error('Failed to fetch system settings');
        }
      })
      .catch(() => message.error('Failed to fetch system settings'));

    // Fetch available timezones
    request(`/time-zones`, { method: 'GET' })
      .then((response: any) => {
        if (response.success === 'true' && Array.isArray(response.data)) {
          setTimezones(response.data.map((tz: any) => tz.zone_name));
        } else {
          message.error('Timezone data is not in the expected format');
        }
      })
      .catch(() => message.error('Failed to fetch timezones'));

    // Fetch available languages
    request(`/languages`, { method: 'GET' })
      .then((response: any) => {
        if (Array.isArray(response)) {
          setLanguages(response);
        } else {
          message.error('Failed to fetch languages');
        }
      })
      .catch(() => message.error('Failed to fetch languages'));

    // Cleanup clock interval on unmount
    return () => {
      if (clockInterval) {
        clearInterval(clockInterval);
      }
    };
  }, []);

  // Update the clock based on timezone
  const updateClock = (timezone: string) => {
    if (clockInterval) {
      clearInterval(clockInterval);
    }

    const updateCurrentTime = () => {
      const now = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
      setCurrentTime(now);
    };

    updateCurrentTime(); // Set initial time
    const interval = setInterval(updateCurrentTime, 1000); // Update every second
    setClockInterval(interval); // Store the interval ID for clearing
  };

  const handleUpdateSettings = (updatedData: any) => {
    request(`/system-settings`, {
      method: 'PUT',
      data: updatedData,
    })
      .then((response: any) => {
        if (response.message === 'Settings updated successfully') {
          message.success('Settings updated successfully');
        } else {
          message.error('Failed to update settings');
        }
      })
      .catch(() => message.error('Failed to update settings'));
  };

  const onFieldChange = (changedValues: any) => {
    if (changedValues.timezone) {
      setTimezone(changedValues.timezone);
      updateClock(changedValues.timezone);
    }

    handleUpdateSettings(changedValues);
  };

  return (
    <PageContainer
      title="System Settings"
      breadcrumb={{
        routes: [
          {
            path: '/system-settings',
            breadcrumbName: 'System Settings',
          },
          {
            path: '/general-settings',
            breadcrumbName: 'General Settings',
          },
        ],
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '24px' }}>
        <div style={{ width: '700px' }}>
          <Card title={<Title level={4}>System Settings</Title>} style={{ width: '100%', borderRadius: '8px' }}>
            <Form form={form} layout="vertical" onValuesChange={onFieldChange}>
              {/* System Status */}
              <Form.Item name="system_status" label="System Status">
                <Switch
                  checked={form.getFieldValue('system_status') === 'Online'}
                  onChange={(checked) => form.setFieldsValue({ system_status: checked ? 'Online' : 'Offline' })}
                  checkedChildren="Online"
                  unCheckedChildren="Offline"
                />
              </Form.Item>

              {/* System Name */}
              <Form.Item name="system_name" label="System Name">
                <Input />
              </Form.Item>

              {/* Contact Email */}
              <Form.Item name="contact_email" label="Contact Email">
                <Input />
              </Form.Item>

              {/* Contact Phone Number */}
              <Form.Item name="contact_phone" label="Contact Phone Number">
                <Input />
              </Form.Item>

              {/* System Timezone */}
              <Form.Item name="timezone" label="System Timezone">
                <Select>
                  {timezones.map((timezone) => (
                    <Option key={timezone} value={timezone}>
                      {timezone}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Language Preference */}
              <Form.Item name="language_preference" label="Language Preference">
                <Select>
                  {languages.map((language) => (
                    <Option key={language.id} value={language.code}>
                      {language.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Display current time based on the system timezone */}
              <Form.Item label="Current System Time">
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
                  {currentTime || 'Loading...'}
                </div>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default GeneralSettings;
