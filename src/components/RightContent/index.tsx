import {
  LockOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history, request, useModel } from '@umijs/max';
import { message, Spin } from 'antd';
import { createStyles } from 'antd-style';
import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser }: any = initialState || {};
  return (
    <span className="anticon">
      {currentUser?.firstName + ' ' + currentUser?.lastName}
    </span>
  );
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  menu,
  children,
}) => {
  const { styles } = useStyles();

  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    async (event: any) => {
      const { key } = event;
      if (key === 'logout') {
        try {
          await request('/auth/logout', {
            method: 'POST',
          });
          flushSync(() => {
            setInitialState((s: any) => ({ ...s, currentUser: undefined }));
          });
          message.success('Logged out successfully');
          history.push('/user/login');
        } catch (error) {
          message.error('Logout failed, please try again.');
        }

        return;
      }

      if (key === 'admin') {
        flushSync(() => {
          setInitialState((s: any) => ({ ...s, layout: 'side' }));
        });

        return;
      }
      //   history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser }: any = initialState || {};

  if (!currentUser?.user || !currentUser?.user?.display_name) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: 'Profile',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
          },
          ...(currentUser?.role_and_permissions?.find(
            (e: any) => e?.role_name === 'Super Admin',
          )
            ? [
                {
                  key: 'admin',
                  icon: <LockOutlined />,
                  label: 'Admin Panel',
                },
              ]
            : []),
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      {children}
    </HeaderDropdown>
  );
};
