import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import Button from "../../commons/components/Button";
import HeaderRegister from "../../commons/header/HeaderRegister";
import Footer from "../../commons/footer/Footer";

const RegisterErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorType = searchParams.get("type");

  let title = "E-mail já Cadastrado!";
  let message =
    "O e-mail informado já está vinculado a uma conta no SIGEX. Tente usar outro e-mail ou recupere sua senha.";

  if (errorType === "generic") {
    title = "Ops! Algo deu errado";
    message =
      "Não conseguimos processar seu cadastro agora. Verifique sua conexão ou tente mais tarde.";
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <HeaderRegister />
      <main className="flex-1 flex items-center justify-center p-5">
        <div className="bg-white w-full max-w-[450px] rounded-[40px] shadow-2xl p-10 text-center border border-white animate-in fade-in zoom-in duration-300">
          <div className="flex justify-center mb-6">
            <FaTimesCircle className="text-red-500 text-7xl" />
          </div>

          <h1 className="text-3xl font-bold text-brand-dark mb-4">{title}</h1>
          <p className="text-gray-500 mb-8">{message}</p>

          <Button
            variant="primary"
            size="large"
            className="w-full rounded-2xl py-4 font-bold text-lg"
            onClick={() => navigate("/cadastro")}
          >
            VOLTAR E CORRIGIR
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterErrorPage;
