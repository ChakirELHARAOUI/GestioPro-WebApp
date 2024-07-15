import axios from './axios';

export const getAllProducts = () => axios.get('api/products/getAllProductsBDD');
export const getProductById = (id) => axios.get(`api/products/getProductBDD?id=${id}`);
export const createProduct = (productData) => axios.post('api/products/createProductBDD', productData);
export const updateProduct = (id, productData) => axios.put(`api/products/updateProductBDD?id=${id}`, productData);
export const deleteProduct = (id) => axios.delete(`api/products/deleteProductBDD?id=${id}`);
export const getProductHistory = (id) => axios.get(`api/products/getProductBDDHistory?id=${id}`);
