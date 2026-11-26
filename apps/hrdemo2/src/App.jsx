import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Assignments from './pages/Assignments';
import AssignmentForm from './pages/AssignmentForm';
import Reviews from './pages/Reviews';
import ReviewDetail from './pages/ReviewDetail';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Account from './pages/Account';
import Users from './pages/Users';
import { AuthProvider, RequireUser, useAuth, isHrAdmin } from './auth';

/** HR Administrators only. */
function AdminOnly({ children }) {
  const { user } = useAuth();
  return isHrAdmin(user) ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="*" element={
          <RequireUser>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/employees/:id" element={<EmployeeDetail />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/assignments" element={<Assignments />} />
                {/* HR's own forms, which a model may name with camunda:formKey (docs/design/form-keys.md) */}
                <Route path="/forms/assignment" element={<AssignmentForm />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/reviews/:id" element={<ReviewDetail />} />
                <Route path="/account" element={<Account />} />
                <Route path="/users" element={<AdminOnly><Users /></AdminOnly>} />
              </Routes>
            </Layout>
          </RequireUser>
        } />
      </Routes>
    </AuthProvider>
  );
}
