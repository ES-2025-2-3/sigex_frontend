import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderRegister from "../../../commons/header/HeaderRegister";
import Footer from "../../../commons/footer/Footer";
import Button from "../../../commons/components/Button";
import Toast, { ToastType } from "../../../commons/toast/Toast";

const ForgotPasswordEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Campo obrigatório");
      return;
    }

    setToast({ type: "success", message: "Código enviado para o e-mail." });
    navigate("/recuperar-senha/codigo");
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <HeaderRegister />

      <main className="flex-1 flex items-center justify-center px-5">
        <div className="bg-white w-full max-w-[550px] rounded-[40px] p-10 md:p-14 shadow-2xl">

          <h1 className="text-3xl font-bold text-brand-dark mb-2 text-center">
            Recuperar senha
          </h1>
          <p className="text-gray-500 text-sm text-center mb-8">
            Informe seu e-mail institucional.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="E-mail institucional (@ufcg)"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border ${
                error ? "border-red-400" : "border-gray-100"
              }`}
            />
            {error && <span className="text-red-500 text-xs ml-2">{error}</span>}

            <Button type="submit" variant="primary" size="large" className="rounded-2xl py-4">
              ENVIAR CÓDIGO
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPasswordEmailPage;
