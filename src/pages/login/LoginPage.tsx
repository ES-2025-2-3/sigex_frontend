import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Eye, EyeOff } from "lucide-react"; 
import HeaderRegister from "../../commons/header/HeaderRegister";
import Footer from "../../commons/footer/Footer";
import Button from "../../commons/components/Button";
import Toast, { ToastType } from "../../commons/toast/Toast";
import { authStore } from "../../store/auth/AuthStore";

const LoginPage: React.FC = observer(() => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); 
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "Campo obrigatório";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ 
        type: 'error', 
        message: 'Por favor, corrija os erros no formulário antes de continuar.' 
      });
      return;
    }

    try {
      await authStore.login({
        email: formData.email,
        password: formData.password
      });

      setToast({ type: 'success', message: 'Login realizado com sucesso!' });
      
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error: any) {
      setToast({
        type: 'error',
        message: 'Falha na autenticação. Verifique seu e-mail e senha.'
      });
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
            <h1 className="text-3xl font-bold text-brand-dark mb-2">Entrar no Sigex</h1>
            <p className="text-gray-500 text-sm">Preencha os campos para entrar no SIGEX.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate> 

            <div className="flex flex-col">
              <input
                type="email"
                name="email"
                placeholder="E-mail institucional (@ufcg)"
                className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 transition-all ${
                  errors.email ? "border-red-400 focus:ring-red-100" : "border-gray-100 focus:ring-brand-blue/20"
                }`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="text-red-500 text-xs ml-2 mt-1 font-medium">{errors.email}</span>}
            </div>

            <div className="flex flex-col relative"> 
              <input
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Senha"
                className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 transition-all ${
                  errors.password ? "border-red-400 focus:ring-red-100" : "border-gray-100 focus:ring-brand-blue/20"
                }`}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-blue transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <span className="text-red-500 text-xs ml-2 mt-1 font-medium">{errors.password}</span>}
            </div>

            <div className="mt-4">
              <Button 
                variant="primary" 
                size="large" 
                className="w-full rounded-2xl py-5 font-black text-lg uppercase italic tracking-widest shadow-xl shadow-brand-blue/20" 
                type="submit"
                disabled={authStore.loading}
              >
                {authStore.loading ? "AUTENTICANDO..." : "ENTRAR"}
              </Button>
            </div>

            <div className="text-center">
              <button type="button" onClick={() => navigate("/recuperar-senha")} className="mt-4 text-brand-blue cursor-pointer font-bold hover:underline">
                Esqueceu a senha?
              </button>
              <p className="text-center text-gray-500">
                Ainda não possui uma conta?{" "}
                <button type="button" onClick={() => navigate("/cadastro")} className="mt-1 text-brand-blue cursor-pointer font-bold hover:underline">
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