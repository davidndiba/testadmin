// import React, { useState, useEffect } from 'react';
// import { Table, Checkbox, Button, message, Modal } from 'antd';
// import { request } from 'umi';

// interface Role {
//   id: string;
//   name: string;
//   permissions: Permission[]; // Add permissions array to Role interface
// }

// interface Permission {
//   id: string;
//   name: string;
// }

// const PermissionsManagement: React.FC = () => {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [permissions, setPermissions] = useState<Permission[]>([]);
//   const [permissionsByRole, setPermissionsByRole] = useState<Record<string, Set<string>>>({});
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch roles
//         const rolesResponse = await request('/roles', { method: 'GET' });
//         console.log('Roles API response:', rolesResponse);

//         if (!rolesResponse.data.data || !Array.isArray(rolesResponse.data.data)) {
//           throw new Error('Invalid roles data');
//         }
//         const fetchedRoles: Role[] = rolesResponse.data.data;
//         setRoles(fetchedRoles);

//         // Fetch permissions
//         const permissionsResponse = await request('/permissions', { method: 'GET' });
//         console.log('Permissions API response:', permissionsResponse);

//         if (!permissionsResponse.data || !Array.isArray(permissionsResponse.data)) {
//           throw new Error('Invalid permissions data');
//         }
//         setPermissions(permissionsResponse.data);

//         // Initialize permissionsByRole with the permissions already assigned to each role
//         const initialPermissionsByRole = fetchedRoles.reduce((acc: Record<string, Set<string>>, role: Role) => {
//           acc[role.id] = new Set(role.permissions.map((perm) => perm.id)); // Assign existing permissions to each role
//           return acc;
//         }, {});
//         setPermissionsByRole(initialPermissionsByRole);
//       } catch (error) {
//         message.error(`Failed to fetch data: ${error.message}`);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleCheckboxChange = async (roleId: string, permissionId: string, checked: boolean) => {
//     try {
//       // Fetch current permissions for the role
//       const rolePermissions = permissionsByRole[roleId] || new Set<string>();

//       // Update permissions based on checkbox state
//       const updatedPermissions = new Set(rolePermissions);
//       if (checked) {
//         updatedPermissions.add(permissionId);
//       } else {
//         updatedPermissions.delete(permissionId);
//       }

//       // Send the updated permissions to the server
//       const response = await request(`/roles/${roleId}`, {
//         method: 'PUT',
//         data: {
//           permissions: Array.from(updatedPermissions),
//         },
//       });

//       console.log('Server response:', response);

//       // Check if the response is successful and contains updated data
//       if (response.success) {
//         // Update state with the new permissions
//         setPermissionsByRole((prev) => ({
//           ...prev,
//           [roleId]: updatedPermissions,
//         }));
//         message.success('Permissions updated successfully');
//       } else {
//         throw new Error(response.message || 'Failed to update permissions');
//       }
//     } catch (error) {
//       message.error(`Failed to update permissions: ${error.message}`);
//     }
//   };

//   const columns = [
//     {
//       title: 'Permission',
//       dataIndex: 'name',
//       key: 'name',
//       render: (text: string) => <span>{text}</span>,
//     },
//     ...roles.map((role) => ({
//       title: role.name,
//       key: role.id,
//       render: (permission: Permission) => (
//         <Checkbox
//           checked={permissionsByRole[role.id]?.has(permission.id) || false}
//           onChange={(e) => handleCheckboxChange(role.id, permission.id, e.target.checked)}
//         />
//       ),
//     })),
//   ];

//   const dataSource = permissions.map((permission) => ({
//     key: permission.id,
//     ...permission,
//   }));

//   return (
//     <div>
//       <Table
//         dataSource={dataSource}
//         columns={columns}
//         pagination={false}
//         scroll={{ x: 'max-content' }}
//         rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
//         style={{ border: '1px solid #f0f0f0', borderRadius: '4px' }}
//       />

//       <Modal
//         title="Manage Permissions"
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//       >
//         {/* Modal content here */}
//       </Modal>
//     </div>
//   );
// };

// export default PermissionsManagement;
import React, { useState, useEffect } from 'react';
import { Table, Checkbox, Button, message, Modal } from 'antd';
import { request } from 'umi';

interface Role {
  id: string;
  name: string;
  permissions: Permission[]; // Add permissions array to Role interface
}

interface Permission {
  id: string;
  name: string;
}

const PermissionsManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsByRole, setPermissionsByRole] = useState<Record<string, Set<string>>>({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch roles
        const rolesResponse = await request('/roles', { method: 'GET' });
        console.log('Roles API response:', rolesResponse);

        if (!rolesResponse.data.data || !Array.isArray(rolesResponse.data.data)) {
          throw new Error('Invalid roles data');
        }
        const fetchedRoles: Role[] = rolesResponse.data.data;
        setRoles(fetchedRoles);

        // Fetch permissions
        const permissionsResponse = await request('/permissions', { method: 'GET' });
        console.log('Permissions API response:', permissionsResponse);

        if (!permissionsResponse.data || !Array.isArray(permissionsResponse.data)) {
          throw new Error('Invalid permissions data');
        }
        setPermissions(permissionsResponse.data);

        // Initialize permissionsByRole with the permissions already assigned to each role
        const initialPermissionsByRole = fetchedRoles.reduce((acc: Record<string, Set<string>>, role: Role) => {
          acc[role.id] = new Set(role.permissions.map((perm) => perm.id)); // Assign existing permissions to each role
          return acc;
        }, {});
        setPermissionsByRole(initialPermissionsByRole);
      } catch (error) {
        if (error instanceof Error) {
          message.error(`Failed to fetch data: ${error.message}`);
        } else {
          message.error('Failed to fetch data due to an unknown error');
        }
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = async (roleId: string, permissionId: string, checked: boolean) => {
    try {
      // Fetch current permissions for the role
      const rolePermissions = permissionsByRole[roleId] || new Set<string>();

      // Update permissions based on checkbox state
      const updatedPermissions = new Set(rolePermissions);
      if (checked) {
        updatedPermissions.add(permissionId);
      } else {
        updatedPermissions.delete(permissionId);
      }

      // Send the updated permissions to the server
      const response = await request(`/roles/${roleId}`, {
        method: 'PUT',
        data: {
          permissions: Array.from(updatedPermissions),
        },
      });

      console.log('Server response:', response);

      // Check if the response is successful and contains updated data
      if (response.success) {
        // Update state with the new permissions
        setPermissionsByRole((prev) => ({
          ...prev,
          [roleId]: updatedPermissions,
        }));
        message.success('Permissions updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update permissions');
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(`Failed to update permissions: ${error.message}`);
      } else {
        message.error('Failed to update permissions due to an unknown error');
      }
    }
  };

  const columns = [
    {
      title: 'Permission',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span>{text}</span>,
    },
    ...roles.map((role) => ({
      title: role.name,
      key: role.id,
      render: (permission: Permission) => (
        <Checkbox
          checked={permissionsByRole[role.id]?.has(permission.id) || false}
          onChange={(e) => handleCheckboxChange(role.id, permission.id, e.target.checked)}
        />
      ),
    })),
  ];

  const dataSource = permissions.map((permission) => ({
    key: permission.id,
    ...permission,
  }));

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
        style={{ border: '1px solid #f0f0f0', borderRadius: '4px' }}
      />

      <Modal
        title="Manage Permissions"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {/* Modal content here */}
      </Modal>
    </div>
  );
};

export default PermissionsManagement;
