import axios from './axios';

const BASE_URL = 'api/productsBDD';

export const createProduct = (productData) => axios.post(`${BASE_URL}`, productData);
export const getAllProducts = () => axios.get(`${BASE_URL}`);
export const getProductById = (id) => axios.get(`${BASE_URL}/${id}`);
export const getProductHistory = (id) => axios.get(`${BASE_URL}/${id}/history`);
export const updateProduct = (id, productData) => axios.put(`${BASE_URL}/${id}`, productData);
export const deleteProduct = (id) => axios.delete(`${BASE_URL}/${id}`);


