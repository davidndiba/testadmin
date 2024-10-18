import { request } from '@umijs/max';

const baseUrl = 'https://planner-dev-backend.microvision.co.ke/api/v1';

export const queryUsers = () => request(`${baseUrl}/users`);
// register
export const addUser = (data: any) => 
  request(`${baseUrl}/auth/register`, {
    method: 'POST',
    data,
  });
// add users
export const updateUser = (userId: string, data: any) => 
  request(`${baseUrl}/users/${userId}`, {
    method: 'PUT',
    data,
  });

export const deleteUser = (userId: string) => 
  request(`${baseUrl}/users/${userId}`, {
    method: 'DELETE',
  });

export const getUser = (userId: string) => 
  request(`${baseUrl}/users/${userId}`);
