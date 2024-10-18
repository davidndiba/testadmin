import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, Button, Checkbox, Row, Col, message } from 'antd';
import { request } from 'umi';

const { Option } = Select;

const JobDetailsModal = ({ visible, onClose, jobDetails }) => {
  const [form] = Form.useForm();
  const [jobData, setJobData] = useState([]);
  const [jobStatuses, setJobStatuses] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchJobData();
      if (jobDetails) {
        form.setFieldsValue({
          jobNumber: jobDetails.jobNumber,
          bookedQuantity: jobDetails.booked_qty,
          capacity: jobDetails.capacity,
          comments: jobDetails.comments,
          jobStatus: jobDetails.schedule_status_id,
          needValidation: jobDetails.need_validation,
        });
      }
    }
  }, [visible, jobDetails, form]);

  const fetchJobData = async () => {
    try {
      const response = await request('/schedule-jobs');
      if (response.success) {
        setJobData(response.data);
      } else {
        message.error('Failed to fetch job data');
      }
    } catch (error) {
      console.error('Error fetching job data:', error);
      message.error('Error fetching job data');
    }
  };

  const fetchJobStatuses = async (jobTypeId) => {
    try {
      const response = await request(`/schedule-statuses/job-type/${jobTypeId}`);
      if (response.success) {
        setJobStatuses(response.data);
      } else {
        message.error('Failed to fetch job statuses');
      }
    } catch (error) {
      console.error('Error fetching job statuses:', error);
      message.error('Error fetching job statuses');
    }
  };

  return (
    <Modal
      visible={visible}
      title="Job Details"
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="jobNumber"
              label="Job Number"
              rules={[{ required: true, message: 'Job number is required!' }]}
            >
              <Select placeholder="Select a job" showSearch disabled>
                {jobData.map((job) => (
                  <Option key={job.id} value={job.jobNumber}>
                    {job.jobNumber} - {job.itemDetails}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="bookedQuantity"
              label="Booked Quantity"
              rules={[{ required: true, message: 'Booked quantity is required!' }]}
            >
              <Input placeholder="Enter booked quantity" readOnly />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="capacity"
              label="Capacity"
              rules={[{ required: true, message: 'Capacity is required!' }]}
            >
              <Input placeholder="Capacity" readOnly />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="comments" label="Comments">
              <Input.TextArea rows={4} placeholder="Additional comments (optional)" readOnly />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="jobStatus"
              label="Job Status"
              rules={[{ required: true, message: 'Job status is required!' }]}
            >
              <Checkbox.Group>
                {Array.isArray(jobStatuses) && jobStatuses.length > 0 ? (
                  jobStatuses.map((status) => (
                    <Checkbox key={status.id} value={status.id} disabled>
                      {status.name}
                    </Checkbox>
                  ))
                ) : (
                  <p>No job statuses available</p>
                )}
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name="needValidation" valuePropName="checked">
              <Checkbox disabled>Need Validation</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Close
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default JobDetailsModal;
