import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../../commons/components/LoadingSpinner";

const ForgotPasswordValidatePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("reset_token", token);
      
      const timer = setTimeout(() => {
        navigate("/recuperar-senha/nova-senha");
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      navigate("/recuperar-senha");
    }
  }, [token, navigate]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-bg-main gap-6">
      <LoadingSpinner />
      <div className="text-brand-dark font-black uppercase tracking-[0.2em] text-xs animate-pulse">
        Validando link de acesso...
      </div>
    </div>
  );
};

export default ForgotPasswordValidatePage;