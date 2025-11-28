import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from '../pages/homepage/HomePage';
import LoginPage from '../pages/login/LoginPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;