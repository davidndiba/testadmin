import React from 'react';
import { Tabs } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import Users from './Components/users';
import Roles from './Components/roles';
import Permissions from './Components/permissions';

const { TabPane } = Tabs;

const AdminPanel: React.FC = () => {
  return (
    <ProCard title="User Management" bordered>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Users" key="1">
          <Users />
        </TabPane>
        <TabPane tab="Roles" key="2">
          <Roles />
        </TabPane>
        <TabPane tab="Permissions" key="3">
          <Permissions />
        </TabPane>
      </Tabs>
    </ProCard>
  );
};

export default AdminPanel;
