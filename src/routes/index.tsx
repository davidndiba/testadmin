const routes: any[] = [
  {
    path: '/',
    redirect: '/access',
  },
  {
    name: '',
    path: '/home',
    component: './Home',
  },

  {
    name: 'User',
    layout: false,
    routes: [
      {
        name: 'Login',
        path: '/user/login',
        component: './User/Login',
      },
      {
        name: 'Logout',
        path: '/user/logout',
        component: './User/Login/Logout',
      },
    ],
  },
  {
    name: 'Reset Password',
    path: '/reset-password',
    component: './ResetPassword/ResetPassword', 
    layout: false,
  },
  {
    name: 'Confirm Email',
    path: '/auth/confirm-email/:token',
    component: './ConfirmEmail/ConfirmEmail', 
    layout: false,
  },
  {
    name: 'Activate Email Account',
    path: '/auth/activate',
    component: './Activate/Activate', 
    layout: false,
  },
  {
    name: 'Profile',
    path: '/users/:id',
    component: './Access/Components/users/Profile',
    access: 'admin',
  },
  {
    name: 'Access Control',
    path: '/access',
    component: './Access',
    access: 'admin',
  },
  {
    name: 'Activity Logs',
    path: '/activity',
    component: './Activity',
    access: 'admin',
  },

  {
    name: 'System Settings',
    path: '/system-settings',
    icon: 'setting',
    access: 'admin',
    routes: [
      {
        name: 'General Settings',
        path: '/system-settings/generalsettings',
        component: './SystemSettings/GeneralSettings',
      },
      {
        name: 'Email Settings',
        path: '/system-settings/emailsettings',
        component: './SystemSettings/EmailSettings',
      },
      {
        name: 'Security Settings',
        path: '/system-settings/securitysettings',
        component: './SystemSettings/SecuritySettings',
      },
    ],
  },
  {
    name: 'Maintenance',
    path: '/maintenance',
    access: 'admin',
    routes: [
      {
        name: 'System Backup',
        path: '/maintenance/systembackup',
        component: './Maintenance/SystemBackup',
      },
      {
        name: 'System Information',
        path: '/maintenance/systeminformation',
        component: './Maintenance/SystemInformation',
      },
    ],
  },

  // {
  //   name: 'Dashboard',
  //   path: '/dashboard',
  //   component: './UserSide/Dashboard',
  //   access: 'editor',
  // },
  // {
  //   name: 'Planner',
  //   path: '/planner',
  //   component: './UserSide/Planner',
  //   access: 'editor',
  // },
  // {
  //   name: 'Data Sheet',
  //   path: '/datasheet',
  //   component: './UserSide/DataSheet',
  //   access: 'editor',
  // },
  // {
  //   name: 'Mapping',
  //   path: '/mapping',
  //   access: 'editor',
  //   routes: [
  //     {
  //       name: 'Manage Job Types',
  //       path: '/mapping/managejobtypes',
  //       component: './UserSide/Mapping/ManageJobTypes',
  //     },
  //     {
  //       name: 'Job Areas',
  //       path: '/mapping/jobareas',
  //       component: './UserSide/Mapping/JobAreas',
  //     },
  //     {
  //       name: 'Lines & Tanks',
  //       path: '/mapping/linesandtanks',
  //       component: './UserSide/Mapping/LinesAndTanks',
  //     },
  //   ],
  // },
  // {
  //   name: 'Users',
  //   path: '/users',
  //   component: './UserSide/Users',
  //   access: 'editor',
  // },
];

export default routes;
