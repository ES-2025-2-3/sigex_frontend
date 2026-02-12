import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderRegister from "../../commons/header/HeaderRegister";
import Footer from "../../commons/footer/Footer";
import Button from "../../commons/components/Button";
import Toast, { ToastType } from "../../commons/toast/Toast";
import { UserType } from "../../domain/enums/UserType";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<{
    name: string;
    registrationNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    profile: UserType;
  }>({
    name: "",
    registrationNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile: UserType.DOCENTE
  });

  const userProfiles = [
    { label: "Docente", value: UserType.DOCENTE },
    { label: "Servidor Técnico-Administrativo", value: UserType.SERVIDOR_TECNICO_ADMINISTRATIVO },
  ];

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "Campo obrigatório";
      }
    });

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ 
        type: 'error', 
        message: 'Por favor, corrija os erros no formulário antes de continuar.' 
      });
      return;
    }

    setToast({ type: 'success', message: 'Cadastro realizado com sucesso!' });
    console.log("Dados enviados:", formData);
    
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
        <div className="bg-white w-full max-w-[550px] rounded-[40px] shadow-2xl shadow-brand-dark/5 p-10 md:p-14 border border-white">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-brand-dark mb-2">Criar Conta</h1>
            <p className="text-gray-500 text-sm">Preencha os campos para se cadastrar no SIGEX.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            
            <div className="flex flex-col">
              <input
                type="text"
                name="name"
                placeholder="Nome Completo"
                className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 transition-all ${
                  errors.name ? "border-red-400 focus:ring-red-100" : "border-gray-100 focus:ring-brand-blue/20"
                }`}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="text-red-500 text-xs ml-2 mt-1 font-medium">{errors.name}</span>}
            </div>

            <div className="flex flex-col">
              <input
                type="text"
                name="registrationNumber"
                placeholder="Matrícula"
                className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 transition-all ${
                  errors.registrationNumber
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-100 focus:ring-brand-blue/20"
                }`}
                value={formData.registrationNumber}
                onChange={handleChange}
              />
              {errors.registrationNumber && (
                <span className="text-red-500 text-xs ml-2 mt-1 font-medium">
                  {errors.registrationNumber}
                </span>
              )}
            </div>

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

            <div className="flex flex-col">
              <input
                type="password"
                name="password"
                placeholder="Senha"
                className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 transition-all ${
                  errors.password ? "border-red-400 focus:ring-red-100" : "border-gray-100 focus:ring-brand-blue/20"
                }`}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="text-red-500 text-xs ml-2 mt-1 font-medium">{errors.password}</span>}
            </div>

            <div className="flex flex-col">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirme sua Senha"
                className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword ? "border-red-400 focus:ring-red-100" : "border-gray-100 focus:ring-brand-blue/20"
                }`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="text-red-500 text-xs ml-2 mt-1 font-medium">{errors.confirmPassword}</span>}
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mt-2">
              <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Eu sou:</p>
              <div className="flex items-center justify-between gap-2">
                {userProfiles.map((tipo) => (
                  <label key={tipo.value} className="flex-1">
                    <input 
                      type="radio" 
                      name="profile" 
                      checked={formData.profile === tipo.value}
                      className="hidden" 
                      onChange={() => setFormData(prev => ({ ...prev, profile: tipo.value }))} 
                    />
                    <div
                      className={`flex items-center justify-center text-center h-14 px-3 rounded-xl cursor-pointer text-sm font-bold transition-all ${
                        formData.profile === tipo.value
                          ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                          : "text-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      {tipo.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Button variant="primary" size="large" className="w-full rounded-2xl py-4 font-bold text-lg" type="submit">
                CRIAR MINHA CONTA
              </Button>
            </div>
            
            <p className="text-center text-gray-500 mt-6">
              Já faz parte do SIGEX?{" "}
              <button type="button" onClick={() => navigate("/login")} className="cursor-pointer text-brand-blue font-bold hover:underline">
                Entrar agora
              </button>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;