import React from 'react';
import { Outlet } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import { Menu } from 'antd';
import { useLocation, Link } from 'umi';

const DataBackupAndSystemInfo = () => {
  const location = useLocation();

  return (
    <PageContainer>
      <div style={{ display: 'flex' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ width: 200 }}
        >
          <Menu.Item key="/mapping/managejobtypes">
            <Link to="/mapping/managejobtypes">Manage Job Types</Link> 
          </Menu.Item>
          <Menu.Item key="/mapping/jobareas">
            <Link to="/mapping/jobareas">Job Areas</Link> 
          </Menu.Item>
          <Menu.Item key="/mapping/linesandtanks">
            <Link to="/mapping/linesandtanks">Lines & Tanks</Link> 
          </Menu.Item>
        </Menu>
        <div style={{ flex: 1, marginLeft: 24 }}>
          <Outlet /> 
        </div>
      </div>
    </PageContainer>
  );
};

export default DataBackupAndSystemInfo;
