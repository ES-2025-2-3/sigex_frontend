import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { observer } from "mobx-react-lite"; 

import AppRoutes from "./routes/AppRoutes";
import { userSessionStore } from "./store/auth/UserSessionStore";
import ScrollToTop from "./commons/components/ScrollToTop";
import api from "./services/api";

const App = observer(() => {

  useEffect(() => {
    const token = localStorage.getItem("sigex_token");
    
    if (token) {
      api.get("/auth/me").catch(() => {
        console.log("Sessão inválida detectada no carregamento.");
      });
    }
  }, []);
  
  if (userSessionStore.isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
});

export default App;
