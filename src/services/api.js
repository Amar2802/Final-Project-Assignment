import axios from "axios";

const API = "http://localhost:5000/api/tasks";

export const getTasks = (params = {}) => axios.get(API, { params });
export const createTask = (data) => axios.post(API, data);
export const updateTask = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteTask = (id) => axios.delete(`${API}/${id}`);