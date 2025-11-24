import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Customers from './pages/Customers';
import RPL from './pages/RPL';
import Comments from './pages/Comments';
import Countries from './pages/Countries';
import APRV from './pages/APRV';
import Zyme from './pages/Zyme';
import ScreeningCopilot from './pages/ScreeningCopilot';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Component to protect routes
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="customers" element={<Customers />} />
          <Route path="rpl" element={<RPL />} />
          <Route path="comments" element={<Comments />} />
          <Route path="countries" element={<Countries />} />
          <Route path="aprv" element={<APRV />} />
          <Route path="zyme" element={<Zyme />} />
          <Route path="copilot" element={<ScreeningCopilot />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;