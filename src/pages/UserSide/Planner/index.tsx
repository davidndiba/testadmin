import { Card, Space, Table, Row, Col, Select, Input, Typography, DatePicker, Tabs, Modal, Button, Form, Checkbox, message, Tooltip, Dropdown, Menu } from 'antd';
import { request, useRequest } from '@umijs/max';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { ArrowLeftOutlined, ArrowRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const ManufacturingPlanner = () => {
  const [existingJobs, setExistingJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState(null); 
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('isoWeek'));
  const [jobType, setJobType] = useState<any>();
  const [jobAreaPid, setJobAreaPid] = useState<any>(null);
  const [jobAreas, setJobAreas] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null); 
  const [form] = Form.useForm();
  const [jobData, setJobData] = useState([]); 
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
  const [activeTabKey, setActiveTabKey] = useState<string>('1'); 
  const { data: jobTypes, loading: jobTypesLoading } = useRequest(() =>
    request('/job-types').then((res) => ({ data: res?.data?.data }))
  );
  useEffect(() => {
    if (jobTypes && jobTypes.length > 0) {
      const firstJobTypeId = jobTypes[0].id; // Get the ID of the first job type
      setJobType(firstJobTypeId); // Set the job type to the first one
      fetchJobAreas(firstJobTypeId); // Fetch job areas for the first job type
    }
  }, [jobTypes]);
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
  useEffect(() => {
    if (jobAreaPid) {
      fetchJobDetails(jobAreaPid); // Pass the first job area's ID to fetch job details
    }
  }, [jobAreaPid]);
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
            job_description: schedule?.job_description,
            booked_qty: schedule?.booked_qty,
            schedule_job_number: schedule?.schedule_job_number,
            schedule_status_name: schedule?.schedule_status_name,
            job_line_id: schedule?.job_line_id,
            job_validation_required: schedule.job_validation_required ? 1 : 0 , 
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
      setSelectedJob(response.data); 
      console.log("Job details:", response.data);
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
      // setIsJobEditModalVisible(true)
      setIsCustomModalVisible(true);
    } else {
      message.error("Failed to fetch job details");
    }
  } catch (error) {
    // console.error("Error fetching job details:", error);
    // message.error("Error fetching job details");
  }
};
// Handle job selection
const handleJobSelect = (value: string) => {
  setSelectedJob(value); 
  fetchJobDetails(value); 
};
const handleEditJobSubmit = async (values) => {
  if (!selectedJob) return;

  try {
    const response = await request(`/schedule-jobs/${selectedJob.id}`, {
      method: 'PUT',
      data: values,
    });
    if (response.success) {
      message.success("Job updated successfully");
      setIsJobEditModalVisible(false);
      fetchJobData();
    } else {
      message.error("Failed to update job");
    }
  } catch (error) {
    console.error("Error updating job:", error);
    message.error("Error updating job");
  }
};

  useEffect(() => {
    fetchJobData(); 
  }, []);
   // Handling the tab change
   const handleTabChange = (key: string) => {
    setActiveTabKey(key);
    console.log(`Active tab: ${key}`);
  };
  const handleJobLineSelection = (value) => {
    setSelectedJobLineId(value); 
  };
 // Handle Job Type Change (Dropdown)
  const handleJobTypeChange = (value: string) => {
    setJobType(value);
    fetchJobAreas(value); 
  };
  useEffect(() => {
    fetchJobData();  
  }, [jobType]);  
  useEffect(() => {
    const fetchData = async () => {
      const res = await request('/schedules');
      const transformedSchedules = transformData(res?.data);
      setTableData(transformedSchedules)
    };
    fetchData();
  }, [currentWeek, data]);
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
    const  handleSearch = async (value: string) => {
      setSearchTerm(value); 
      try {
        const response = await request(`/schedule-jobs`, {
          params: { search: value }, 
        });
        if (response.success) {
          setJobData(
            response.data.map((job) => ({
              key: job.id,
              jobNumber: job.job_number,
              jobTypeSymbol:job.job_type_symbol,
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
        capacity: selectedJob?.capacity || 'default capacity value', 
      });
      setSelectedScheduleJobId(job.key);
      fetchJobStatuses(job.jobType);
    }
  };
  const fetchSlotJobs = async (params:any) => {
    try {
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
                    setSelectedSlot(job);
                    setExistingJobs(record.jobs);
                    fetchSlotJobs({schedule_date:moment(record?.day).format('YYYY-MM-DD'),shift:getShiftId?.id,job_line:job?.id});
                    setIsModalVisible(true);
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
    maxHeight:'68px',
    padding: '0px 0px', 
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-between',
  }}
  onClick={() => {
    setClickedSchedule(job);
    setSelectedSlot(job);
  }}
>
<div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '0px', 
    }}>
    {/* Validation Icon (on the left) */}
    {job?.isValid && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 1024 1024"
        style={{ 
          fill: 'green', 
          fontSize: '1.2em',
          marginRight: '8px' 
        }}
      >
        <path d="M456 231a56 56 0 1 0 112 0a56 56 0 1 0-112 0m0 280a56 56 0 1 0 112 0a56 56 0 1 0-112 0m0 280a56 56 0 1 0 112 0a56 56 0 1 0-112 0" />
      </svg>
    )}
    {/* Job Number (centered between validation and dropdown) */}
    <Button
      type="link"
      style={{ 
        fontWeight: 'bold', 
        color: '#000', 
        fontSize: '12px',  
        lineHeight: '1', 
        margin: '0px 0',
        padding: 0,
        marginTop:'-10px',
        flex: '1', 
        textAlign: 'center', 
      }}
    >
      {job?.schedule_job_number}
    </Button>
    {/* Dropdown Menu (on the right) */}
    <Dropdown overlay={menu} trigger={['click']}>
      <div
        style={{
          cursor: 'pointer',
          marginLeft: '4px'
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
            fontSize: '1.2em', 
          }}
        >
          <path d="M456 231a56 56 0 1 0 112 0a56 56 0 1 0-112 0m0 280a56 56 0 1 0 112 0a56 56 0 1 0-112 0m0 280a56 56 0 1 0 112 0a56 56 0 1 0-112 0" />
        </svg>
      </div>
    </Dropdown>
  </div>
    <Tooltip title={job.job_description} placement="top">
      <div style={{ 
         color: 'grey',
         whiteSpace: 'nowrap',
         overflow: 'hidden',
         textOverflow: 'ellipsis',
         maxWidth: '300px',
         fontSize: '12px',
         marginTop: '-4px',
         textAlign: 'center', 
       }}>
        {job.job_description.split(' ').slice(0, 3).join(' ') + (job.job_description.split(' ').length > 3 ? '...' : '')}
      </div>
    </Tooltip>

    <div style={{ display: 'flex', gap:'70px', marginTop: '0px',marginBottom:'0px',fontSize:'12px',textAlign:'center' }}>
      {/* Status Name */}
      <div >
        {job?.schedule_status_name}
      </div>
      {/* More Details Button */}
      <Button
        onClick={() => fetchJobDetails(job.id)}
        type="link"
        style={{
          color: '#ff5733',
          padding: '0', 
          display: 'flex',
          textAlign:'center',
          marginTop:'-6px',
          fontSize: '11px', 
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
    {job.job_validation_required === 1 && (
    <div style={{ position: 'absolute', top: '5px', left: '5px', color: '#FFD700' ,fontSize: '24px'}}>★</div>
  )}
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
        // booked_qty:values.booked_qty,
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
          await fetchJobStatuses(selectedJob.jobType); 
      }
  }
}}
>
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
          backgroundColor: 'white', 
          color: 'black',           
          fontWeight: 'bold',       
        }}
        onClick={() => fetchJobDetails(job?.id)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#d9d9d9'; 
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white'; 
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
                      0 && (
                      <ModalForm
  title={
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ margin: 0 }}>SCHEDULER</h3>
      <button
        style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
        onClick={() => setIsModalVisible(false)}
      >
        {/* Close button */}
      </button>
    </div>
  }
  submitter={{
    searchConfig: {
      submitText: 'Add Job',
      resetText: 'Cancel',
    },
  }}
  trigger={
    <Card
      style={{
        width: '80%',
        borderRadius: 0,
        cursor: 'pointer',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0',
        backgroundColor: '#F8F4FE',
        color: '#6200EE',
        border: 'none',
      }}
      onClick={() => {
        setSelectedJobLineId(job?.id);
        const selectedShift = shiftsFromApi?.find((shift) => shift.name === record?.shift);
        const selectedScheduleDate = moment(record?.day).format('YYYY-MM-DD');
        setClickedSchedule({
          job_line_id: job?.id,
          shift_id: selectedShift?.id,
          schedule_date: selectedScheduleDate,
          job_description: job?.job_description,
        });
        setIsModalVisible(true);
      }}
    >
      <span style={{ color: '#6200EE', alignSelf: 'center' }}>FREE</span>
    </Card>
  }
  onFinish={async (values) => {
    const formattedScheduleDate = moment(values.schedule_date).format('YYYY-MM-DD');
    try {
      await request('/schedules', {
        method: 'POST',
        data: {
          ...values,
          job_line_id: selectedJobLineId,
          schedule_job_id: selectedScheduleJobId,
          shift_id: getShiftId?.id,
          job_validation_required: values.job_validation_required ? 1 : 0,
          schedule_date: formattedScheduleDate,
          capacity: selectedJob?.capacity || values.capacity,
        },
      });
      const updatedSchedules = await request('/schedules');
      const transformedSchedules = transformData(updatedSchedules?.data);
      setJobData(updatedSchedules?.data);
      data(transformedSchedules);

      message.success('Job added successfully');
      setIsModalVisible(false); 
      return true;
    } catch (error) {
      return false;
    }
  }}
  onVisibleChange={async (visible) => {
    setIsModalVisible(visible);
    if (visible && selectedJobLineId) {
      const selectedJob = jobData.find((job) => job.id === selectedJobLineId);
      if (selectedJob) {
        await fetchJobStatuses(selectedJob.jobType);
      }
    }
  }}
