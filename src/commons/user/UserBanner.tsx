import { observer } from "mobx-react-lite";
import { FaUserCircle } from "react-icons/fa";
import { userSessionStore } from "../../store/auth/UserSessionStore";

const UserBanner = observer(() => {
  const user = userSessionStore.currentUser;
  if (!user) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center">
          <FaUserCircle size={32} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Sessão Ativa
          </p>
          <h2 className="text-lg font-bold text-slate-800">
            {user.name}
          </h2>
        </div>
      </div>
    </div>
  );
});

export default UserBanner;