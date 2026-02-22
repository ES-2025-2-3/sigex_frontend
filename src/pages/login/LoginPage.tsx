import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import HeaderRegister from "../../commons/header/HeaderRegister";
import Footer from "../../commons/footer/Footer";
import Button from "../../commons/components/Button";
import Toast, { ToastType } from "../../commons/toast/Toast";
import { userSessionStore } from "../../store/auth/UserSessionStore";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: localStorage.getItem("temp_login_email") || "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("sigex_toast");
    if (raw) {
      const t = JSON.parse(raw);
      setToast(t);
      sessionStorage.removeItem("sigex_toast");
    }
  }, []);

  useEffect(() => {
    if (location.state?.toast) {
      setToast({
        type: "success",
        message: location.state.toast,
      });
    }

    if (userSessionStore.isLoggedIn && !location.state?.fromRegister) {
      const from = location.state?.from?.pathname;
      const user = userSessionStore.currentUser;

      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(user?.canAccessAdminArea ? "/admin" : "/", { replace: true });
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Campo obrigatório";
    if (!formData.password) newErrors.password = "Campo obrigatório";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      localStorage.removeItem("temp_login_email");

      await userSessionStore.login(formData);

      setToast({
        type: "success",
        message: "Login realizado com sucesso!",
      });
    } catch (error: any) {
      console.error("ERRO NO LOGIN:", error);

      localStorage.setItem("temp_login_email", formData.email);
      window.location.replace("/login-erro");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <HeaderRegister />

      <main className="flex-1 flex items-center justify-center py-12 px-5">
        <div className="bg-white w-full max-w-[550px] rounded-[40px] shadow-2xl shadow-strong-dark/5 p-10 md:p-14 border border-white">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-brand-dark mb-2">
              Entrar no Sigex
            </h1>
            <p className="text-gray-500 text-sm">
              Preencha os campos para entrar no SIGEX.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col">
              <input
                type="email"
                name="email"
                placeholder="E-mail institucional (@ufcg)"
                className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-100 focus:ring-brand-blue/20"
                }`}
                value={formData.email}
                onChange={handleChange}
                disabled={userSessionStore.isLoading}
              />
              {errors.email && (
                <span className="text-red-500 text-xs ml-2 mt-1 font-medium">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Senha"
                  className={`w-full px-6 py-4 pr-14 rounded-2xl bg-gray-50 border outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-100 focus:ring-brand-blue/20"
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={userSessionStore.isLoading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password && (
                <span className="text-red-500 text-xs ml-2 mt-1 font-medium">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="mt-4">
              <Button
                variant="primary"
                size="large"
                className="w-full rounded-2xl py-4 font-bold text-lg"
                type="submit"
                disabled={userSessionStore.isLoading}
              >
                {userSessionStore.isLoading ? "CARREGANDO..." : "ENTRAR"}
              </Button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/recuperar-senha")}
                className="mt-4 text-brand-blue cursor-pointer font-bold hover:underline"
              >
                Esqueceu a senha?
              </button>
              <p className="text-center text-gray-500 mt-4">
                Ainda não possui uma conta?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/cadastro")}
                  className="text-brand-blue cursor-pointer font-bold hover:underline"
                >
                  Cadastre-se agora
                </button>
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
});

export default LoginPage;
