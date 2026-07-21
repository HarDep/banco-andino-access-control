import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { EmployeeList } from './pages/Employees/EmployeeList';
import { EmployeeDetail } from './pages/Employees/EmployeeDetail';
import { EmployeeForm } from './pages/Employees/EmployeeForm';
import { DocumentTypeList } from './pages/DocumentTypes/DocumentTypeList';
import { DocumentTypeForm } from './pages/DocumentTypes/DocumentTypeForm';
import { CapacityDashboard } from './pages/Capacity/CapacityDashboard';

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/employees" replace />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/create" element={<EmployeeForm />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/employees/:id/edit" element={<EmployeeForm />} />

          <Route path="/document-types" element={<DocumentTypeList />} />
          <Route path="/document-types/create" element={<DocumentTypeForm />} />
          <Route path="/document-types/:id/edit" element={<DocumentTypeForm />} />

          <Route path="/events" element={<CapacityDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;