import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../commons/button/Button";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-brand-blue mb-4">404</h1>
        
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Ops!
        </h2>
        
        <p className="text-lg text-gray-600 mb-8">
          Desculpe, página não encontrada.
        </p>

        <Button
          onClick={handleGoHome}
          variant="primary"
          size="large"
          className="w-full sm:w-auto"
        >
          Voltar para o Início
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
