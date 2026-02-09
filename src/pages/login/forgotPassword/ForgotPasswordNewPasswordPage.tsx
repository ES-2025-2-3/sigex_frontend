import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderRegister from "../../../commons/header/HeaderRegister";
import Footer from "../../../commons/footer/Footer";
import Button from "../../../commons/components/Button";

const ForgotPasswordNewPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirm) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    if (password !== confirm) {
      setError("As senhas não coincidem");
      return;
    }

    setError("");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <HeaderRegister />

      <main className="flex-1 flex items-center justify-center px-5">
        <div className="bg-white w-full max-w-[550px] rounded-[40px] p-10 md:p-14 shadow-2xl">
          <h1 className="text-3xl font-bold text-brand-dark mb-2 text-center">
            Nova senha
          </h1>
          <p className="text-gray-500 text-sm text-center mb-8">
            Defina sua nova senha.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Nova senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border ${
                error ? "border-red-400" : "border-gray-100"
              }`}
            />

            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setError("");
              }}
              className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border ${
                error ? "border-red-400" : "border-gray-100"
              }`}
            />

            {error && (
              <span className="text-red-500 text-xs ml-2">{error}</span>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="rounded-2xl py-4"
            >
              REDEFINIR SENHA
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPasswordNewPasswordPage;
