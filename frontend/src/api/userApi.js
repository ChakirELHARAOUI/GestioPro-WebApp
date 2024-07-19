import axios from './axios';

const BASE_URL = 'api/users';

export const createUser = (userData) => axios.post(`${BASE_URL}`, userData);
export const getAllUsers = () => axios.get(`${BASE_URL}`);
export const getUserById = (id) => axios.get(`${BASE_URL}/${id}`);
export const updateUser = (id, userData) => axios.put(`${BASE_URL}/${id}`, userData);
export const deleteUser = (id) => axios.delete(`${BASE_URL}/${id}`);

