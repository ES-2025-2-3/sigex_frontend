import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";

import AppRoutes from "./routes/AppRoutes";
import { userSessionStore } from "./store/user/UserSessionStore";
import { mockAdmin } from "../mock/user";
import ScrollToTop from "./commons/components/ScrollToTop";

function App() {
  useEffect(() => {
    userSessionStore.loginMock(mockAdmin);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
