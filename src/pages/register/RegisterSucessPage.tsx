import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Button from "../../commons/components/Button";
import HeaderRegister from "../../commons/header/HeaderRegister";
import Footer from "../../commons/footer/Footer";

const RegisterSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <HeaderRegister />
      <main className="flex-1 flex items-center justify-center p-5">
        <div className="bg-white w-full max-w-[450px] rounded-[40px] shadow-2xl p-10 text-center border border-white animate-in fade-in zoom-in duration-300">
          <div className="flex justify-center mb-6">
            <FaCheckCircle className="text-green-500 text-7xl" />
          </div>

          <h1 className="text-3xl font-bold text-brand-dark mb-4">
            Conta Criada!
          </h1>

          <p className="text-gray-500 mb-8">
            Seu cadastro no <strong>SIGEX</strong> foi realizado com sucesso.
            Agora você já pode acessar a plataforma.
          </p>

          <Button
            variant="primary"
            size="large"
            className="w-full rounded-2xl py-4 font-bold text-lg"
            onClick={() => navigate("/login")}
          >
            IR PARA O LOGIN
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterSuccessPage;
