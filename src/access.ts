export default (initialState: any) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  return {
    admin: initialState?.currentUser?.role_and_permissions?.find?.(
      (e) => e?.role_name === 'Super Admin',
    ),
    editor: initialState?.currentUser?.role_and_permissions?.find?.(
      (e) => e?.role_name === 'Editors',
    ),
  };
};
