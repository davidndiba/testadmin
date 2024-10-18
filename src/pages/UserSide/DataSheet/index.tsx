import { Card, Space, Table, Row, Col, Select, Input, Typography, DatePicker, Tabs, Modal, Button, Form, Checkbox, message, Tooltip, Dropdown, Menu } from 'antd';
import { request, useRequest } from '@umijs/max';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const DataSheet = () => {
  const [existingJobs, setExistingJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState(null); 
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('isoWeek'));
  const [jobType, setJobType] = useState<any>();
  const [jobAreaPid, setJobAreaPid] = useState<any>(null);
  const [jobAreas, setJobAreas] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null); 
  const [form] = Form.useForm();
  const [jobData, setJobData] = useState<any[]>([]);
  const [jobStatuses, setJobStatuses] = useState([]);
  const [clickedSchedule, setClickedSchedule] = useState<any>(null);
  const [selectedJobLineId, setSelectedJobLineId] = useState(null);
  const [selectedScheduleJobId, setSelectedScheduleJobId] = useState(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [slotJobs, setSlotJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobDetails, setSelectedJobDetails] = useState<any>(null);
  const [isCustomModalVisible, setIsCustomModalVisible] = useState(false);
  const [isAnotherModalVisible, setIsAnotherModalVisible] = useState(false);
  const [isJobEditModalVisible, setIsJobEditModalVisible] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState<string>('1'); // Track the active tab
  // const [isAddJobModalVisible, setIsAddJobModalVisible] = useState(false); // State for AddNewJobModal visibility
  // Load job types on mount
  const { data: jobTypes, loading: jobTypesLoading } = useRequest(() =>
    request('/job-types').then((res) => ({ data: res?.data?.data }))
  );
  // Fetch job areas when the job type is changed
  const fetchJobAreas = async (jobTypeId: string) => {
    const res = await request(`/job-types/${jobTypeId}`);
    if (res?.data?.job_areas) {
      setJobAreas(res?.data?.job_areas);
      setJobAreaPid(res?.data?.job_areas[0]?.id);  
    }
  };
  // Fetch job lines for the selected job area
  const { data: jobLines, loading: jobLinesLoading } = useRequest(
    async () => {
      if (!jobAreaPid) return;
      return await request(`/job-areas/${jobAreaPid}`).then((res) => ({
        data: res?.data?.job_lines,
      }));
    },
    { refreshDeps: [jobAreaPid] }
  );
  const { data: shiftsFromApi } = useRequest(() =>
        request('/shifts').then((res) => ({ data: res?.data?.data })),
      );
  const { data, loading } = useRequest(() =>
        request('/schedules').then((res) => ({ data: res?.original?.data })),
      );
  // Transform the schedule data for the table display
  const transformData = (schedules: any) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday'];
    const shifts = Array.isArray(shiftsFromApi) ? shiftsFromApi?.map((shift) => shift?.name) : [];
    const transformedData: any[] = [];
    daysOfWeek.forEach((day, dayIndex) => {
            shifts?.forEach((shift) => {
              const date = moment(currentWeek).add(dayIndex, 'days');
        const schedulesForDayShift = schedules?.filter(
                    (s: any) =>
                      moment(s?.schedule_date).isSame(date, 'day') &&
                      s.shift_name === shift,
                  );
        transformedData.push({
          key: `${day}-${shift}`,
          day: date,
          shift,
          jobs: schedulesForDayShift?.map((schedule: any) => ({
            id: schedule?.schedule_job_id,
            // job_count: schedule?.booked_qty,
            job_description: schedule?.job_description,
            booked_qty: schedule?.booked_qty,
            schedule_job_number: schedule?.schedule_job_number,
            schedule_status_name: schedule?.schedule_status_name,
            job_line_id: schedule?.job_line_id,
            job_validation_required: schedule.job_validation_required ? 1 : 0 , 
            // need_validation: schedule.need_validation,
            bgColor: schedule?.status_background_color,
            textColor: schedule?.status_text_color,
          })),
        });
      });
    });

    return transformedData;
  };
 // Fetch job details and set the modal visibility
 const fetchJobDetails = async (jobId: string) => {
  try {
    const response = await request(`/schedule-jobs/${jobId}`);
    if (response.success) {
      setSelectedJob(response.data); // Update state with the fetched job details
      console.log("Job details:", response.data);
      
      // Set form fields with fetched job data
      form.setFieldsValue({
        job_number: response.data.job_number,
        description: response.data.description,
        capacity: response.data.capacity,
        yield_qty: response.data.yield_qty,
        produced_qty: response.data.produced_qty,
        job_status: response.data.job_status,
        validation: response.data.validation,
      });

      // Open the modal
      setIsJobEditModalVisible(true)
      setIsCustomModalVisible(true);
    } else {
      message.error("Failed to fetch job details");
    }
  } catch (error) {
    console.error("Error fetching job details:", error);
    message.error("Error fetching job details");
  }
};

