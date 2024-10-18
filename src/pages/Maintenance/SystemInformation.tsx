import React, { useEffect, useState } from 'react';
import { Card, List, Typography, message } from 'antd';
import { request } from 'umi';
import { ProCard } from '@ant-design/pro-components';

const { Title, Paragraph } = Typography;
const SystemInformation = () => {
  const [systemInfo, setSystemInfo] = useState<any>(null);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const response = await request('/system-info');
        if (response.success === 'true') {
          setSystemInfo(response.data);
        } else {
          message.error(response.message || 'Failed to fetch system information');
        }
      } catch (error) {
        message.error('Failed to fetch system information');
        console.error(error);
      }
    };

    fetchSystemInfo();
  }, []);

  return (
    <ProCard title="System Information" bordered>
      <Title level={3}>System Overview</Title>
      {systemInfo ? (
        <>
          <Card style={{ marginBottom: '16px' }}>
            <Title level={4}>Tech Stack</Title>
            <List
              size="small"
              bordered
              dataSource={[
                // columns of tables 
                `Document Root Folder: ${systemInfo.document_root_folder}`,
                `Laravel Version: ${systemInfo.laravel_version}`,
                `PHP Version: ${systemInfo.php_version}`,
                `IP Address: ${systemInfo.ip_address}`,
                `System Server Host: ${systemInfo.system_server_host}`,
                `System Version: ${systemInfo.system_version}`,
                `Application Environment: ${systemInfo.application_environment}`,
                `Database Type: ${systemInfo.database_type}`,
                `Database Version: ${systemInfo.database_version}`,
              ]}
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: '16px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    backgroundColor: '#fafafa',
                  }}
                >
                  {item}
                </List.Item>
              )}
              style={{ backgroundColor: '#ffffff' }}
            />
          </Card>
        </>
      ) : (
        <Paragraph>Loading system information...</Paragraph>
      )}
    </ProCard>
  );
};

export default SystemInformation;
