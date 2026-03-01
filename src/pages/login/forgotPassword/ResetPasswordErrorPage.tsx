import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import Button from "../../../commons/components/Button";
import HeaderRegister from "../../../commons/header/HeaderRegister";
import Footer from "../../../commons/footer/Footer";

const ResetPasswordErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <HeaderRegister />
      <main className="flex-1 flex items-center justify-center p-5">
        <div className="bg-white w-full max-w-[450px] rounded-[40px] shadow-2xl p-10 text-center border border-white animate-in fade-in zoom-in duration-300">
          <div className="flex justify-center mb-6">
            <FaExclamationTriangle className="text-amber-500 text-7xl" />
          </div>

          <h1 className="text-3xl font-black text-brand-dark mb-4 italic uppercase tracking-tighter">
            Link Inválido
          </h1>

          <p className="text-gray-500 mb-8 font-medium">
            Este link de recuperação expirou ou já foi utilizado. Por favor,
            solicite um novo acesso.
          </p>

          <Button
            variant="primary"
            size="large"
            className="w-full rounded-2xl py-5 font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-blue/20"
            onClick={() => navigate("/recuperar-senha")}
          >
            SOLICITAR NOVO LINK
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPasswordErrorPage;