// Handle job selection
const handleJobSelect = (value: string) => {
  setSelectedJob(value); // Set selected job
  fetchJobDetails(value); // Fetch job details
};
// const handleEditJobSubmit = async (values) => {
//   try {
//     const response = await request(`/schedule-jobs/${selectedJob.id}`, {
//       method: 'PUT',
//       data: values, // Send the updated job details
//     });
//     if (response.success) {
//       message.success("Job updated successfully");
//       setIsJobEditModalVisible(false); // Close the modal
//       fetchJobData(); // Refresh job data
//     } else {
//       message.error("Failed to update job");
//     }
//   } catch (error) {
//     console.error("Error updating job:", error);
//     message.error("Error updating job");
//   }
// };
const handleEditJobSubmit = async (values) => {
  if (!selectedJob) return; // Ensure selectedJob is not null

  try {
    const response = await request(`/schedule-jobs/${selectedJob.id}`, {
      method: 'PUT',
      data: values, // Send the updated job details
    });
    if (response.success) {
      message.success("Job updated successfully");
      setIsJobEditModalVisible(false); // Close the modal
      fetchJobData(); // Refresh job data
    } else {
      message.error("Failed to update job");
    }
  } catch (error) {
    console.error("Error updating job:", error);
    message.error("Error updating job");
  }
};

  useEffect(() => {
    fetchJobData(); // Fetch job data on mount
  }, []);
   // Handle the tab change
   const handleTabChange = (key: string) => {
    setActiveTabKey(key);
    // Optionally, you can trigger different data fetches based on the tab here
    console.log(`Active tab: ${key}`);
  };
  const handleJobLineSelection = (value) => {
    setSelectedJobLineId(value); // Set job_line_id based on selection
  };
 // Handle Job Type Change (Dropdown)
  const handleJobTypeChange = (value: string) => {
    setJobType(value);
    fetchJobAreas(value); // Fetch the corresponding job areas
  };
  useEffect(() => {
    fetchJobData();  // Fetch job data when the component mounts or jobType changes
  }, [jobType]);  // Add jobType to the dependency array to refetch if jobType changes
  useEffect(() => {
    const fetchData = async () => {
      const res = await request('/schedules');
      const transformedSchedules = transformData(res?.data);
      setTableData(transformedSchedules)
      // setData(transformedSchedules);  // Update transformed data
    };
    fetchData();
  }, [currentWeek, data]);  // Add currentWeek dependency to refetch data when the week changes
  const fetchJobData = async () => {
    try {
      const response = await request("/schedule-jobs");
      console.log("Job Data Response:", response); 
      if (response.success) {
        setJobData(
          response.data.map((job) => ({
            key: job.id,
            jobNumber: job.job_number,
            itemDetails: job.description,
            capacity: job.capacity,
            jobType: job.job_type_id,
            jobArea: job.job_area,
          }))
        );
      } else {
        message.error("Failed to fetch job data");
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
      message.error("Error fetching job data");
    }
  }; 
  const showCustomModal = () => {
  setIsCustomModalVisible(true);
};

// To close the modal
const handleCustomModalCancel = () => {
  setIsCustomModalVisible(false);
};
    // Handle search
    const handleSearch = async (value: string) => {
      setSearchTerm(value); // Update search term state
      try {
        const response = await request(`/schedule-jobs`, {
          params: { search: value }, // Pass the search parameter
        });
        if (response.success) {
          setJobData(
            response.data.map((job) => ({
              key: job.id,
              jobNumber: job.job_number,
              itemDetails: job.description,
              capacity: job.capacity,
              jobType: job.job_type_id,
              jobArea: job.job_area,
            }))
          );
        } else {
          message.error("No jobs found");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        message.error("Error fetching search results");
      }
    };
  
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
  const handleJobNumberChange = (value) => {
    const job = jobData.find((job) => job.jobNumber === value);
    setSelectedJob(job);
    if (job) {
      form.setFieldsValue({
        // capacity: job.capacity,
        capacity: selectedJob?.capacity || 'default capacity value', 
      });
      setSelectedScheduleJobId(job.key);
      fetchJobStatuses(job.jobType);
    }
  };
  const fetchSlotJobs = async (params:any) => {
    try {
      // Construct the endpoint URL with the required parameters
     
      const response = await request(`/schedules`,{params}); 
      setSelectedJob(response?.original?.data);
      console.log(response);
    } catch (error) {
      console.error('Error fetching slot jobs:', error);
      message.error('Error fetching slot jobs');
    }
  };
  const menu = (
    <Menu>
       <Menu.Item key="2" onClick={() => {
      // setSelectedJobForStatusChange(selectedSlot); // assuming selectedSlot is the currently selected job
      // setChangeStatusModalVisible(true);
    }}>
      Change Job Status
    </Menu.Item>
      <Menu.Item key="3" disabled>
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">Reschedule (disabled)</a>
        </Menu.Item>
    </Menu>
  );
  // Columns for the job line
  const columns = [
    {
            title: 'Day',
            dataIndex: 'day',
            render: (text: string, record: any, index: number) => {
              const rowSpan = index % 2 === 0 ? 2 : 0;
              return {
                children: <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold' }}>{moment(text).format('dddd')}</div>
                <div>{moment(text).format('ll')}</div>
              </div>,

                props: {
                  rowSpan,
                },
              };
            },
          },
          {
            title: 'Shift',
            dataIndex: 'shift',
          },
  ...(jobLines?.length
          ? jobLines?.map((job: any) => ({
              title: job?.name,
              dataIndex: 'jobs',
              width: 300,
              render: (jobs: any, record: any) => {
                const filteredJobs = jobs?.filter((j: any) => j?.job_line_id === job?.id);
                const getShiftId = shiftsFromApi?.find(
                  (shift: any) => shift?.name === record?.shift,
                );
                return (
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: '100%' }}
                  >
                    <ModalForm 
                      title={
                        <>
                          You are viewing{' '}
                          <span style={{ color: clickedSchedule?.textColor }}>
                            {clickedSchedule?.job_description}
                          </span>
                        </>
                      }
                      submitter={{searchConfig:{
                        submitText:'Save Schedule',
                        resetText:'cancel',
                      }}}
                      trigger={
<div style={{ cursor: 'pointer' }}>
{filteredJobs.length > 0 ? (
                <Button
                  type="primary"
                  style={{
                    backgroundColor: '#4CAF50',
                    borderColor: '#4CAF50',
                    color: '#fff',
                    padding: '10px 0',
                    fontWeight: 'bold',
                    width: '80%',
                    textAlign: 'center',
                    display: 'block',
                  }}
                  onClick={() => {
                    console.log('Selected job:', job?.id,getShiftId?.id,moment(record?.day).format('YYYY-MM-DD'));
                    // Handle adding a new job
                    setSelectedSlot(job);
                    setExistingJobs(record.jobs);
                    fetchSlotJobs({schedule_date:moment(record?.day).format('YYYY-MM-DD'),shift:getShiftId?.id,job_line:job?.id});
                    setIsModalVisible(true);
                    // handleAddJobModalClick(record)
                  }}
                >
                  Add New Job
                </Button>
              ): null
              }
  {jobs
    ?.filter((j: any) => j?.job_line_id === job?.id)
    ?.map((job: any) => (
<Card
  key={job?.id}
  size="small"
  style={{
    background: job?.bgColor || 'transparent',
    width: '80%',
    color: job?.status_text_Color,
    borderRadius: 5,
    marginBottom: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    maxHeight:'90px',
    padding: '2px 4px', 
    minHeight: '30px', 
  }}
  onClick={() => {
    setClickedSchedule(job);
    setSelectedSlot(job);
  }}
>
  <div style={{ textAlign: 'center' }}>
  <Button
          type="link"
          style={{ fontWeight: 'bold', color: '#000', fontSize: '12px' }}
        >
          {job?.schedule_job_number} 
        </Button>
    <Tooltip title={job.job_description} placement="top">
      <div style={{ 
          color: 'grey', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          maxWidth: '150px', 
          fontSize: '12px' 
      }}>
        {job.job_description.split(' ').slice(0, 3).join(' ') + (job.job_description.split(' ').length > 3 ? '...' : '')}
      </div>
    </Tooltip>

    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
      {/* Status Name */}
      <div style={{ color: job?.statusColor || '#000', fontSize: '12px' }}> {/* Reduce font size */}
        {job?.schedule_status_name}
      </div>

      {/* More Details Button */}
      <Button
        onClick={() => fetchJobDetails(job.id)}
        type="link"
        style={{
          color: '#ff5733',
          padding: '0', // Remove padding
          display: 'flex',
          alignItems: 'center',
          fontSize: '12px', // Reduce font size
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 1024 1024"
          style={{ fill: 'currentColor', marginRight: '4px' }}
        >
          <path d="M512 100c-227 0-412 185-412 412s185 412 412 412 412-185 412-412S739 100 512 100zm0 736c-179 0-324-145-324-324S333 188 512 188s324 145 324 324-145 324-324 324zm-75-387h150v150H437V449zm150 277h-150v-54h150v54z" />
        </svg>
        More
      </Button>
    </div>

    {/* Dropdown Menu */}
    <Dropdown overlay={menu} trigger={['click']}>
      <div
        style={{
          position: 'absolute',
          top: '12px', // Adjusted to reduce vertical height
          right: '12px',
          cursor: 'pointer',
        }}
        aria-label="More options"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 1024 1024"
          style={{
            fill: 'currentColor',
            fontSize: '1.5em',
          }}
        >
          <path d="M456 231a56 56 0 1 0 112 0a56 56 0 1 0-112 0m0 280a56 56 0 1 0 112 0a56 56 0 1 0-112 0m0 280a56 56 0 1 0 112 0a56 56 0 1 0-112 0" />
        </svg>
      </div>
    </Dropdown>
    {job.job_validation_required === 1 && (
    <div style={{ position: 'absolute', top: '5px', left: '5px', color: '#FFD700' ,fontSize: '24px'}}>★</div>
  )}
  </div>
</Card>   
    ))}
</div>
}
onFinish={async (values: any) => {
  console.log(values);
  // Do your POST here for Adding a new job
  const formattedScheduleDate = moment(values.schedule_date).format('YYYY-MM-DD');
  try {
    await request('/schedules', {
      method: 'POST',
      data: {
        ...values,
        job_line_id: job?.id, // Include the job_line_id
        schedule_job_id: selectedScheduleJobId,
        shift_id: getShiftId?.id,
        job_validation_required: values.job_validation_required ? 1 : 0,
        schedule_date: formattedScheduleDate,
        capacity: selectedJob?.capacity || values.capacity,
      },
    })   
    console.log({
      job_line_id: selectedJobLineId,
      schedule_job_id: selectedScheduleJobId,
      shift_id: getShiftId?.id,
      schedule_date: record?.day,
      capacity: selectedJob?.capacity || values.capacity,
    });
    const updatedSchedules = await request('/schedules'); // Refetch the schedules data
    const transformedSchedules = transformData(updatedSchedules?.data);
    setJobData(updatedSchedules?.data);
    setTableData(transformedSchedules)
    data(transformedSchedules);
    // you have success MESSAGE here and REFRESH the schedules on the table i.e
    message.success('Job added successfully');
    // this keeps modal open when success
    setIsModalVisible(false);
    return true;
  } catch (error) {
    // this keeps modal open when there is an error
    return false;
  }
}}
// onVisibleChange={(visible) => setIsModalVisible(visible)}
onVisibleChange={async (visible) => {
  setIsModalVisible(visible);
  if (visible && selectedJobLineId) {
      const selectedJob = jobData.find((job) => job.id === selectedJobLineId);
      if (selectedJob) {
          await fetchJobStatuses(selectedJob.jobType); // Make sure to pass the job type ID
      }
  }
}}
>
{/* Replace here with content for the form i.e Job Number, booked qty, ...rest */}
{/* <ProFormText name="name" label="Job Number" /> */}
<ProForm>
      <Row gutter={24}>
          <Col span={8}>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    {existingJobs?.map((job) => (
      <Button 
        key={job?.id}
        type="default"
        style={{ 
          marginBottom: '10px', 
          width: '150px', 
          backgroundColor: 'white', // White background
          color: 'black',            // Black text
          fontWeight: 'bold',        // Bold text
          // border: '1px solid #d9d9d9', // Border for a clean look
        }}
        onClick={() => fetchJobDetails(job?.id)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#d9d9d9'; // Grey background on hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white'; // Reset to white on leave
        }}
      >
        Job #: {job?.schedule_job_number}
      </Button>
    ))}
  </div>
</Col>
        {/* Form fields on the right side */}
        <Col span={16}>
        {/* <Col span={12}> */}
            {/* Tabs Section */}
            <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
              <Tabs.TabPane tab="Other Schedules" key="1">
                {/* Data for Other Schedules */}
                {selectedSlot?.other_schedules?.map((schedule: any) => (
                  <Card key={schedule.id}>
                    <p>{schedule.name}</p>
                  </Card>
                ))}
              </Tabs.TabPane>
              
              <Tabs.TabPane tab="Bulk/Pack Jobs" key="2">
                {/* Data for Bulk/Pack Jobs */}
                <p>Bulk or Pack jobs data here...</p>
              </Tabs.TabPane>
              
              <Tabs.TabPane tab="Logs" key="3">
                {/* Data for Logs */}
                <p>Logs data here...</p>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Comments" key="4">
                {/* Data for Comments */}
                {selectedSlot?.comments?.map((comment: any) => (
                  <Card key={comment.id}>
                    <p>{comment.text}</p>
                  </Card>
                ))}
              </Tabs.TabPane>
            </Tabs>
          {/* </Col> */}
          <ProFormText name="job_number" label="Job Number">
            <Select
              placeholder="Select Job Number"
              onChange={handleJobNumberChange}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {jobData?.length > 0 ? (
                jobData.map((job) => (
                  <Option key={job.key} value={job.jobNumber}>
                    {job.jobNumber} - {job.itemDetails}
                  </Option>
                ))
              ) : (
                <p>No jobs available</p>
              )}
            </Select>
          </ProFormText>

          <ProFormText name="booked_qty" label="Booked Quantity" />
          <ProFormText
            name="capacity"
            label="Capacity"
            value={selectedJob?.capacity}
            disabled={true}
          />
          <ProFormText name="comments" label="Comments" />

          <Form.Item name="schedule_status_id" label="Job Status">
            <Select>
              {jobStatuses.map((status) => (
                <Option key={status.id} value={status.value}>
                  {status.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="job_validation_required"
            valuePropName="checked"
          >
            <Checkbox>Need Validation</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </ProForm>
                   
                    </ModalForm>
                    {jobs?.filter((j: any) => j?.job_line_id === job?.id)?.length <=
                      3 && (
                      <ModalForm
                        title="Add Job"
                        submitter={{
                          searchConfig: {
                            submitText: 'Add Job',
                            resetText: 'Cancel',
                          },
                        }}
                        trigger={
<Card
      style={{ width: '80%', borderRadius: 0, cursor: 'pointer',height:'40px',display:'flex',justifyContent:'center',alignItems:'center',padding:'0' }}
      onClick={() => {
        setSelectedJobLineId(job?.id); // Update the selected job line
        const selectedShift = shiftsFromApi?.find(
          (shift) => shift.name === record?.shift
        );
        const selectedScheduleDate = moment(record?.day).format('YYYY-MM-DD'); // Capture the schedule date
        setClickedSchedule({
          job_line_id: job?.id,
          shift_id: selectedShift?.id,
          schedule_date: selectedScheduleDate,
          job_description: job?.job_description,
          // need_validation: job?.need_validation,
        });
        setIsModalVisible(true); // Open the modal
      }}
    >
      FREE
    </Card>
                        }
                        onFinish={async (values: any) => {
                          console.log(values);
    
                          // const getShiftId = shiftsFromApi?.find(
                          //   (shift: any) => shift?.name === record?.shift,
                          // );
                          // // you have the day here with the standard format
                          console.log(moment(record?.day).format('YYYY-MM-DD'));
    
                          // // you have the shift id here
                          console.log(getShiftId?.id);
    
                          // Do your POST here for Adding a new job
                          
                          const formattedScheduleDate = moment(values.schedule_date).format('YYYY-MM-DD');
                          try {
                            await request('/schedules', {
                              method: 'POST',
                              data: {
                                ...values,
                                job_line_id: selectedJobLineId, // Include the job_line_id
                                schedule_job_id: selectedScheduleJobId,
                                shift_id: getShiftId?.id,
                                job_validation_required: values.job_validation_required ? 1 : 0,
                                // schedule_date: record?.day,
                                schedule_date: formattedScheduleDate,
                                capacity: selectedJob?.capacity || values.capacity,
                              },
                            })   
                            console.log({
                              job_line_id: selectedJobLineId,
                              schedule_job_id: selectedScheduleJobId,
                              shift_id: getShiftId?.id,
                              schedule_date: record?.day,
                              capacity: selectedJob?.capacity || values.capacity,
                            });

                            const updatedSchedules = await request('/schedules'); // Refetch the schedules data
                            const transformedSchedules = transformData(updatedSchedules?.data);
                            setJobData(updatedSchedules?.data);
                            data(transformedSchedules);

                            // you have success MESSAGE here and REFRESH the schedules on the table i.e
                            message.success('Job added successfully');
                            // this keeps modal open when success
                            setIsModalVisible(false);
                            return true;
                          } catch (error) {
                            // this keeps modal open when there is an error
                            return false;
                          }
                        }}
                        // onVisibleChange={(visible) => setIsModalVisible(visible)}
                        onVisibleChange={async (visible) => {
                          setIsModalVisible(visible);
                          if (visible && selectedJobLineId) {
                              const selectedJob = jobData.find((job) => job.id === selectedJobLineId);
                              if (selectedJob) {
                                  await fetchJobStatuses(selectedJob.jobType); // Make sure to pass the job type ID
                              }
                          }
                      }}
                      >
                        {/* Replace here with content for the form i.e Job Number, booked qty, ...rest */}
                        {/* <ProFormText name="name" label="Job Number" /> */}
                        <ProFormText name="job_number" label="Job Number">
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
          {jobData?.length > 0 ? (
  jobData.map((job) => (
    <Option key={job.key} value={job.jobNumber}>
      {job.jobNumber} - {job.itemDetails}
    </Option>
  ))
) : (
  <p>No jobs available</p>
)}
        </Select>
                    </ProFormText>
                    <ProFormText name="booked_qty" label="Booked Quantity" />
                    {/* <ProFormText name="capacity" label="Capacity" /> */}
                    <ProFormText 
  name="capacity" 
  label="Capacity" 
  value={selectedJob?.capacity} // Ensure it's being populated correctly
  disabled={true} // Mark the field as read-only
/>
                    <ProFormText name="comments" label="Comments" />
                    
                    <Form.Item name="schedule_status_id" label="Job Status">
    <Select>
        {jobStatuses.map(status => (
            <Option key={status.id} value={status.value}>
                {status.name}
            </Option>
        ))}
    </Select>
</Form.Item>
{/* <Checkbox name="need_validation" label="Need Validation" /> */}
<Form.Item
  name="job_validation_required"
  valuePropName="checked" // This maps the checked state to the form value
>
  <Checkbox>Need Validation</Checkbox>
</Form.Item>

                      </ModalForm>
                    )}
                  </Space>
                );
              },
            }))
          : []),
      ];    
  // Handle week change
  const handleWeekChange = (date: any) => {
    setCurrentWeek(date.startOf('isoWeek'));
  };
  const handlePreviousWeek = () => {
    setCurrentWeek((prevWeek) => moment(prevWeek).subtract(1, 'week'));
  };
  const handleNextWeek = () => {
    setCurrentWeek((prevWeek) => moment(prevWeek).add(1, 'week'));
  };
  return (
    <div>
       {/* Page Title and Subtitle */}
       <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontWeight: 'bold', color: 'black', margin: 0 }}>TRT Manufacturing Planner</h1>
        <h2 style={{ fontSize: '14px', color: '#666', margin: '4px 0 0 0' }}>
          Hi System Administrator, welcome back! Here's your planner summary.
        </h2>
      </div>
      <Space style={{ marginBottom: 16,display:'flex',justifyContent:'space-between',width:'100%' }}>
        <div style={{display:'flex',alignItems:'center'}}>
        <Button onClick={handlePreviousWeek}>Previous Week</Button>
       
        </div>
      {/* Dropdown for Job Type Selection */}
      <Space style={{ marginBottom: 16 }}>
      <DatePicker
          disabled
          picker="week"
          value={currentWeek}
          onChange={handleWeekChange}
          format="YYYY-wo"
        />
        {/* <Button onClick={handleNextWeek}>Next Week</Button> */}
        <Select
          showSearch
          value={selectedJob}
          placeholder="Search Jobs"
          style={{ width: 200 }}
          onSearch={handleSearch} // Trigger search when typing
          onSelect={handleJobSelect} // Set selected job
          filterOption={false} // Disable built-in filter since we're fetching from API
        >
          {jobData.map((job) => (
            <Option key={job.key} value={job.key}>
              {job.jobNumber} 
            </Option>
          ))}
        </Select>
        <Select
          defaultValue={jobType}
          style={{ width: 200 }}
          onChange={handleJobTypeChange}
          loading={jobTypesLoading}
          placeholder="Select Job Type"
        >
          {jobTypes?.map((job: any) => (
            <Option key={job?.id} value={job?.id}>
              {job?.name}
            </Option>
          ))}
        </Select>
      </Space>
      <Button onClick={handleNextWeek}>Next Week</Button>
      </Space>
      {/* </div> */}
      {/* Tabs for Job Areas */}
      <Tabs
        defaultActiveKey={jobAreaPid?.toString()}
        onChange={(key) => setJobAreaPid(key)}
        style={{ marginBottom: 16 }}
      >
        {jobAreas?.map((jobArea: any) => (
          <TabPane tab={jobArea?.name} key={jobArea?.id}>
            <Table
              loading={loading}
              columns={columns}
              dataSource={transformData(data || [])}
              bordered
              rowKey="key"
              scroll={{ x: 1400 }}
              pagination={{
                onChange: (page) => {
                  const date = moment()
                    .startOf('isoWeek')
                    .add((page - 1) * 10, 'days');
                  console.log(date.format('YYYY-MM-DD'));
                },
                pageSize: 10,
              }}
              rowClassName={(record) =>
                record.shift === 'Night Shift' ? 'night-shift-row' : ''
              }
            />
          </TabPane>
        ))}
      </Tabs>
      {/* job edit modal */}
      <ModalForm
        title="Edit Job Details"
        visible={isJobEditModalVisible}
        form={form}
        footer={null}
        onVisibleChange={setIsCustomModalVisible}
        onCancel={() => setIsJobEditModalVisible(false)}
        onFinish={handleEditJobSubmit}
      >
        <ProFormText
          name="job_number"
          label="Job Number"
          readonly
        />
        <ProFormText
          name="description"
          label="Description"
          readonly
        />
        <ProFormText
          name="capacity"
          label="Capacity"
        />
        <ProFormText
          name="produced_qty"
          label="Produced Quantity"
        />
        <ProFormText
          name="yield_qty"
          label="Yield Quantity"
        />
        <ProFormText
          name="job_status"
          label="Job Status"
        />
             <Form.Item name="schedule_status_id" label="Job Status">
    <Select>
        {jobStatuses.map(status => (
            <Option key={status.id} value={status.value}>
                {status.name}
            </Option>
        ))}
    </Select>
</Form.Item>
        <ProFormText
          name="validation"
          label="Need Validation"
          valuePropName="checked"
        />
      </ModalForm>
      <ModalForm
        title="Job Details"
        visible={isCustomModalVisible}
        form={form}
        onVisibleChange={setIsCustomModalVisible}
        onCancel={() => setIsCustomModalVisible(false)}
        onFinish={async (values) => {
          console.log("Submitted form values:", values);
          // Handle form submission
          return true;
        }}
      >
        <ProFormText
          name="job_number"
          label="Job Number"
          readonly
        />
        <ProFormText
          name="description"
          label="Description"
          readonly
        />
        <ProFormText
          name="capacity"
          label="Capacity"
        />
        <ProFormText
          name="produced_qty"
          label="Produced Quantity"
        />
        <ProFormText
          name="yield_qty"
          label="Yield Quantity"
        />
        <ProFormText
          name="job_status"
          label="Job Status"
        />
        <ProFormText
          name="validation"
          label="Need Validation"
          valuePropName="checked"
        />
      </ModalForm>
    </div>
  );
};
export default DataSheet;
// import { ModalForm, ProFormText } from '@ant-design/pro-components';
// import { request, useRequest } from '@umijs/max';
// import { Button, Card, DatePicker, Space, Table } from 'antd';
// import moment from 'moment';
// import { useState } from 'react';

// const DataSheet = () => {
//   const [currentWeek, setCurrentWeek] = useState(moment().startOf('isoWeek'));

//   const [clickedSchedule, setClickedSchedule] = useState<any>(null);

//   const { data, loading } = useRequest(() =>
//     request('/schedules').then((res) => ({ data: res?.original?.data })),
//   );

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [jobAreaPid, setJobAreaPid] = useState<any>(
//     '9d198046-7cf7-463a-9759-ade3f9b311aa',
//   );

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { data: jobLines, loading: jobLinesLoading } = useRequest(
//     async () => {
//       if (!jobAreaPid) return;
//       return await request(`/job-areas/${jobAreaPid}`).then((res) => ({
//         data: res?.data?.job_lines,
//       }));
//     },
//     { refreshDeps: [jobAreaPid] },
//   );

//   const { data: shiftsFromApi } = useRequest(() =>
//     request('/shifts').then((res) => ({ data: res?.data?.data })),
//   );

//   const transformData = (schedules: any) => {
//     const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//     const shifts: any[] = shiftsFromApi?.map((shift: any) => shift?.name);

//     const transformedData: any[] = [];

//     daysOfWeek.forEach((day, dayIndex) => {
//       shifts?.forEach((shift) => {
//         const date = moment(currentWeek).add(dayIndex, 'days');
//         const schedulesForDayShift = schedules?.filter(
//           (s: any) =>
//             moment(s?.schedule_date).isSame(date, 'day') &&
//             s.shift_name === shift,
//         );

//         transformedData.push({
//           key: `${day}-${shift}`,
//           day: date.format('ll'),
//           shift,
//           jobs: schedulesForDayShift?.map((schedule: any) => ({
//             id: schedule?.schedule_job_id,
//             job_count: schedule?.booked_qty,
//             job_description: schedule?.job_description,
//             job_line_id: schedule?.job_line_id,
//             // add other required fields you need here i.e background colors
//             bgColor: schedule?.status_background_color,
//             textColor: schedule?.status_text_color,
//           })),
//         });
//       });
//     });

//     return transformedData;
//   };

//   const columns = [
//     {
//       title: 'Day',
//       dataIndex: 'day',
//       render: (text: string, record: any, index: number) => {
//         const rowSpan = index % 2 === 0 ? 2 : 0;
//         return {
//           children: text,
//           props: {
//             rowSpan,
//           },
//         };
//       },
//     },
//     {
//       title: 'Shift',
//       dataIndex: 'shift',
//     },
//     ...(jobLines?.length
//       ? jobLines?.map((job: any) => ({
//           title: job?.name,
//           dataIndex: 'jobs',
//           width: 300,
//           render: (jobs: any, record: any) => {
//             return (
//               <Space
//                 direction="vertical"
//                 size="middle"
//                 style={{ width: '100%' }}
//               >
//                 <ModalForm
//                   title={
//                     <>
//                       You are viewing{' '}
//                       <span style={{ color: clickedSchedule?.textColor }}>
//                         {clickedSchedule?.job_description}
//                       </span>
//                     </>
//                   }
//                   submitter={false}
//                   trigger={
//                     <div style={{ cursor: 'pointer' }}>
//                       {jobs
//                         ?.filter((j: any) => j?.job_line_id === job?.id)
//                         ?.map((job: any) => (
//                           <Card
//                             key={job?.id}
//                             size="small"
//                             style={{
//                               background: job?.bgColor || 'transparent',
//                               width: '100%',
//                               color: job?.textColor,
//                               borderRadius: 0,
//                               marginBottom: 1,
//                             }}
//                             onClick={() => setClickedSchedule(job)}
//                           >
//                             {job?.job_description} (Count: {job?.job_count})
//                           </Card>
//                         ))}
//                     </div>
//                   }
//                 >
//                   {/* More details about the clicked schedule */}
//                   Content HERE
//                 </ModalForm>
//                 {jobs?.filter((j: any) => j?.job_line_id === job?.id)?.length <=
//                   3 && (
//                   <ModalForm
//                     title="Add Job"
//                     submitter={{
//                       searchConfig: {
//                         submitText: 'Add Job',
//                         resetText: 'Cancel',
//                       },
//                     }}
//                     trigger={
//                       <Button style={{ width: '100%', borderRadius: 0 }}>
//                         FREE
//                       </Button>
//                     }
//                     onFinish={async (values: any) => {
//                       console.log(values);

//                       const getShiftId = shiftsFromApi?.find(
//                         (shift: any) => shift?.name === record?.shift,
//                       );

//                       // // you have the day here with the standard format
//                       console.log(moment(record?.day).format('YYYY-MM-DD'));

//                       // // you have the shift id here
//                       console.log(getShiftId?.id);

//                       // Do your POST here for Adding a new job
//                       try {
//                         // await request('/schedules', {
//                         //   method: 'POST',
//                         //   data: {
//                         //     ...values,
//                         //     shift_id: getShiftId?.id,
//                         //     schedule_date: record?.day,
//                         //   },
//                         // })

//                         // you have success MESSAGE here and REFRESH the schedules on the table i.e

//                         // this keeps modal open when success
//                         return true;
//                       } catch (error) {
//                         // CATCH ERROR
//                         // console.error('Error adding job:', error);

//                         // this keeps modal open when there is an error
//                         return false;
//                       }
//                     }}
//                   >
//                     {/* Replace here with content for the form i.e Job Number, booked qty, ...rest */}
//                     <ProFormText name="name" label="Job Number" />
//                   </ModalForm>
//                 )}
//               </Space>
//             );
//           },
//         }))
//       : []),
//   ];

//   const handleWeekChange = (date: any) => {
//     setCurrentWeek(date.startOf('isoWeek'));
//   };

//   const handlePreviousWeek = () => {
//     setCurrentWeek((prevWeek) => moment(prevWeek).subtract(1, 'week'));
//   };

//   const handleNextWeek = () => {
//     setCurrentWeek((prevWeek) => moment(prevWeek).add(1, 'week'));
//   };

//   return (
//     <div>
//       <Space style={{ marginBottom: 16 }}>
//         <Button onClick={handlePreviousWeek}>Previous Week</Button>
//         <DatePicker
//           disabled
//           picker="week"
//           value={currentWeek}
//           onChange={handleWeekChange}
//           format="YYYY-wo"
//         />
//         <Button onClick={handleNextWeek}>Next Week</Button>
//       </Space>
//       <Table
//         loading={loading}
//         columns={columns}
//         dataSource={transformData(data || [])}
//         bordered
//         rowKey="key"
//         scroll={{ x: 1400 }}
//         pagination={{
//           onChange: (page) => {
//             const date = moment()
//               .startOf('isoWeek')
//               .add((page - 1) * 10, 'days');
//             console.log(date.format('YYYY-MM-DD'));
//           },
//           pageSize: 10,
//         }}
//         rowClassName={(record) =>
//           record.shift === 'Night Shift' ? 'night-shift-row' : ''
//         }
//       />
//     </div>
//   );
// };

// export default DataSheet;