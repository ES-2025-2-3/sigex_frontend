import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/homepage/HomePage";
import LoginPage from "../pages/login/LoginPage";
import ForgotPasswordEmailPage from "../pages/login/forgotPassword/ForgotPasswordEmailPage";
import ForgotPasswordCodePage from "../pages/login/forgotPassword/ForgotPasswordCodePage";
import ForgotPasswordNewPasswordPage from "../pages/login/forgotPassword/ForgotPasswordNewPasswordPage";
import AboutPage from "../pages/about/AboutPage";
import RegisterPage from "../pages/register/RegisterPage";
import EventsPage from '../pages/events/EventsPage';
import EventDetailsPage from "../pages/events/EventDetailsPage";
import BookingRequestPage from "../pages/booking/BookingRequestPage";
import NotFoundPage from "../pages/notfound/NotFoundPage";
import ProtectedRoute from './ProtectedRoute';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import SettingsPage from '../pages/admin/SettingsPage';
import SpacesPage from '../pages/admin/SpacesPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/eventos" element={<EventsPage/>} />
      <Route path="/reserva" element={<BookingRequestPage />} />
      <Route path="/sobre" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recuperar-senha" element={<ForgotPasswordEmailPage />} />
      <Route path="/recuperar-senha/codigo" element={<ForgotPasswordCodePage />} />
      <Route path="/recuperar-senha/nova-senha" element={<ForgotPasswordNewPasswordPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/eventos/:id" element={<EventDetailsPage />} />
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route index element={<AdminDashboardPage/>} />
        <Route path="espacos" element={<SpacesPage/>} />
        <Route path="configuracoes" element={<SettingsPage/>} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
