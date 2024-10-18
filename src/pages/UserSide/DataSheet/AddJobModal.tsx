// import React, { useEffect, useState } from 'react';
// import { Modal, Form, Select, Input, Button, Checkbox, Row, Col, message } from 'antd';
// import { request } from 'umi';

// const { Option } = Select;

// const AddJobModal = ({ visible, onCancel, onOk, selectedCell, onAddJob }) => {
//   const [form] = Form.useForm();
//   const [jobData, setJobData] = useState([]);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [schedules, setSchedules] = useState([]);
//   const [jobStatuses, setJobStatuses] = useState([]);
//   const [jobForms, setJobForms] = useState([{}]);
//   const [jobSelected, setJobSelected] = useState(false);

//   useEffect(() => {
//     if (visible) {
//       fetchJobData();
//       fetchSchedules();
//     }
//     return () => {
//       form.resetFields();
//       setSelectedJob(null);
//       setJobForms([{}]);
//       setJobStatuses([]);
//       setJobSelected(false);
//     };
//   }, [visible, form]);

//   const fetchJobData = async () => {
//     try {
//       const response = await request('/schedule-jobs');
//       if (response.success) {
//         const jobs = response.data.map(job => ({
//           key: job.id,
//           jobNumber: job.job_number,
//           itemDetails: job.description,
//           capacity: job.capacity,
//           jobType: job.job_type_id,
//           jobArea: job.job_area,
//         }));
//         setJobData(jobs);
//       } else {
//         message.error('Failed to fetch job data');
//       }
//     } catch (error) {
//       console.error('Error fetching job data:', error);
//       message.error('Error fetching job data');
//     }
//   };

//   const fetchSchedules = async () => {
//     try {
//       const response = await request('/schedules');
//       if (response.success) {
//         setSchedules(response.data.data);
//       } else {
//         message.error('Failed to fetch schedules');
//       }
//     } catch (error) {
//       console.error('Error fetching schedules:', error);
//       message.error('Error fetching schedules');
//     }
//   };

//   const fetchJobStatuses = async (jobTypeId) => {
//     try {
//       const response = await request(`/schedule-statuses/job-type/${jobTypeId}`);
//       if (response.success) {
//         setJobStatuses(response.data);
//       } else {
//         message.error('Failed to fetch job statuses');
//       }
//     } catch (error) {
//       console.error('Error fetching job statuses:', error);
//       message.error('Error fetching job statuses');
//     }
//   };

//   const handleFinish = async (values) => {
//     const selectedSlotData = selectedCell;
//     if (!selectedSlotData) {
//       message.error('No selected slot data available.');
//       return;
//     }

//     const payloads = jobForms.map((_, index) => ({
//       schedule_job_id: selectedJob?.key || '',
//       job_line_id: selectedSlotData?.job_line_id,
//       shift_id: selectedSlotData?.shift_id,
//       schedule_date: selectedSlotData.schedule_date || new Date().toISOString(),
//       schedule_status_id: values[`jobStatus_${index}`]?.[0],
//       booked_qty: values[`bookedQuantity_${index}`],
//       capacity: values[`capacity_${index}`] || selectedSlotData.capacity,
//       comments: values[`comments_${index}`],
//       schedule_time: selectedSlotData.schedule_time || values.schedule_time,
//       need_validation: values[`needValidation_${index}`] || false,
//     }));

//     try {
//       const promises = payloads.map(payload =>
//         request('/schedules', {
//           method: 'POST',
//           data: payload,
//         })
//       );
//       await Promise.all(promises);

//       message.success('Jobs added successfully');
//       onAddJob(payloads);
//       onOk(values);
//       form.resetFields();
//       setSelectedJob(null);
//       fetchSchedules();
//       return true;
//     } catch (error) {
//       console.error('Error submitting job:', error);
//       message.error('Failed to submit jobs');
//     }
//   };

//   const handleJobNumberChange = (value, index) => {
//     const job = jobData.find(job => job.jobNumber === value);
//     setSelectedJob(job);
//     if (job) {
//       form.setFieldsValue({
//         [`capacity_${index}`]: job.capacity,
//         [`jobType_${index}`]: job.jobType,
//         [`jobArea_${index}`]: job.jobArea,
//       });
//       fetchJobStatuses(job.jobType);
//       setJobSelected(true);
//     }
//   };

//   const addNewJobForm = () => {
//     setJobForms([...jobForms, {}]);
//   };

