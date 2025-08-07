import { z } from 'zod';

export const authCredentialsSchema = z.object({
  cpf: z
    .string({
      required_error: 'cpf é obrigatório',
      invalid_type_error: 'cpf deve ser uma string',
    })
    .length(11, { message: 'cpf deve conter exatamente 11 dígitos' })
    .regex(/^\d*$/, { message: 'cpf deve conter apenas números' }),
  password: z.string({
      required_error: 'password é obrigatório',
      invalid_type_error: 'password deve ser uma string',
    }).min(6, { message: 'password deve ter pelo menos 6 caracteres' }),
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .regex(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
      'Token inválido: formato JWT esperado',
    ),
});
