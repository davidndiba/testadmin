import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import HeatMap from './components/HeatMap';
import Statistics from './components/Statistics';
import ActivityLogs from './components/ActivityLogsTable';

const Dashboard = () => (
  <PageContainer>
   
    <Statistics />
    
    
    <div style={{ marginTop: 24 }}>
      <HeatMap />
    </div>
    
    
    <div style={{ marginTop: 24 }}>
      <ActivityLogs />
    </div>
  </PageContainer>
);

export default Dashboard;
