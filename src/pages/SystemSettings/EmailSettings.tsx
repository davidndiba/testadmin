// 
import React from 'react';
import { Tabs } from 'antd';
import Settings from './Settings';
import EmailTemplate from './EmailTemplate';
import Queue from './Queue';
import SendEmail from './SendEmail';
import { ProCard } from '@ant-design/pro-components';

const { TabPane } = Tabs;

const EmailManagement = () => {
  return (
    <ProCard title="Email Management" bordered>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Settings" key="1">
          <Settings />
        </TabPane>
        <TabPane tab="Email Template" key="2">
          <EmailTemplate />
        </TabPane>
        <TabPane tab="Queue" key="3">
          <Queue />
        </TabPane>
        <TabPane tab="Send Email" key="4">
          <SendEmail />
        </TabPane>
      </Tabs>
    </ProCard>
  );
};

export default EmailManagement;