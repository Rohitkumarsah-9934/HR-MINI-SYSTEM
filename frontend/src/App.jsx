import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import EmployeeDashboard from "./pages/EmployeeDashboard";
import ApplyLeave from "./pages/ApplyLeave";
import MyLeaves from "./pages/MyLeaves";
import Attendance from "./pages/Attendance";

import AdminDashboard from "./pages/AdminDashboard";
import ManageLeaves from "./pages/ManageLeaves";
import AllAttendance from "./pages/AllAttendance";
import Employees from "./pages/Employees";




// Role-based dashboard redirect
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === "admin"
    ? <AdminDashboard />
    : <EmployeeDashboard />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
            
             
              {/* Dashboard — role-based */}
              <Route path="dashboard" element={<DashboardRedirect />} />
            
              


              {/* Employee routes */}
              <Route path="apply-leave" element={
                <PrivateRoute><ApplyLeave /></PrivateRoute>
              } />
              <Route path="my-leaves" element={
                <PrivateRoute><MyLeaves /></PrivateRoute>
              } />
              <Route path="attendance" element={
                <PrivateRoute><Attendance /></PrivateRoute>
              } />

              {/* Admin routes */}
              <Route path="manage-leaves" element={
                <PrivateRoute adminOnly><ManageLeaves /></PrivateRoute>
              } />
              <Route path="all-attendance" element={
                <PrivateRoute adminOnly><AllAttendance /></PrivateRoute>
              } />
              <Route path="employees" element={
                <PrivateRoute adminOnly><Employees /></PrivateRoute>
              } />

              {/* Shared */}
              <Route path="profile" element={
                <PrivateRoute><Profile /></PrivateRoute>
              } />

              {/* Default redirect */}
              <Route index element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
