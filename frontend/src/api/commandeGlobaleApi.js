// frontend/src/api/commandeGlobaleApi.js
import axios from './axios';

const BASE_URL = 'api/commande-globale';

export const createCommandeGlobale = (data) => axios.post(`${BASE_URL}`, data);
export const getAllCommandeGlobale = () => axios.get(`${BASE_URL}`);
export const getCommandeGlobale = (id) => axios.get(`${BASE_URL}/${id}`);
export const getCommandeGlobaleById = (id) => axios.get(`${BASE_URL}/2/${id}`);         //TEST
export const updateCommandeGlobale = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const getQuantiteProduitsForCommandeGlobale = (id) => axios.get(`${BASE_URL}/${id}/quantiteProduits`);
export const deleteCommandeGlobale = (id) => axios.delete(`${BASE_URL}/${id}`);
