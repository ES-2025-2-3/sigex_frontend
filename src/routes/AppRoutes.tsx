import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/homepage/HomePage";
import LoginPage from "../pages/login/LoginPage";
import AboutPage from "../pages/about/AboutPage";
import RegisterPage from "../pages/register/RegisterPage";
import EventsPage from "../pages/events/EventsPage";
import EventDetailsPage from "../pages/events/EventDetailsPage";
import BookingRequestPage from "../pages/reservation/ReservationRequestPage";
import NotFoundPage from "../pages/notfound/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import AdminProfilePage from "../pages/admin/AdminProfilePage";

import UserBookingPage from "../pages/user/UserReservationPage";
import UserRequestPage from "../pages/user/UserRequestPage";
import ConfigurationPage from "../pages/user/UserSettingsPage";
import EditBookingPage from "../pages/user/EditRequestPage";

import ForgotPasswordEmailPage from "../pages/login/forgotPassword/ForgotPasswordEmailPage";
import ForgotPasswordCodePage from "../pages/login/forgotPassword/ForgotPasswordCodePage";
import ForgotPasswordNewPasswordPage from "../pages/login/forgotPassword/ForgotPasswordNewPasswordPage";
import AdminRequestPage from "../pages/admin/AdminRequestPage";
import AdminRoomPage from "../pages/admin/AdminRoomPage";
import AdminStaffManagementPage from "../pages/admin/AdminStaffManagementPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/eventos" element={<EventsPage />} />
      <Route path="/eventos/:id" element={<EventDetailsPage />} />
      <Route path="/reserva" element={<BookingRequestPage />} />
      <Route path="/sobre" element={<AboutPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/recuperar-senha" element={<ForgotPasswordEmailPage />} />
      <Route
        path="/recuperar-senha/codigo"
        element={<ForgotPasswordCodePage />}
      />
      <Route
        path="/recuperar-senha/nova-senha"
        element={<ForgotPasswordNewPasswordPage />}
      />

      {/* Usuário Comum */}
      <Route path="/usuario/reservas" element={<UserBookingPage />} />
      <Route path="/usuario/solicitacoes" element={<UserRequestPage />} />
      <Route
        path="/usuario/solicitacoes/editar/:id"
        element={<EditBookingPage />}
      />
      <Route path="/usuario/configuracoes" element={<ConfigurationPage />} />

      <Route element={<ProtectedRoute />}>
        {/* Comum a Admin e Funcionário */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/solicitacoes" element={<AdminRequestPage />} />
        <Route path="/admin/espacos" element={<AdminRoomPage />} />
        <Route path="/admin/configuracoes" element={<AdminSettingsPage />} />
        <Route path="/admin/perfil" element={<AdminProfilePage />} />

        {/* EXCLUSIVO: Administrador do Sistema */}
        <Route path="/admin/funcionarios" element={<AdminStaffManagementPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
