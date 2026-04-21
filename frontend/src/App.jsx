import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DonorDashboard from './pages/DonorDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import FieldOfficerDashboard from './pages/FieldOfficerDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useUser();
  if (!user) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            
            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/donor-dashboard" element={
              <ProtectedRoute allowedRoles={['DONOR']}>
                <DonorDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/relief_coordinator-dashboard" element={
              <ProtectedRoute allowedRoles={['RELIEF_COORDINATOR']}>
                <CoordinatorDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/field_officer-dashboard" element={
              <ProtectedRoute allowedRoles={['FIELD_OFFICER']}>
                <FieldOfficerDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ToastProvider>
  );
}

export default App;
