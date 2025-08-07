import { UserType } from '../../generated/prisma';
import { z } from 'zod';

const createStudentSchema = z.object({
  userType: z.literal(UserType.STUDENT),
  cpf: z
    .string({
      required_error: 'cpf é obrigatório',
      invalid_type_error: 'cpf deve ser uma string',
    })
    .length(11, { message: 'CPF deve conter exatamente 11 dígitos' })
    .regex(/^\d+$/, { message: 'CPF deve conter apenas números' }),
  name: z
    .string({
      required_error: 'name é obrigatório',
      invalid_type_error: 'name deve ser uma string',
    })
    .min(1, { message: 'name é obrigatório' }),
  password: z.string({
      required_error: 'password é obrigatório',
      invalid_type_error: 'password deve ser uma string',
    }).min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  enrollment: z
    .string({
      required_error: 'enrollment é obrigatório para usuário com userType "STUDENT"',
      invalid_type_error: 'enrollment deve ser uma string',
    })
    .min(1, { message: 'enrollment é obrigatório para usuário com userType "STUDENT"' })
    .max(100, { message: 'enrollment deve ter no máximo 100 caracteres' }),
  course: z
    .string({
      required_error: 'course é obrigatório para usuário com userType "STUDENT"',
      invalid_type_error: 'course deve ser uma string',
    })
    .min(1, { message: 'course é obrigatório para usuário com userType "STUDENT"' })
    .max(100, { message: 'course deve ter no máximo 100 caracteres' }),
});

const createTeacherSchema = z.object({
  userType: z.literal(UserType.TEACHER),
  cpf: z
    .string({
      required_error: 'cpf é obrigatório',
      invalid_type_error: 'cpf deve ser uma string',
    })
    .length(11, { message: 'cpf deve conter exatamente 11 dígitos' })
    .regex(/^\d+$/, { message: 'cpf deve conter apenas números' }),
  name: z
    .string({
      required_error: 'name é obrigatório',
      invalid_type_error: 'name deve ser uma string',
    })
    .min(1, { message: 'name é obrigatório' }),
  password: z
    .string({
      required_error: 'password é obrigatório',
      invalid_type_error: 'password deve ser uma string',
    })
    .min(6, { message: 'password deve ter pelo menos 6 caracteres' }),
});

export const createUserSchema = z.discriminatedUnion('userType', [
  createStudentSchema,
  createTeacherSchema,
]);
