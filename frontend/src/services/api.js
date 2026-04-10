import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("hrms_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const fetchMe = () => API.get("/auth/me");

// Leaves
export const applyLeave = (data) => API.post("/leaves", data);
export const fetchMyLeaves = () => API.get("/leaves/my");
export const cancelLeave = (id) => API.put(`/leaves/${id}/cancel`);
export const fetchAllLeaves = () => API.get("/leaves/all");
export const decideLeave = (id, status) => API.put(`/leaves/${id}/decide`, { status });

// Attendance
export const markAttendance = (status) => API.post("/attendance/mark", { status });
export const fetchMyAttendance = () => API.get("/attendance/my");
export const fetchAllAttendance = (params) => API.get("/attendance/all", { params });

// Users
export const fetchEmployees = () => API.get("/users/employees");
export const fetchProfile = () => API.get("/users/profile");

// Admin
export const loginAdmin = (data) => API.post("/admin/login", data);

export default API;



  // // ✅ Admin login check
  //     if (form.email === "admin@gmail.com") {
  //       res = await loginAdmin(form);
  //     } else {
  //       res = await loginUser(form);
  //     }