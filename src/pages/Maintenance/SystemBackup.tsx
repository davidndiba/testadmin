import React, { useState, useEffect } from 'react';
import { CloudUploadOutlined, ClockCircleOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Typography, Select, message, Table, Popconfirm } from 'antd';
import { request } from 'umi';
import { ProCard } from '@ant-design/pro-components';
import moment from 'moment';

const { Paragraph } = Typography;
const { Option } = Select;

const SystemBackup = () => {
  const [isBackupModalVisible, setIsBackupModalVisible] = useState(false);
  const [isScheduleBackupVisible, setIsScheduleBackupVisible] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<string>('weekly');
  const [backupHistory, setBackupHistory] = useState([]);

  // Fetch backup history
  const fetchBackupHistory = async () => {
    try {
      const response = await request('/backup/history', { method: 'GET' });
      setBackupHistory(response.data || []);
    } catch (error) {
      message.error('Failed to fetch backup history');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBackupHistory();
  }, []);

  const handleManualBackup = async () => {
    try {
      await request('/backup/manual', { method: 'POST' });
      message.success('Manual backup initiated successfully.');

      // Re-fetch the backup history after backup is done
      fetchBackupHistory();
    } catch (error) {
      message.error('Failed to initiate manual backup');
      console.error(error);
    }
    setIsBackupModalVisible(false);
  };

  const handleDownloadBackup = async (fileName: string) => {
    try {
      const response = await request(`/backup/download/${fileName}`, {
        method: 'GET',
        responseType: 'blob',
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); 
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error('Failed to download backup file');
      console.error(error);
    }
  };

  // Schedule backup based on selected frequency
  const handleScheduleBackup = async () => {
    try {
      await request('/backup/schedule', {
        method: 'POST',
        data: { frequency: selectedFrequency },
      });
      message.success('Backup scheduled successfully');
      setIsScheduleBackupVisible(false);
    } catch (error) {
      message.error('Failed to schedule backup');
      console.error(error);
    }
  };

  // Delete backup
  const handleDeleteBackup = async (fileName: string) => {
    try {
      await request(`/backups/${fileName}`, { method: 'DELETE' });
      message.success('Backup deleted successfully.');
      fetchBackupHistory();
    } catch (error) {
      message.error('Failed to delete backup');
      console.error(error);
    }
  };

  // Table columns with formatted date
  const columns = [
    {
      title: 'Backup Name',
      dataIndex: 'file_name',
      key: 'file_name',
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {/* <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadBackup(record.file_name)}
          >
            Download
          </Button> */}
          <Button
      type="primary"
      icon={<DownloadOutlined style={{ color: '#258F5E' }} />} // Set icon color
      onClick={() => handleDownloadBackup(record.file_name)}
      style={{
        color: '#258F5E', // Set text color
        background: 'transparent', // Remove default background
        border: 'none', // Remove border
        padding: '8px 24px', // Increase padding for larger button
        fontSize: '18px', // Increase font size
        lineHeight: '1.5', // Adjust line height if necessary
      }}
    >
      Download
    </Button>
          <Popconfirm
            title="Are you sure to delete this backup?"
            onConfirm={() => handleDeleteBackup(record.file_name)}
            okText="Yes"
            cancelText="No"
          >
            {/* <Button
              type="primary"
              icon={<DeleteOutlined />}
              danger
              style={{ color: '#ff4d4f' }}
            >
              Delete
            </Button> */}
            <Button
  type="primary"
  icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
  danger
  size="large" // Set button size to large
  style={{
    color: '#ff4d4f',
    background: 'transparent', // Remove default background
    border: 'none', // Remove border
    padding: '0 16px', // Adjust padding for larger button
    fontSize: '16px', // Increase font size
  }}
>
  Delete
</Button>

          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '10px', backgroundColor: '#fff' }}>
      <ProCard
        title="Data Backup"
        bordered
        extra={
          <Space>
            {/* <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={() => setIsBackupModalVisible(true)}
            >
              Start Manual Backup
            </Button> */}
             <Button
      type="primary"
      icon={<CloudUploadOutlined style={{ color: '#f22d55' }} />} // Set icon color
      onClick={() => setIsBackupModalVisible(true)}
      style={{
        color: '#f22d55', // Set text color
        background: 'transparent', // Remove default background
        border: 'none', // Remove border
        padding: '8px 24px', // Increase padding for larger button
        fontSize: '18px', // Increase font size
        lineHeight: '1.5', // Adjust line height if necessary
      }}
    >
      Start Manual Backup
    </Button>
            {/* <Button
              type="default"
              icon={<ClockCircleOutlined />}
              style={{ backgroundColor: '#1890ff', color: '#ffffff' }}
              onClick={() => setIsScheduleBackupVisible(true)}
            >
              Schedule Backup
            </Button> */}
             <Button
      type="primary"
      icon={<ClockCircleOutlined style={{ color: '#f22d55' }} />} // Set icon color
      onClick={() => setIsBackupModalVisible(true)}
      style={{
        color: '#f22d55', // Set text color
        background: 'transparent', // Remove default background
        border: 'none', // Remove border
        padding: '8px 24px', // Increase padding for larger button
        fontSize: '18px', // Increase font size
        lineHeight: '1.5', // Adjust line height if necessary
      }}
    >
      Schedule Backup
    </Button>
          </Space>
        }
      >
        {/* Backup History Table */}
        <Table
          dataSource={backupHistory}
          columns={columns}
          rowKey="file_name"
          pagination={false}
          bordered
        />
      </ProCard>

      {/* Manual Backup Modal */}
      <Modal
        title="Confirm Data Backup"
        visible={isBackupModalVisible}
        onOk={handleManualBackup}
        onCancel={() => setIsBackupModalVisible(false)}
      >
        <Paragraph>
          Are you sure you want to start the manual data backup process? This may take some time
          depending on the size of your data.
        </Paragraph>
      </Modal>

      {/* Schedule Backup Modal */}
      <Modal
        title="Schedule Data Backup"
        visible={isScheduleBackupVisible}
        onOk={handleScheduleBackup}
        onCancel={() => setIsScheduleBackupVisible(false)}
      >
        <Paragraph>Select how often you want to schedule the backup:</Paragraph>
        <Select
          value={selectedFrequency}
          onChange={(value) => setSelectedFrequency(value)}
          style={{ width: '100%' }}
        >
          <Option value="daily">Daily</Option>
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
          <Option value="yearly">Yearly</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default SystemBackup;
