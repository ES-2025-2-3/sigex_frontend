import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sigex_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const BYPASS_401_AUTO_LOGOUT = ["/users/me/change-password"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = String(error?.config?.url || "");

    const shouldBypass =
      status === 401 && BYPASS_401_AUTO_LOGOUT.some((p) => url.includes(p));

    if (!shouldBypass && (status === 401 || status === 403)) {
      localStorage.removeItem("sigex_token");
      localStorage.removeItem("sigex_user_data");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;