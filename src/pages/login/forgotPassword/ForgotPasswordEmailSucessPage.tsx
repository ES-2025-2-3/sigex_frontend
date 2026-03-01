import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelopeOpenText } from "react-icons/fa";
import Button from "../../../commons/components/Button";
import HeaderRegister from "../../../commons/header/HeaderRegister";
import Footer from "../../../commons/footer/Footer";

const ForgotPasswordEmailSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <HeaderRegister />
      <main className="flex-1 flex items-center justify-center p-5">
        <div className="bg-white w-full max-w-[500px] rounded-[40px] shadow-2xl p-10 md:p-14 text-center border border-white animate-in fade-in zoom-in duration-300">
          <div className="flex justify-center mb-8">
            <div className="bg-brand-blue/10 p-6 rounded-full">
              <FaEnvelopeOpenText className="text-brand-blue text-7xl" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-brand-dark mb-4 italic uppercase tracking-tighter">
            E-mail Enviado!
          </h1>

          <p className="text-gray-500 mb-2 font-medium">
            Se o endereço informado estiver cadastrado, você receberá um link
            para redefinir sua senha em instantes.
          </p>

          <p className="text-slate-400 text-sm mb-10 italic">
            Não esqueça de verificar a sua caixa de spam ou lixo eletrônico.
          </p>

          <div className="flex flex-col gap-4">
            <Button
              variant="primary"
              size="large"
              className="w-full rounded-2xl py-5 font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-blue/20"
              onClick={() => navigate("/login")}
            >
              VOLTAR PARA O LOGIN
            </Button>

            <button
              onClick={() => navigate("/recuperar-senha")}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-blue transition-colors underline underline-offset-4"
            >
              Não recebeu? Tentar novamente
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPasswordEmailSuccessPage;
