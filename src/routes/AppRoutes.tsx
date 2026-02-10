import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "../pages/homepage/HomePage";
import LoginPage from "../pages/login/LoginPage";
import AboutPage from "../pages/about/AboutPage";
import RegisterPage from "../pages/register/RegisterPage";
import EventsPage from "../pages/events/EventsPage";
import EventDetailsPage from "../pages/events/EventDetailsPage";
import BookingRequestPage from "../pages/booking/BookingRequestPage";
import NotFoundPage from "../pages/notfound/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminRequestPage from "../pages/admin/AdminRequestPage";
import UserBookingPage from "../pages/user/UserBookingPage";
import UserRequestPage from "../pages/user/UserRequestPage";
import ConfigurationPage from "../pages/user/UserSettingsPage";
import ForgotPasswordEmailPage from "../pages/login/forgotPassword/ForgotPasswordEmailPage";
import ForgotPasswordCodePage from "../pages/login/forgotPassword/ForgotPasswordCodePage";
import ForgotPasswordNewPasswordPage from "../pages/login/forgotPassword/ForgotPasswordNewPasswordPage";
import EditBookingPage from "../pages/user/EditRequestPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/eventos" element={<EventsPage />} />
      <Route path="/eventos/:id" element={<EventDetailsPage />} />
      <Route path="/reserva" element={<BookingRequestPage />} />
      <Route path="/sobre" element={<AboutPage />} />

      {/* Rotas de Entrada no Sistema */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/recuperar-senha" element={<ForgotPasswordEmailPage />} />
      <Route path="/recuperar-senha/codigo" element={<ForgotPasswordCodePage />} />
      <Route path="/recuperar-senha/nova-senha" element={<ForgotPasswordNewPasswordPage />} />

      {/* Rotas do Usuário */}
      <Route path="/usuario/reservas" element={<UserBookingPage />} />
      <Route path="/usuario/solicitacoes" element={<UserRequestPage />} />
      <Route path="/usuario/solicitacoes/editar/:id" element={<EditBookingPage />} />
      <Route path="/usuario/configuracoes" element={<ConfigurationPage />} />
      <Route path="*" element={<NotFoundPage />} />

      {/* Rotas do Administrador */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/requests" element={<AdminRequestPage />} />
        {/* outras rotas do admin aqui */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