//   return (
//     <Modal
//       visible={visible}
//       title="Add Job"
//       onCancel={onCancel}
//       footer={null}
//       width={600}
//     >
//       <Form form={form} onFinish={handleFinish} layout="vertical">
//         {jobForms.map((_, index) => (
//           <div key={index} style={{ marginBottom: '24px' }}>
//             {/* Display selected slot information */}
//             {selectedCell && (
//               <div style={{ marginBottom: '16px' }}>
//                 <strong>Job Line ID:</strong> {selectedCell?.job_line_name}<br />
//                 <strong>Shift ID:</strong> {selectedCell.shift_id}<br />
//                 <strong>Schedule Date:</strong> {selectedCell.schedule_date}
//               </div>
//             )}

//             <Row gutter={24}>
//               <Col span={12}>
//                 <Form.Item
//                   name={`jobNumber_${index}`}
//                   label="Job Number"
//                   rules={[{ required: true, message: 'Please select a job number!' }]}
//                 >
//                   <Select
//                     placeholder="Search for a job"
//                     onChange={(value) => handleJobNumberChange(value, index)}
//                     showSearch
//                     filterOption={(input, option) => {
//                       const optionLabel = option.children instanceof Array ? option.children[0] : option.children;
//                       return optionLabel && optionLabel.toLowerCase().indexOf(input.toLowerCase()) >= 0;
//                     }}
//                     style={{ width: '100%' }}
//                   >
//                     {jobData.map((job) => (
//                       <Option key={job.key} value={job.jobNumber}>
//                         {job.jobNumber} - {job.itemDetails}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>
//             </Row>

//             {jobSelected && (
//               <>
//                 <Row gutter={24}>
//                   <Col span={12}>
//                     <Form.Item
//                       name={`bookedQuantity_${index}`}
//                       label="Booked Quantity"
//                       rules={[{ required: true, message: 'Please enter booked quantity!' }]}
//                     >
//                       <Input placeholder="Enter booked quantity" />
//                     </Form.Item>
//                   </Col>
//                 </Row>

//                 <Row gutter={24}>
//                   <Col span={12}>
//                     <Form.Item
//                       name={`capacity_${index}`}
//                       label="Capacity"
//                       rules={[{ required: true, message: 'Please enter capacity!' }]}
//                     >
//                       <Input placeholder="Enter capacity" readOnly />
//                     </Form.Item>
//                   </Col>
//                 </Row>

//                 <Row gutter={24}>
//                   <Col span={12}>
//                     <Form.Item name={`comments_${index}`} label="Comments">
//                       <Input.TextArea rows={4} placeholder="Additional comments (optional)" />
//                     </Form.Item>
//                   </Col>
//                 </Row>

//                 <Row gutter={24}>
//                   <Col span={24}>
//                     <Form.Item
//                       name={`jobStatus_${index}`}
//                       label="Job Status"
//                       rules={[{ required: true, message: 'Please select a job status!' }]}
//                     >
//                       <Checkbox.Group
//                         value={form.getFieldValue(`jobStatus_${index}`)}
//                         onChange={(checkedValue) => {
//                           const selectedStatus = checkedValue.length ? [checkedValue[checkedValue.length - 1]] : [];
//                           form.setFieldsValue({ [`jobStatus_${index}`]: selectedStatus });
//                         }}
//                       >
//                         {Array.isArray(jobStatuses) && jobStatuses.length > 0 ? (
//                           jobStatuses.map((status) => (
//                             <Checkbox key={status?.id} value={status?.id}>
//                               {status.name}
//                             </Checkbox>
//                           ))
//                         ) : (
//                           <p>No job statuses available</p>
//                         )}
//                       </Checkbox.Group>
//                     </Form.Item>
//                   </Col>
//                 </Row>

//                 <Row gutter={24}>
//                   <Col span={24}>
//                     <Form.Item name={`needValidation_${index}`} valuePropName="checked">
//                       <Checkbox>Need Validation</Checkbox>
//                     </Form.Item>
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </div>
//         ))}

//         <div style={{ textAlign: 'left' }}> {/* Align buttons to the left */}
//           <Button onClick={onCancel} style={{ marginRight: 8 }}>
//             Cancel
//           </Button>
//           <Button type="primary" htmlType="submit">
//             Submit
//           </Button>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

// export default AddJobModal;
import React, { useEffect, useState } from "react";
import {
  Form,
  Select,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  message,
} from "antd";
import { request } from "umi";

const { Option } = Select;

