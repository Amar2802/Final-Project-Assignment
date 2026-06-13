import axios from "axios";

const API = "http://localhost:5000/api/tasks";
const USER_API = "http://localhost:5000/api/users";

// Automatically inject JWT Bearer Token into headers if saved in localStorage
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Task CRUD Operations
export const getTasks = (params = {}) => axios.get(API, { params });
export const createTask = (data) => axios.post(API, data);
export const updateTask = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteTask = (id) => axios.delete(`${API}/${id}`);

// Authentication Operations
export const registerUser = (userData) => axios.post(`${USER_API}/register`, userData);
export const loginUser = (loginData) => axios.post(`${USER_API}/login`, loginData);