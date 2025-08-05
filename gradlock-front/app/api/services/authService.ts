import api from '@/api/api';
import { AuthResponse } from '@/types/auth';

export class AuthService {
    static async login(cpf: string, password: string): Promise<AuthResponse> {
        const response = await api.post('/auth/login', {
            cpf,
            password,
        });

        return response.data;
    }

    static async refreshToken(): Promise<AuthResponse> {
        const response = await api.post('/auth/refresh-token', {
            refreshToken: localStorage.getItem('refreshToken'),
        });

        return response.data;
    }
}