const AddJobModal = ({ visible, onCancel, selectedCell, onAddJob }) => {
  const [form] = Form.useForm();
  const [jobData, setJobData] = useState([]); // Available jobs
  const [selectedJob, setSelectedJob] = useState(null); // Selected job details
  const [jobStatuses, setJobStatuses] = useState([]); // Job statuses based on job type

  // Fetch available jobs and schedules when the modal becomes visible
  useEffect(() => {
    if (visible) {
      fetchJobData();
      if (selectedCell?.schedule_job_id) {
        fetchJobStatuses(selectedCell.schedule_job_id);
      }
    }
    return () => {
      form.resetFields();
      setSelectedJob(null);
      setJobStatuses([]);
    };
  }, [visible, selectedCell]);

  // Fetch Available Jobs
  const fetchJobData = async () => {
    try {
      const response = await request("/schedule-jobs");
      if (response.success) {
        setJobData(response.data.map((job) => ({
          key: job.id,
          jobNumber: job.job_number,
          itemDetails: job.description,
          capacity: job.capacity,
          jobType: job.job_type_id,
          jobArea: job.job_area,
        })));
      } else {
        message.error("Failed to fetch job data");
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
      message.error("Error fetching job data");
    }
  };

  // Fetch Job Statuses based on Job Type
  const fetchJobStatuses = async (jobTypeId) => {
    try {
      const response = await request(`/schedule-statuses/job-type/${jobTypeId}`);
      if (response.success) {
        setJobStatuses(response.data);
      } else {
        message.error("Failed to fetch job statuses");
      }
    } catch (error) {
      console.error("Error fetching job statuses:", error);
      message.error("Error fetching job statuses");
    }
  };

  // Handle Job Number Selection
  const handleJobNumberChange = (value) => {
    const job = jobData.find((job) => job.jobNumber === value);
    setSelectedJob(job);
    if (job) {
      form.setFieldsValue({
        capacity: job.capacity,
      });
      fetchJobStatuses(job.jobType);
    }
  };

  // Handle Form Submission
  const handleFinish = async (values) => {
    if (!selectedCell || !selectedCell.job_line_id || !selectedCell.shift_id) {
      message.error("No selected slot data available.");
      return;
    }

    const payload = {
      schedule_job_id: selectedJob?.key || "",
      job_line_id: selectedCell.job_line_id,
      shift_id: selectedCell.shift_id,
      schedule_date: selectedCell.schedule_date, // Already in YYYY-MM-DD format
      schedule_status_id: values.jobStatus,
      booked_qty: values.booked_qty,
      capacity: selectedJob?.capacity || values.capacity,
      comments: values.comments,
      need_validation: values.need_validation || false,
    };

    try {
      await onAddJob(payload);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting job:", error);
      message.error("Failed to submit job");
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="vertical"
      initialValues={{
        capacity: selectedCell?.capacity || "",
        booked_qty: selectedCell?.booked_qty || "",
        comments: selectedCell?.comments || "",
        need_validation: selectedCell?.need_validation || false,
      }}
    >
      {/* Display Selected Slot Information */}
      {selectedCell && (
        <div style={{ marginBottom: "16px" }}>
          <strong>Job Line:</strong> {selectedCell.job_line_name}
          <br />
          <strong>Shift:</strong> {selectedCell.shift_id}
          <br />
          <strong>Schedule Date:</strong> {selectedCell.schedule_date}
        </div>
      )}

      {/* Job Number Selection */}
      <Form.Item
        name="jobNumber"
        label="Job Number"
        rules={[{ required: true, message: "Please select a job number!" }]}
      >
        <Select
          placeholder="Select Job Number"
          onChange={handleJobNumberChange}
          showSearch
          filterOption={(input, option) =>
            option.children
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {jobData.map((job) => (
            <Option key={job.key} value={job.jobNumber}>
              {job.jobNumber} - {job.itemDetails}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Booked Quantity */}
      <Form.Item
        name="booked_qty"
        label="Booked Quantity"
        rules={[{ required: true, message: "Please enter booked quantity!" }]}
      >
        <Input placeholder="Enter booked quantity" />
      </Form.Item>

      {/* Capacity (Read-Only) */}
      <Form.Item
        name="capacity"
        label="Capacity"
        rules={[{ required: true, message: "Please enter capacity!" }]}
      >
        <Input placeholder="Capacity" readOnly />
      </Form.Item>

      {/* Comments */}
      <Form.Item name="comments" label="Comments">
        <Input.TextArea rows={4} placeholder="Additional comments (optional)" />
      </Form.Item>

      {/* Job Status */}
      <Form.Item
        name="jobStatus"
        label="Job Status"
        rules={[{ required: true, message: "Please select a job status!" }]}
      >
        <Select
          placeholder="Select Job Status"
          disabled={!jobStatuses.length}
        >
          {jobStatuses.map((status) => (
            <Option key={status.id} value={status.id}>
              {status.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Need Validation */}
      <Form.Item name="need_validation" valuePropName="checked">
        <Checkbox>Need Validation</Checkbox>
      </Form.Item>

      {/* Form Actions */}
      <Form.Item>
        <Row justify="end">
          <Col>
            <Button onClick={onCancel} style={{ marginRight: "8px" }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default AddJobModal;
