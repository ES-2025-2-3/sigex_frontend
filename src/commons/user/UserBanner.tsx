import { observer } from "mobx-react-lite";
import { FaUserCircle } from "react-icons/fa";
import { userSessionStore } from "../../store/user/UserSessionStore";
import { mockUser } from "../../../mock/user";

const UserBanner = observer(() => {
  const userName = userSessionStore.currentUser?.name || mockUser.name;
  const userEmail = userSessionStore.currentUser?.email || mockUser.email;
  const registration = userSessionStore.currentUser?.registrationNumber || mockUser.registrationNumber;

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
            {userName}
          </h2>
        </div>
      </div>
      <div className="hidden md:block text-right">
        <p className="text-xs text-slate-500 font-semibold">
          Matrícula: {registration}
        </p>
        <p className="text-xs text-brand-blue font-medium">
          {userEmail}
        </p>
      </div>
    </div>
  );
});

export default UserBanner;