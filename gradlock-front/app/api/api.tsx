import axios from 'axios';

// Configuração da instância do axios
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token de autenticação quando implementado
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para tratamento de erros globais
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message || 'Erro na comunicação com o servidor');
    }
);

export default api;
