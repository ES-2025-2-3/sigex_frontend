import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";

import AppRoutes from "./routes/AppRoutes";
import { userSessionStore } from "./store/user/UserSessionStore";
import { mockUser } from "../mock/user";

function App() {
  useEffect(() => {
    userSessionStore.loginMock(mockUser);
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;