>
  <div style={{ 
  display: 'flex', 
  flexDirection: 'column', 
  marginBottom: '20px', 
  padding: '15px', 
  borderRadius: '8px', 
  backgroundColor: '#fafafa' 
}}>
  {/* Date and Time Section */}
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '12px', 
    borderRadius: '6px', 
    border: '1px solid #e0e0e0', 
    backgroundColor: '#fff', 
    transition: 'all 0.3s ease', 
    gap: '15px',
  }}>
    <div style={{ textAlign: 'center', flex: 1 }}>
      <strong style={{ 
        display: 'block', 
        marginBottom: '6px', 
        fontSize: '14px', 
        fontWeight: '500', 
        color: '#007BFF' 
      }}>
        Date
      </strong>
      <div style={{ fontSize: '13px', color: '#555' }}>
        {moment(record?.day).format('dddd DD MMM, YYYY')}
      </div>
    </div>
    <div style={{ textAlign: 'center', flex: 1 }}>
      <strong style={{ 
        display: 'block', 
        marginBottom: '6px', 
        fontSize: '14px', 
        fontWeight: '500', 
        color: '#007BFF' 
      }}>
        Time
      </strong>
      <div style={{ fontSize: '13px', color: '#555' }}>
        {record?.shift || 'N/A'}
      </div>
    </div>
  </div>

  {/* Job Area and Job Line Section */}
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '12px', 
    borderRadius: '6px', 
    border: '1px solid #e0e0e0', 
    backgroundColor: '#fff', 
    transition: 'all 0.3s ease', 
    gap: '15px', 
    marginTop: '10px'
  }}>
    <div style={{ textAlign: 'center', flex: 1 }}>
      <strong style={{ 
        display: 'block', 
        marginBottom: '6px', 
        fontSize: '14px', 
        fontWeight: '500', 
        color: '#007BFF' 
      }}>
        Job Area
      </strong>
      <div style={{ fontSize: '13px', color: '#555' }}>
        Home Care (Area 1)
      </div>
    </div>
    <div style={{ textAlign: 'center', flex: 1 }}>
      <strong style={{ 
        display: 'block', 
        marginBottom: '6px', 
        fontSize: '14px', 
        fontWeight: '500', 
        color: '#007BFF' 
      }}>
        Job Line
      </strong>
      <div style={{ fontSize: '13px', color: '#555' }}>
        {job?.id || 'N/A'}
      </div>
    </div>
  </div>
