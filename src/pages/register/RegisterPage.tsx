import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import HeaderRegister from "../../commons/header/HeaderRegister";
import Footer from "../../commons/footer/Footer";
import Button from "../../commons/components/Button";
import Toast, { ToastType } from "../../commons/toast/Toast";
import { userSessionStore } from "../../store/auth/UserSessionStore";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Campo obrigatório";
    if (!formData.email) newErrors.email = "Campo obrigatório";
    if (!formData.password) newErrors.password = "Campo obrigatório";
    if (formData.password !== formData.confirmPassword) {
      setToast({
        type: "error",
        message: "As senhas não coincidem.",
      });
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await userSessionStore.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: "USUARIO",
      });

      window.location.replace("/cadastro-sucesso");
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || "";

      if (backendMessage === "Email already registered") {
        window.location.replace("/cadastro-erro?type=email_exists");
      } else {
        window.location.replace("/cadastro-erro?type=generic");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      {toast && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <HeaderRegister />

      <main className="flex-1 flex items-center justify-center py-12 px-5">
        <div className="bg-white w-full max-w-[550px] rounded-[40px] shadow-2xl p-10 md:p-14 border border-white">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-brand-dark mb-2">
              Criar Conta
            </h1>
            <p className="text-gray-500 text-sm">
              Cadastre-se para acessar o SIGEX.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <input
                type="text"
                name="name"
                placeholder="Nome Completo"
                disabled={userSessionStore.isLoading}
                className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-100 focus:ring-brand-blue/20"
                }`}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <span className="text-red-500 text-xs ml-2 mt-1 font-medium">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <input
                type="email"
                name="email"
                placeholder="E-mail institucional (@ufcg)"
                disabled={userSessionStore.isLoading}
                className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-100 focus:ring-brand-blue/20"
                }`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="text-red-500 text-xs ml-2 mt-1 font-medium">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Senha"
                disabled={userSessionStore.isLoading}
                className={`w-full px-6 py-4 pr-14 rounded-2xl bg-gray-50 border outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-100 focus:ring-brand-blue/20"
                }`}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <span className="text-red-500 text-xs ml-2 mt-1 font-medium">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirme sua senha"
                disabled={userSessionStore.isLoading}
                className={`w-full px-6 py-4 pr-14 rounded-2xl bg-gray-50 border outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-100 focus:ring-brand-blue/20"
                }`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs ml-2 mt-1 font-medium">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="w-full rounded-2xl py-4 font-bold text-lg"
              disabled={userSessionStore.isLoading}
            >
              {userSessionStore.isLoading
                ? "CADASTRANDO..."
                : "CRIAR MINHA CONTA"}
            </Button>

            <p className="text-center text-gray-500 mt-6">
              Já possui uma conta?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-brand-blue font-bold cursor-pointer hover:underline"
              >
                Entrar agora
              </span>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default observer(RegisterPage);
