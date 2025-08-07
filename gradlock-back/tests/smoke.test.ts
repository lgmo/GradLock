import app from '../src/app';
import bcrypt from 'bcrypt';
import request from 'supertest';
import prisma from '../src/config/prismaClient';
import { securityConfig } from '../src/config/baseConfig';
import { UserType } from '../generated/prisma';

describe('Smoke Test - API Health Check', () => {
  it('deve iniciar a aplicação com sucesso', async () => {
    const password = '041102';
    const hashedPassword = await bcrypt.hash(password, securityConfig.saltRounds);
    const cpf = '34567890123';
    await prisma.user.create({
      data: {
        name: 'Pedro dias',
        cpf: cpf, // Sem formatação para armazenamento
        password: hashedPassword,
        userType: UserType.ADMIN,
      },
    });
    let response = await request(app)
      .post('/api/auth/login')
      .send({ cpf: cpf, password: password });
    const accessToken = response.body.accessToken;
    response = await request(app).get('/api/rooms').set('authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success');
  });

  it('deve retornar 404 para rotas inexistentes', async () => {
    const response = await request(app).get('/api/nonexistent');

    expect(response.status).toBe(404);
  });
});
