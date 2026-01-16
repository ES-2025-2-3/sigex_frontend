import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderRegister from "../../commons/header/HeaderRegister";
import Footer from "../../commons/footer/Footer";
import Button from "../../commons/button/Button";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    contato: "",
    senha: "",
    confirmarSenha: "",
    perfil: "Aluno"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados de cadastro:", formData);
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <HeaderRegister />

      <main className="flex-1 flex items-center justify-center py-12 px-5">
        <div className="bg-white w-full max-w-[550px] rounded-[40px] shadow-xl p-10 md:p-14 border border-blue-100">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-[#212A3E] mb-2 font-montserrat">
              Criar Conta
            </h1>
            <p className="text-gray-500 text-sm">
              Preencha os campos abaixo para se cadastrar no SIGEX.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <input
              type="text"
              name="nome"
              placeholder="Nome Completo"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-brand-blue/20 focus:bg-white transition-all placeholder:text-gray-400"
              value={formData.nome}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="E-mail institucional (@ufcg)"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-brand-blue/20 focus:bg-white transition-all placeholder:text-gray-400"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="cpf"
                placeholder="CPF"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-brand-blue/20 focus:bg-white transition-all"
                value={formData.cpf}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="contato"
                placeholder="WhatsApp/Telefone"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-brand-blue/20 focus:bg-white transition-all"
                value={formData.contato}
                onChange={handleChange}
                required
              />
            </div>

            <input
              type="password"
              name="senha"
              placeholder="Senha"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-brand-blue/20 focus:bg-white transition-all"
              value={formData.senha}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="confirmarSenha"
              placeholder="Confirme sua Senha"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-brand-blue/20 focus:bg-white transition-all"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
            />

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mt-2">
              <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Eu sou:</p>
              <div className="flex items-center justify-between gap-2">
                {["Professor", "Servidor", "Aluno"].map((tipo) => (
                  <label key={tipo} className="flex-1">
                    <input
                      type="radio"
                      name="perfil"
                      value={tipo}
                      checked={formData.perfil === tipo}
                      onChange={() => setFormData(prev => ({ ...prev, perfil: tipo }))}
                      className="hidden"
                    />
                    <div className={`text-center py-2 px-1 rounded-xl cursor-pointer text-sm font-bold transition-all ${
                      formData.perfil === tipo 
                      ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20" 
                      : "text-gray-500 hover:bg-gray-200"
                    }`}>
                      {tipo}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Button 
                variant="primary" 
                size="large" 
                className="w-full rounded-2xl py-4 font-extrabold text-lg transition-transform active:scale-95 shadow-lg shadow-brand-blue/25"
                type="submit"
              >
                CRIAR MINHA CONTA
              </Button>
            </div>

            <p className="text-center text-gray-500 mt-6">
              Já faz parte do SIGEX?{" "}
              <button 
                type="button"
                onClick={() => navigate("/login")}
                className="text-brand-blue font-bold hover:underline"
              >
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