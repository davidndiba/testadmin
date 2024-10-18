import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, message } from 'antd';
import { request } from '@umijs/max';

const { Option } = Select;

const ChangeStatusModal = ({ visible, onClose, selectedJob, onStatusChange }) => {
  const [form] = Form.useForm();
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    // Fetch status options from API when the modal is opened
    if (visible) {
      request('/status-options')
        .then((res) => {
          setStatusOptions(res.data);
          // Set the form field with the current status
          form.setFieldsValue({ status: selectedJob?.schedule_status_id });
        })
        .catch((error) => {
          console.error('Error fetching status options:', error);
          message.error('Failed to load status options');
        });
    }
  }, [visible, selectedJob, form]);

  const handleSubmit = async (values) => {
    try {
      await request(`/schedules/${selectedJob.schedule_job_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schedule_status_id: values.status }),
      });
      message.success('Job status updated successfully');
      onStatusChange(); // Refresh or update status in parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating job status:', error);
      message.error('Failed to update job status');
    }
  };

  return (
    <Modal
      title="Change Job Status"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Select placeholder="Select a status">
            {statusOptions.map((status) => (
              <Option key={status.id} value={status.id}>
                {status.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Change Status
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangeStatusModal;
