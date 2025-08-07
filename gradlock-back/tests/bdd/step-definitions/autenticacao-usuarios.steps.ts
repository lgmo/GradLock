import { defineFeature, loadFeature } from 'jest-cucumber';
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/prismaClient';
import { securityConfig } from '../../../src/config/baseConfig';
import { UserType } from '../../../generated/prisma';

const feature = loadFeature('../features/autenticacao_usuarios_servicos.feature');

defineFeature(feature, (test) => {
  let response: request.Response;
  let requestBody: string | object | undefined;

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await prisma.user.deleteMany();

    // Reset variables
    response = {} as request.Response;
    requestBody = {};
  });

  test('Login bem-sucedido com CPF e senha válidos', ({ given, when, then, and }) => {
    given(
      'que existe uma usuária cadastrada com o CPF "34567890123" e a senha "041102"',
      async () => {
        const hashedPassword = await bcrypt.hash('041102', securityConfig.saltRounds);
        await prisma.user.create({
          data: {
            name: 'Maria Fernanda',
            cpf: '34567890123',
            password: hashedPassword,
            userType: UserType.STUDENT,
          },
        });
      },
    );

    when(
      'for realizada uma requisição POST para "/api/auth/login" com o CPF "34567890123" e a senha "041102"',
      async () => {
        requestBody = {
          cpf: '34567890123',
          password: '041102',
        };
        response = await request(app).post('/api/auth/login').send(requestBody);
      },
    );

    then('a autenticação deve ser realizada com sucesso', () => {
      expect(response.body.success).toBe(true);
    });

    and('o sistema deve retornar o status 200', () => {
      expect(response.status).toBe(200);
    });

    and('a resposta deve ter o seguinte payload no formato JSON:', (docString) => {
      const expectedResponse = JSON.parse(docString);
      expect(response.body).toMatchObject({
        success: expectedResponse.success,
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresIn: expect.any(Number),
      });
    });
  });

  test('Login mal-sucedido por CPF inexistente', ({ given, when, then, and }) => {
    given('que não existe nenhuma usuária cadastrada com o CPF "45678901234"', async () => {
      await prisma.user.deleteMany();
    });

    when(
      'for realizada uma requisição POST para "/api/auth/login" com o CPF "45678901234" e a senha "051203"',
      async () => {
        requestBody = {
          cpf: '45678901234',
          password: '051203',
        };
        response = await request(app).post('/api/auth/login').send(requestBody);
      },
    );

    then('a autenticação deve ser rejeitada', () => {
      expect(response.body.success).toBe(false);
    });

    and('o sistema deve retornar o status 404', () => {
      expect(response.status).toBe(404);
    });

    and('a resposta deve ter o seguinte payload no formato JSON:', (docString) => {
      const expectedResponse = JSON.parse(docString);
      expect(response.body).toEqual({
        status: expectedResponse.status,
        message: expect.stringContaining('Usuário com cpf 45678901234 não encontrado'),
        success: expectedResponse.success,
      });
    });
  });

  test('Login mal-sucedido por senha incorreta', ({ given, when, then, and }) => {
    given(
      'que existe uma usuária cadastrada com o CPF "56789012345" e a senha "senha_correta"',
      async () => {
        const hashedPassword = await bcrypt.hash('senha_correta', securityConfig.saltRounds);
        await prisma.user.create({
          data: {
            name: 'Eduarda Maria',
            cpf: '56789012345',
            password: hashedPassword,
            userType: UserType.STUDENT,
          },
        });
      },
    );

    when(
      'for realizada uma requisição POST para "/api/auth/login" com o CPF "56789012345" e a senha "060104"',
      async () => {
        requestBody = {
          cpf: '56789012345',
          password: '060104',
        };
        response = await request(app).post('/api/auth/login').send(requestBody);
      },
    );

    then('a autenticação deve ser rejeitada', () => {
      expect(response.body.success).toBe(false);
    });

    and('o sistema deve retornar o status 401', () => {
      expect(response.status).toBe(401);
    });

    and('a resposta deve ter o seguinte payload no formato JSON:', (docString) => {
      const expectedResponse = JSON.parse(docString);
      expect(response.body).toEqual({
        status: expectedResponse.status,
        message: expectedResponse.message,
        success: expectedResponse.success,
      });
    });
  });

  test('Login mal-sucedido por CPF ausente', ({ when, then, and }) => {
    when(
      'for realizada uma requisição POST para "/api/auth/login" com senha "abc123" e sem preencher o "cpf"',
      async () => {
        requestBody = {
          cpf: '',
          password: 'abc123',
        };
        response = await request(app).post('/api/auth/login').send(requestBody);
      },
    );

    then('o sistema deve rejeitar a requisição', () => {
      expect(response.body.success).toBe(false);
    });

    and('o sistema deve retornar o status 400', () => {
      expect(response.status).toBe(400);
    });

    and('a resposta deve ter o seguinte payload no formato JSON:', (docString) => {
      const expectedResponse = JSON.parse(docString);
      expect(response.body).toEqual({
        status: expectedResponse.status,
        message: expectedResponse.message,
        success: expectedResponse.success,
      });
    });
  });

  test('Login mal-sucedido por senha ausente', ({ when, then, and }) => {
    when(
      'for realizada uma requisição POST para "/api/auth/login" com o CPF "56789012345" e sem preencher a "senha"',
      async () => {
        requestBody = {
          cpf: '56789012345',
          password: '',
        };
        response = await request(app).post('/api/auth/login').send(requestBody);
      },
    );

    then('o sistema deve rejeitar a requisição', () => {
      expect(response.body.success).toBe(false);
    });

    and('o sistema deve retornar o status 400', () => {
      expect(response.status).toBe(400);
    });

    and('a resposta deve ter o seguinte payload no formato JSON:', (docString) => {
      const expectedResponse = JSON.parse(docString);
      expect(response.body).toEqual({
        status: expectedResponse.status,
        message: expectedResponse.message,
        success: expectedResponse.success,
      });
    });
  });
});
