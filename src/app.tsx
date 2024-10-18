import {
  history,
  RunTimeLayoutConfig,
  request as umiRequest,
} from '@umijs/max';
import { AvatarDropdown } from './components/RightContent';
import { errorConfig } from './requestErrorConfig';

// Fetch user profile informationmenu
export async function getInitialState(): Promise<{
  name: string;
  fetchUserInfo: () => void;
  currentUser?: any;
}> {
  const fetchUserInfo = async () => {
    try {
      const response = await umiRequest(`/user/profile`);
      return {
        ...response?.data,
      };
    } catch (error) {
      console.log(error);
    }
  };

  if (history.location.pathname !== '/user/login' && !history.location.pathname.includes("/auth/confirm-email")) {
    const currentUser = await fetchUserInfo();
    return {
      currentUser: {
        ...currentUser,
      },
      fetchUserInfo,
      name: currentUser?.user?.display_name,
    };
  }

  return { name: 'Admin Panel', fetchUserInfo };
}

// Handle logout function

export const layout: RunTimeLayoutConfig = ({ initialState }: any) => {
  console.log(initialState);
  return {
    layout: initialState?.layout ?? 'top',
    footerRender: false,
    fixedHeader: true,
    fixSiderbar: true,
    siderWidth: 200,
    actionsRender: () => null,
    // actionsRender: () => [
    //   <Button
    //     key="logout"
    //     icon={<LogoutOutlined />}
    //     type="text"
    //     onClick={handleLogout}
    //     style={{ color: '#f5222d', marginRight: 16 }}
    //   >
    //     Logout
    //   </Button>,
    // ],
    menu: {
      locale: false,
    },
    avatarProps: {
      src: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      title: initialState?.currentUser?.user?.display_name,
      render: (_, avatarChildren) => {
        return <AvatarDropdown menu>{avatarChildren}</AvatarDropdown>;
      },
    },
    // rightContentRender: () => [
    //   <Button
    //     key="logout"
    //     icon={<LogoutOutlined />}
    //     type="text"
    //     onClick={handleLogout}
    //     style={{ color: '#f5222d', marginRight: 16 }}
    //   >
    //     Logout
    //   </Button>,
    // ],
  };
};

export const request = {
  ...errorConfig,
};