import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "../pages/homepage/HomePage";
import LoginPage from "../pages/login/LoginPage";
import AboutPage from "../pages/about/AboutPage";
import RegisterPage from "../pages/register/RegisterPage";
import EventsPage from '../pages/events/EventsPage';
import EventDetailsPage from "../pages/events/EventDetailsPage";
import BookingRequestPage from "../pages/booking/BookingRequestPage";
import NotFoundPage from "../pages/notfound/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import ReservationPage from "../pages/user/ReservationPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/eventos" element={<EventsPage/>} />
      <Route path="/reserva" element={<BookingRequestPage />} />
      <Route path="/sobre" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/eventos/:id" element={<EventDetailsPage />} />
      <Route path="*" element={<NotFoundPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        {/* outras rotas do admin aqui */}
      </Route>
      <Route path= "/usuario/reserva" element={<ReservationPage />}/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
