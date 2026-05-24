import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const createDesign = (formData) => API.post('/designs', formData, { 
  headers: { 'Content-Type': 'multipart/form-data' } 
});
export const getUserDesigns = () => API.get('/designs');
export const getDesignById = (id) => API.get(`/designs/${id}`);

export default API;