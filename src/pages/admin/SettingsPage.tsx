import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../commons/admin/AdminSidebar';
import Header from '../../commons/header/Header';
import Footer from '../../commons/footer/Footer';
import Button from '../../commons/components/Button';
import Toast from '../../commons/toast/Toast';

const TERMS_KEY = 'system_terms_v1';
const TEMPLATE_KEY = 'system_event_template_v1';

const defaultTerms = `1. Aceitação dos Termos
Ao acessar e utilizar este sistema, o usuário declara que leu, compreendeu e concorda com todos os termos e condições aqui descritos.

2. Objetivo do Sistema
O sistema tem como finalidade disponibilizar funcionalidades relacionadas a [descrever o propósito do sistema], sendo destinado exclusivamente para esse fim.

3. Cadastro do Usuário
O usuário é responsável por fornecer informações verdadeiras, completas e atualizadas no momento do cadastro, bem como por manter a confidencialidade de suas credenciais de acesso.`;

const defaultTemplate = `Olá, temos o prazer de informar que o seu evento foi confirmado com sucesso em nossa plataforma!\n\nAbaixo estão as principais informações do evento cadastrado:\n- Nome do evento: [Nome do Evento]\n- Data: [Data]\n- Horário: [Horário]\n- Local: [Local]`;

const SettingsPage: React.FC = () => {
  const [terms, setTerms] = useState('');
  const [template, setTemplate] = useState('');
  const [toast, setToast] = useState<{ type: any; message: string } | null>(null);

  useEffect(() => {
    const storedTerms = localStorage.getItem(TERMS_KEY);
    const storedTemplate = localStorage.getItem(TEMPLATE_KEY);
    setTerms(storedTerms ?? defaultTerms);
    setTemplate(storedTemplate ?? defaultTemplate);
  }, []);

  const saveTerms = () => {
    localStorage.setItem(TERMS_KEY, terms);
    setToast({ type: 'success', message: 'Termos salvos com sucesso.' });
  };

  const saveTemplate = () => {
    localStorage.setItem(TEMPLATE_KEY, template);
    setToast({ type: 'success', message: 'Template de mensagem salvo.' });
  };

  const renderPreview = () => {
    // Replace placeholder variables with sample values for preview
    return template
      .replace(/\[Nome do Evento\]/gi, 'Conferência SIGEX')
      .replace(/\[Data\]/gi, '10/04/2026')
      .replace(/\[Horário\]/gi, '14:00 - 16:00')
      .replace(/\[Local\]/gi, 'Auditório Principal')
      .split('\n')
      .map((line, idx) => (
        <p className="text-sm text-slate-600" key={idx}>{line}</p>
      ));
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] w-full font-inter">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-10 space-y-8 flex flex-col items-center">
          <div className="w-full max-w-6xl space-y-6">
            <header className="flex justify-between items-end">
              <div>
                <p className="text-[13px] font-black text-brand-blue uppercase tracking-[0.4em] mb-1">Configurações do Sistema</p>
                <h1 className="text-4xl font-black text-[#1e293b] tracking-tighter uppercase leading-none">Configurações</h1>
              </div>
            </header>

            <section className="space-y-4">
              <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">Alterar Termo De condições de uso</h2>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-white/30">
                <div className="flex justify-between items-start mb-4">
                  <strong className="bg-blue-100 text-brand-blue px-3 py-1 rounded-md text-sm">Mensagem Cadastrada</strong>
                  <Button variant="outline" size="small" onClick={saveTerms}>Alterar</Button>
                </div>

                <textarea
                  className="w-full min-h-[220px] p-4 rounded-lg border border-slate-200 resize-vertical text-sm"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">Alterar Mensagem de Aceitação de Evento</h2>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-white/30">
                <div className="flex justify-between items-start mb-4">
                  <strong className="bg-blue-100 text-brand-blue px-3 py-1 rounded-md text-sm">Mensagem Cadastrada</strong>
                  <Button variant="outline" size="small" onClick={saveTemplate}>Alterar</Button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <textarea
                      className="w-full min-h-[180px] p-4 rounded-lg border border-slate-200 resize-vertical text-sm"
                      value={template}
                      onChange={(e) => setTemplate(e.target.value)}
                    />

                    <div className="mt-3 text-xs text-slate-500">
                      Variáveis disponíveis: <strong className="text-slate-700">[Nome do Evento]</strong>, <strong className="text-slate-700">[Data]</strong>, <strong className="text-slate-700">[Horário]</strong>, <strong className="text-slate-700">[Local]</strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-700 mb-2">Pré-visualização</h3>
                    <div className="space-y-1">
                      {renderPreview()}
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </main>
        <Footer />

        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
