
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
          {/* maintenance */}
          <Menu.Item key="/maintenance/systembackup">
            <Link to="/maintenance/systembackup">System Backup</Link>
          </Menu.Item>
          <Menu.Item key="/maintenance/systeminformation">
            <Link to="/maintenance/systeminformation">System Information</Link>
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
