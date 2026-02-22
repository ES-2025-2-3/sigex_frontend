import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import Button from "../../commons/components/Button";
import HeaderRegister from "../../commons/header/HeaderRegister";
import Footer from "../../commons/footer/Footer";

const LoginErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <HeaderRegister />
      <main className="flex-1 flex items-center justify-center p-5">
        <div className="bg-white w-full max-w-[450px] rounded-[40px] shadow-2xl p-10 text-center border border-white animate-in fade-in zoom-in duration-300">
          <div className="flex justify-center mb-6">
            <FaTimesCircle className="text-red-500 text-7xl" />
          </div>

          <h1 className="text-3xl font-bold text-brand-dark mb-4">
            Falha no Login
          </h1>

          <p className="text-gray-500 mb-8">
            E-mail ou senha incorretos. Por favor, verifique suas credenciais e
            tente novamente.
          </p>

          <Button
            variant="primary"
            size="large"
            className="w-full rounded-2xl py-4 font-bold text-lg"
            onClick={() => window.location.replace("/login")}
          >
            TENTAR NOVAMENTE
          </Button>

          <button
            onClick={() => navigate("/recuperar-senha")}
            className="mt-6 text-brand-blue font-bold hover:underline block w-full text-center"
          >
            Esqueci minha senha
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginErrorPage;
