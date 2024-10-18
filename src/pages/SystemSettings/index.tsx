
import React from 'react';
import { Outlet } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import { Menu } from 'antd';
import { useLocation, Link } from 'umi';

const SystemSettingsLayout = () => {
  const location = useLocation();

  return (
    <PageContainer>
      <div style={{ display: 'flex' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ width: 200 }}
        >
          {/* systems settings  */}
          <Menu.Item key="/system-settings/generalsettings">
            <Link to="/system-settings/generalsettings">General Settings</Link>
          </Menu.Item>
          <Menu.Item key="/system-settings/emailsettings">
            <Link to="/system-settings/emailsettings">Email Settings</Link>
          </Menu.Item>
          {/* systems settings */}
          <Menu.Item key="/system-settings/securitysettings">
            <Link to="/system-settings/securitysettings">Security Settings</Link>
          </Menu.Item>
        </Menu>
        <div style={{ flex: 1, marginLeft: 24 }}>
          <Outlet /> {/* Render the nested route components here */}
        </div>
      </div>
    </PageContainer>
  );
};

export default SystemSettingsLayout;