</div>

  {/* Search Job Number */}
  <ProFormText name="job_number" label="Search Job Number">
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

  {/* Form Fields - Initially hidden, shown after job selection */}
  {selectedJob && (
    <>
      <ProFormText name="booked_qty" label="Booked Quantity" style={{ width: '300px' }} />
      <ProFormText name="capacity" label="Capacity" value={selectedJob?.capacity} disabled style={{ width: '300px' }} />
      <ProFormText name="comments" label="Comments" style={{ width: '300px' }} />
      <Form.Item name="schedule_status_id" label="Job Status">
        <Select>
          {jobStatuses.map((status) => (
            <Option key={status.id} value={status.value}>
              {status.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="job_validation_required" valuePropName="checked">
        <Checkbox>Need Validation</Checkbox>
      </Form.Item>
    </>
  )}
</ModalForm>

// {/* <ModalForm
//   title={
//     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//       <h3 style={{ margin: 0 }}>SCHEDULER</h3>
//       <button
//         style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
//         onClick={() => setIsModalVisible(false)}
//       >
//         {/* × */}
//       </button>
//     </div>
//   }
//   submitter={{
//     searchConfig: {
//       submitText: 'Add Job',
//       resetText: 'Cancel',
//     },
//   }}
//   trigger={
//     <Card
//       style={{
//         width: '80%',
//         borderRadius: 0,
//         cursor: 'pointer',
//         height: '40px',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: '0',
//         backgroundColor: '#F8F4FE',
//         color: '#6200EE',
//         border: 'none',
//       }}
//       onClick={() => {
//         setSelectedJobLineId(job?.id);
//         const selectedShift = shiftsFromApi?.find((shift) => shift.name === record?.shift);
//         const selectedScheduleDate = moment(record?.day).format('YYYY-MM-DD');
//         setClickedSchedule({
//           job_line_id: job?.id,
//           shift_id: selectedShift?.id,
//           schedule_date: selectedScheduleDate,
//           job_description: job?.job_description,
//         });
//         setIsModalVisible(true);
//       }}
//     >
//       <span style={{ color: '#6200EE',alignSelf:'center' }}>FREE</span>
//     </Card>
//   }
//   onFinish={async (values) => {
//     const formattedScheduleDate = moment(values.schedule_date).format('YYYY-MM-DD');
//     try {
//       await request('/schedules', {
//         method: 'POST',
//         data: {
//           ...values,
//           job_line_id: selectedJobLineId,
//           schedule_job_id: selectedScheduleJobId,
//           shift_id: getShiftId?.id,
//           job_validation_required: values.job_validation_required ? 1 : 0,
//           schedule_date: formattedScheduleDate,
//           capacity: selectedJob?.capacity || values.capacity,
//         },
//       });
//       const updatedSchedules = await request('/schedules');
//       const transformedSchedules = transformData(updatedSchedules?.data);
//       setJobData(updatedSchedules?.data);
//       data(transformedSchedules);

//       message.success('Job added successfully');
//       setIsModalVisible(false); // Close the modal on success
//       return true;
//     } catch (error) {
//       return false;
//     }
//   }}
//   onVisibleChange={async (visible) => {
//     setIsModalVisible(visible);
//     if (visible && selectedJobLineId) {
//       const selectedJob = jobData.find((job) => job.id === selectedJobLineId);
//       if (selectedJob) {
//         await fetchJobStatuses(selectedJob.jobType);
//       }
//     }
//   }}
// >
//   {/* Top Section with Slot Details */}
//   <div style={{ marginBottom: '20px', textAlign: 'right' }}>
//     {/* Date and Time in a row */}
//     <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
//       <div style={{ marginRight: '20px' }}>
//         <strong>Date:</strong> {moment(record?.day).format('dddd DD MMM, YYYY')}
//       </div>
//       <div>
//         <strong>Time:</strong> {record?.shift || 'N/A'}
//       </div>
//     </div>

//     {/* Job Type below Date */}
//     <div style={{ marginBottom: '5px', textAlign: 'right' }}>
//       <strong>Job Type:</strong> {job?.job_type || 'N/A'}
//     </div>

//     {/* Job Area below Time */}
//     <div style={{ marginBottom: '5px', textAlign: 'right' }}>
//       <strong>Job Area:</strong> Home Care (Area 1)
//     </div>

//     {/* Job Line below Job Type */}
//     <div style={{ textAlign: 'right' }}>
//       <strong>Line:</strong> {job?.id || 'N/A'}
//     </div>
//   </div>
//   {/* Search Job Number */}
//   <ProFormText name="job_number" label="Search Job Number" >
//     <Select
//       placeholder="Select Job Number"
//       onChange={handleJobNumberChange}
//       showSearch
//       filterOption={(input, option) =>
//         option.children.toLowerCase().includes(input.toLowerCase())
//       }
//     >
//       {jobData?.length > 0 ? (
//         jobData.map((job) => (
//           <Option key={job.key} value={job.jobNumber}>
//             {job.jobNumber} - {job.itemDetails}
//           </Option>
//         ))
//       ) : (
//         <p>No jobs available</p>
//       )}
//     </Select>
//   </ProFormText>
//   {/* Form Fields - Initially hidden, shown after job selection */}
//   {selectedJob && (
//     <>
//     <ProFormText name="booked_qty" label="Booked Quantity" style={{ width: '300px', textAlign: 'right' }} />
//     <ProFormText name="capacity" label="Capacity" value={selectedJob?.capacity} disabled style={{ width: '300px', textAlign: 'right' }} />
//     <ProFormText name="comments" label="Comments" style={{ width: '300px', textAlign: 'right' }} />
//     <Form.Item name="schedule_status_id" label="Job Status" style={{ textAlign: 'right' }}>
//       <Select>
//         {jobStatuses.map((status) => (
//           <Option key={status.id} value={status.value}>
//             {status.name}
//           </Option>
//         ))}
//       </Select>
//     </Form.Item>
//     <Form.Item name="job_validation_required" valuePropName="checked" style={{ textAlign: 'right' }}>
//       <Checkbox>Need Validation</Checkbox>
//     </Form.Item>
//   </>
//   )} 
// </ModalForm> */}


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
   <div style={{ display: 'flex', marginBottom: '16px', justifyContent: 'flex-end' }}>
  <Select
    showSearch
    value={selectedJob}
    placeholder="Search Jobs"
    style={{ width: 300 }}
    onSearch={handleSearch} 
    onSelect={handleJobSelect} 
    filterOption={false}
    dropdownRender={(menu) => (
      <>
        <div style={{ padding: '8px', fontWeight: 'bold' }}>Search Results</div>
        {menu}
      </>
    )}
  >
   <Select.OptGroup label="Job Numbers">
  {jobData && jobData.length > 0 ? (
    jobData.map((job) => (
      <Option key={job.key} value={job.key}>
        {job.jobNumber} - {job.jobTypeSymbol}
      </Option>
    ))
  ) : (
    <Option disabled>No jobs available</Option>  // Fallback message if no jobs
  )}
</Select.OptGroup>
  </Select>
</div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <Space style={{ marginBottom: 16,display:'flex',alignItems:'center' }}>
          <Button
        icon={<ArrowLeftOutlined />} // Left arrow icon
        onClick={handlePreviousWeek}
        style={{ backgroundColor: '#d9d9d9', color: '#595959', borderRadius: 4, border: 'none' }} // Light gray background, dark gray text
      >
        Previous Week
      </Button>
        {/* </div> */}
      <RangePicker
          // disabled
          picker="week"
          value={currentWeek}
          onChange={handleWeekChange}
          style={{ width: 300, height: 32 }}
          format="YYYY-wo"
        />
        <Select
          defaultValue={jobType}
          style={{ width: 300,height:'40' }}
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
        <Button
        icon={<ArrowRightOutlined />} // Right arrow icon
        onClick={handleNextWeek}
        style={{ backgroundColor: '#d9d9d9', color: '#595959', borderRadius: 4, border: 'none' }} // Light gray background, dark gray text
      >
        Next Week
      </Button>
      </Space>   
    </div>
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
export default ManufacturingPlanner;