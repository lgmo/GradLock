import api from '@/api/api';
import { AuthResponse } from '@/types/auth';
import { CreateUserData } from '@/types/user';

export class UserService {
    static async create(data: CreateUserData): Promise<AuthResponse> {
        const response = await api.post('/users', data);

        return response.data;
    }
}
