import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', //endereço do back
  timeout: 10000,
});

export default api;