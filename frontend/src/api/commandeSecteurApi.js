// frontend/src/api/CommandeSecteurApi.js
import axios from './axios';

const BASE_URL = 'api/commande-secteur';

// Créer une nouvelle commande secteur
export const createCommandeSecteur = (data) => axios.post(`${BASE_URL}`, data);
export const getAllCommandeSecteurs = () => axios.get(`${BASE_URL}`);
export const getCommandeSecteurById = (id) => axios.get(`${BASE_URL}/${id}`);
export const updateCommandeSecteur = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteCommandeSecteur = (id) => axios.delete(`${BASE_URL}/${id}`);
