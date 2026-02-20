import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { userSessionStore } from '../store/auth/UserSessionStore';
import { observer } from 'mobx-react-lite';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute = observer(({ adminOnly = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const user = userSessionStore.currentUser;
  const hasToken = !!localStorage.getItem('sigex_token');

  if (!user && hasToken) {
    return <div className="p-10 text-center animate-pulse">Verificando acesso...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isManagement = user.type === 'ADMIN' || user.type === 'SERVIDOR_TECNICO_ADMINISTRATIVO';

  if (adminOnly && !isManagement) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
});

export default ProtectedRoute;