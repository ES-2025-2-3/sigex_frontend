import { Navigate, Outlet } from 'react-router-dom';
import { userSessionStore } from '../store/user/UserSessionStore';
import { observer } from 'mobx-react-lite';

const ProtectedRoute = observer(() => {
  const user = userSessionStore.user;

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse font-black text-slate-300 uppercase tracking-widest">
          Verificando credenciais...
        </div>
      </div>
    );
  }

  const isAdmin = String(user.type) === "ADMIN";

  if (!isAdmin) {
    console.error("Acesso negado: Usuário não é ADMIN. Tipo atual:", user.type);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
});

export default ProtectedRoute;