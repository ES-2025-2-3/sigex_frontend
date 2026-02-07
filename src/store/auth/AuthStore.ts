import { makeAutoObservable, runInAction } from "mobx";
import { api } from "../../services/api";

class AuthStore {
  userEmail: string | null = null;
  isAuthenticated: boolean = false;
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async login(credentials: { email: string; password: string }) {
    this.loading = true;
    
    console.log("%c[AUTH-TEST] 1. Enviando dados de login para o servidor...", "color: blue; font-weight: bold;");
    console.log("Dados:", credentials);

    try {
      const response = await api.post("/auth/login", credentials);
      
      console.log("%c[AUTH-TEST] 2. Resposta do servidor recebida!", "color: green; font-weight: bold;");
      console.log("Corpo da resposta (JSON):", response.data);
      console.log("Nota: O token não deve aparecer aqui se o HttpOnly estiver ativo.");

      runInAction(() => {
        this.userEmail = response.data.email;
        this.isAuthenticated = true;
      });

      console.log("%c[AUTH-TEST] 3. Estado do MobX atualizado com sucesso.", "color: purple; font-weight: bold;");

    } catch (error: any) {
      console.error("%c[AUTH-TEST] ERRO DETECTADO:", "color: red; font-weight: bold;");
      console.error("Status do erro:", error.response?.status);
      console.error("Mensagem do erro:", error.response?.data || error.message);
      throw error;
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  async checkMySession() {
     console.log("[AUTH-TEST] Testando se o navegador está enviando o cookie automaticamente...");
     try {
       const res = await api.get("/auth/me"); 
       console.log("Sessão ativa para:", res.data.email);
     } catch (err) {
       console.log("Nenhum cookie válido enviado pelo navegador.");
     }
  }
}

export const authStore = new AuthStore();