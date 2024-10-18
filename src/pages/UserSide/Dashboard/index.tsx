import { Bar } from '@ant-design/charts';
import { PageContainer, PageHeader, ProCard } from '@ant-design/pro-components';
import { Card, Col, DatePicker, Progress, Row, Select, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { request } from 'umi';

const Dashboard: React.FC = () => {
  const { RangePicker } = DatePicker;

  const [dashboardData, setDashboardData] = useState<any>(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await request('/dashboard/metrics'); // Replace with the actual endpoint
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  // Check if the data is loaded
  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  // Destructuring API response for easier access
  const {
    total_jobs,
    pack_jobs_count,
    bulk_jobs_count,
    pack_jobs,
    bulk_jobs,
    job_progress,
    upcoming_jobs,
    jobs_on_hold,
    last_month_incomplete_jobs,
  } = dashboardData;

  // Data for the job statuses section
  // const jobStatuses = [
  //   {
  //     title: 'Complete',
  //     value: total_jobs,
  //     percent:
  //       (total_jobs / (total_jobs + pack_jobs_count + bulk_jobs_count)) * 100,
  //     icon: <CheckCircleOutlined style={{ color: 'green' }} />,
  //   },
  //   {
  //     title: 'In Progress',
  //     value: pack_jobs_count,
  //     percent:
  //       (pack_jobs_count / (total_jobs + pack_jobs_count + bulk_jobs_count)) *
  //       100,
  //     icon: <SyncOutlined style={{ color: 'orange' }} />,
  //   },
  //   {
  //     title: 'Dispensed',
  //     value: bulk_jobs_count,
  //     percent:
  //       (bulk_jobs_count / (total_jobs + pack_jobs_count + bulk_jobs_count)) *
  //       100,
  //     icon: <StopOutlined style={{ color: 'red' }} />,
  //   },
  //   {
  //     title: 'On Hold',
  //     value: jobs_on_hold?.length || 0,
  //     percent: jobs_on_hold
  //       ? (jobs_on_hold.length /
  //           (total_jobs + pack_jobs_count + bulk_jobs_count)) *
  //         100
  //       : 0,
  //     icon: <StopOutlined style={{ color: 'red' }} />,
  //   },
  // ];

  return (
    <PageContainer>
      {/* Header and Filters */}
      <PageHeader
        title="Planner Dashboard"
        subTitle="Hi, welcome back! Here's your summary of job schedules."
      />
      <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
        <Col span={8}>
          <RangePicker />
        </Col>
        <Col span={8}>
          <Select placeholder="Select Job Category" style={{ width: '100%' }}>
            <Select.Option value="pack">Pack Jobs</Select.Option>
            <Select.Option value="bulk">Bulk Jobs</Select.Option>
          </Select>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col lg={18} sm={24}>
          <Row gutter={[16, 16]}>
            <Col sm={24} lg={12}>
              <ProCard title="Scheduled Jobs" bordered>
                <Statistic title="Total Jobs Today" value={total_jobs} />

                {/* Centering the Progress Circle */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 16,
                  }}
                >
                  <Progress
                    type="circle"
                    percent={
                      (total_jobs /
                        (total_jobs + pack_jobs_count + bulk_jobs_count)) *
                      100
                    }
                    strokeColor={{ '0%': '#FFD700', '100%': '#808080' }}
                  />
                </div>
                <div
                  style={{
                    marginTop: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Statistic
                    title="Pack Jobs"
                    value={`${
                      (pack_jobs_count / (pack_jobs_count + bulk_jobs_count)) *
                      100
                    }%`}
                  />
                  <Statistic
                    title="Bulk Jobs"
                    value={`${
                      (bulk_jobs_count / (pack_jobs_count + bulk_jobs_count)) *
                      100
                    }%`}
                  />
                </div>
              </ProCard>
            </Col>

            <Col lg={12} sm={24}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <ProCard title="Pack Jobs" bordered>
                    <Row gutter={[16, 16]}>
                      {pack_jobs && pack_jobs.length > 0 ? (
                        pack_jobs.map((job: any, index: number) => (
                          <Col span={12} key={index}>
                            <Card>
                              <Statistic
                                title={job.title}
                                value={job.value}
                                prefix={job.icon}
                                valueStyle={{ fontSize: '16px' }}
                              />
                              <Progress percent={job.percent} />
                            </Card>
                          </Col>
                        ))
                      ) : (
                        <Col span={24}>
                          <p>No pack jobs available</p>
                        </Col>
                      )}
                    </Row>
                  </ProCard>
                </Col>
                <Col span={24}>
                  <ProCard title="Bulk Jobs" bordered>
                    <Row gutter={[12, 12]}>
                      {bulk_jobs && bulk_jobs.length > 0 ? (
                        bulk_jobs.map((job: any, index: number) => (
                          <Col span={12} key={index}>
                            <Card>
                              <Statistic
                                title={job.title}
                                value={job.value}
                                prefix={job.icon}
                                valueStyle={{ fontSize: '16px' }}
                              />
                              <Progress percent={job.percent} />
                            </Card>
                          </Col>
                        ))
                      ) : (
                        <Col span={24}>
                          <p>No bulk jobs available</p>
                        </Col>
                      )}
                    </Row>
                  </ProCard>
                </Col>
              </Row>
            </Col>
            <Col sm={24} lg={24}>
              <ProCard title="Scheduled Job Progress" bordered>
                {job_progress && job_progress.length > 0 ? (
                  <Bar
                    data={job_progress.map((progress: any) => ({
                      type: progress.month,
                      value: progress.completed_count,
                    }))}
                    xField="type"
                    yField="value"
                    seriesField="type"
                    color={['#4CAF50', '#FF9F00', '#1890FF', '#FF4D4F']}
                  />
                ) : (
                  <p>No job progress data available</p>
                )}
              </ProCard>
            </Col>
          </Row>
        </Col>

        <Col span={6}>
          {/* Upcoming Jobs Section */}
          <ProCard
            title="Upcoming Jobs"
            bordered
            style={{ maxHeight: 400, overflow: 'auto' }}
          >
            {upcoming_jobs && upcoming_jobs.length > 0 ? (
              upcoming_jobs.map((job: any) => (
                <Card key={job.id} style={{ marginBottom: 12 }}>
                  <p> {job.schedule_date}</p>
                  <p style={{ color: '#000', fontWeight: 'bold' }}>
                    {' '}
                    {job.schedule_job.job_number}
                  </p>
                  <p style={{ color: 'grey', fontWeight: 'normal' }}>
                    {' '}
                    {job.schedule_job.description}
                  </p>
                  <p style={{ color: 'green', fontWeight: 'bold' }}>
                    {job.schedule_job.schedule_status_id}
                  </p>
                </Card>
              ))
            ) : (
              <p>No upcoming jobs available</p>
            )}
          </ProCard>

          {/* Jobs On Hold Section */}
          <ProCard
            title="Jobs On Hold"
            bordered
            style={{ marginTop: 16, maxHeight: 400, overflow: 'auto' }}
          >
            {jobs_on_hold && jobs_on_hold.length > 0 ? (
              jobs_on_hold.map((job: any) => (
                <Card key={job.id} style={{ marginBottom: 12 }}>
                  <p>
                    <strong>Job Number:</strong> {job.schedule_job.job_number}
                  </p>
                  <p>
                    <strong>Description:</strong> {job.schedule_job.description}
                  </p>
                  <p>
                    <strong>Scheduled Date:</strong> {job.schedule_date}
                  </p>
                </Card>
              ))
            ) : (
              <p>No jobs on hold</p>
            )}
          </ProCard>

          {/* Last Month Incomplete Jobs Section */}
          <ProCard
            title="Last Month Incomplete Jobs"
            bordered
            style={{ marginTop: 16, maxHeight: 400, overflow: 'auto' }}
          >
            {last_month_incomplete_jobs &&
            last_month_incomplete_jobs.length > 0 ? (
              last_month_incomplete_jobs.map((job: any) => (
                <Card key={job.id} style={{ marginBottom: 12 }}>
                  <p>
                    <strong>Job Number:</strong> {job.schedule_job.job_number}
                  </p>
                  <p>
                    <strong>Description:</strong> {job.schedule_job.description}
                  </p>
                  <p>
                    <strong>Scheduled Date:</strong> {job.schedule_date}
                  </p>
                </Card>
              ))
            ) : (
              <p>No incomplete jobs from last month</p>
            )}
          </ProCard>
        </Col>
      </Row>

      <footer style={{ textAlign: 'center', marginTop: 16 }}>
        © 2024 TRT Manufacturing Ltd
        <br />
        Powered by: Microvision Innovations Ltd
      </footer>
    </PageContainer>
  );
};

export default Dashboard;
