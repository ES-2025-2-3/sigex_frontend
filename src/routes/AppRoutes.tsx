import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from '../pages/homepage/HomePage';
import LoginPage from '../pages/login/LoginPage';
import AboutPage from '../pages/about/AboutPage';
import EventsPage from '../pages/events/EventsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/eventos" element={<EventsPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/sobre" element={<AboutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;