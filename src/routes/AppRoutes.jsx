import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/homepage/HomePage";
import LoginPage from "../pages/login/LoginPage";
import AboutPage from "../pages/about/AboutPage";
import RegisterPage from "../pages/register/RegisterPage";
import EventsPage from '../pages/events/EventsPage';
import NotFoundPage from "../pages/notfoundpage/NotFoundPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/eventos" element={<EventsPage/>} />
      <Route path="/sobre" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
