import { defineFeature, loadFeature } from 'jest-cucumber';
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/prismaClient';
import { securityConfig } from '../../../src/config/baseConfig';
import { UserType } from '../../../generated/prisma';

const feature = loadFeature('../features/cadastro_usuarios_servico.feature');

defineFeature(feature, (test) => {
  let response: request.Response;
  let requestBody: any;

  beforeEach(async () => {
    await prisma.user.deleteMany();
    response = {} as request.Response;
    requestBody = {};
  });

  test('Cadastro válido de estudante', ({ given, when, then, and }) => {
    given('um usuário não cadastrado com CPF "12345678901"', async () => {
      await prisma.user.deleteMany({ where: { cpf: '12345678901' } });
    });

    when('é enviada uma requisição POST para "/api/users" com payload:', async (docString) => {
      requestBody = JSON.parse(docString);
      response = await request(app).post('/api/users').send(requestBody);
    });

    then('o sistema deve retornar status 201', () => {
      expect(response.status).toBe(201);
    });

    and('a resposta deve conter um ID de usuário gerado', async () => {
      expect(response.body.id).toBeDefined();
      expect(typeof response.body.id).toBe("number");
      const user = await prisma.user.findUnique({ where: { cpf: '12345678901' } })
      expect(user?.id !== null).toBeTruthy();
      expect(user?.id === response.body.id).toBeTruthy();
    });

    and('a resposta deve ter o seguinte payload no formato JSON:', (docString) => {
      const expected = JSON.parse(docString);
      expect(response.body).toMatchObject({
        name: expected.name,
        userType: expected.userType,
        course: expected.course,
        enrollment: expected.enrollment,
        cpf: expected.cpf,
      });
    });

    and('<user> deve não ser null', async () => {
      const user = await prisma.user.findUnique({ where: { cpf: requestBody.cpf } });
      expect(user).not.toBeNull();
    });

    and('o banco de dados deve conter o usuário como "STUDENT"', async () => {
      const user = await prisma.user.findUnique({ where: { cpf: requestBody.cpf } });
      expect(user?.userType).toBe(UserType.STUDENT);
      
    });
  });

  test('Cadastro válido de professor', ({ given, when, then, and }) => {
    given('um usuário não cadastrado com CPF "23456789012"', async () => {
      await prisma.user.deleteMany({ where: { cpf: '23456789012' } });
    });

    when('é enviada uma requisição POST para "/api/users" com payload:', async (docString) => {
      requestBody = JSON.parse(docString);
      response = await request(app).post('/api/users').send(requestBody);
    });

    then('o sistema deve retornar status 201', () => {
      expect(response.status).toBe(201);
    });

    and('a resposta deve ter o seguinte payload no formato JSON:', async (docString) => {
      const expected = JSON.parse(docString);
      expect(response.body).toMatchObject({
        name: expected.name,
        userType: expected.userType,
        cpf: expected.cpf,
      });
      expect(response.body.id).toBeDefined();
      expect(typeof response.body.id).toBe('number');
      const user = await prisma.user.findUnique({ where: { cpf: '23456789012' } })
      expect(user?.id !== null).toBeTruthy();
      expect(user?.id === response.body.id).toBeTruthy();
    });

    and('o campo "id" da resposta deve estar presenter', () => {
      expect(response.body.id).toBeDefined();
    });

    and('o campo "id" da resposta não pode ser nulo', () => {
      expect(response.body.id).not.toBeNull();
    });
  });

  test('Tentativa de cadastro com campos obrigatórios faltantes', ({ given, when, then, and }) => {
    given('um CPF não cadastrado "34567890123"', async () => {
      await prisma.user.deleteMany({ where: { cpf: '34567890123' } });
    });

    when('é enviada uma requisição POST para "/api/users" com payload:', async (docString) => {
      requestBody = JSON.parse(docString);
      response = await request(app).post('/api/users').send(requestBody);
    });

    then('o sistema deve retornar status 400', () => {
      expect(response.status).toBe(400);
    });

    and('o campo "status" da resposta deve ser "fail"', () => {
      expect(response.body.status).toBe('fail');
    });

    and('o campo "success" da resposta deve ser false', () => {
      expect(response.body.success).toBe(false);
    });

    and('o campo "message" da resposta deve conter "password é obrigatório"', () => {
      expect(response.body.message).toEqual(expect.stringContaining('password é obrigatório'));
    });

    and('o campo "message" da resposta deve conter "course é obrigatório"', () => {
      expect(response.body.message).toEqual(expect.stringContaining('course é obrigatório'));
    });

    and('o campo "message" da resposta deve conter "enrollment é obrigatório"', () => {
      expect(response.body.message).toEqual(expect.stringContaining('enrollment é obrigatório'));
    });
  });

  test('Tentativa de cadastro com usuário já existente', ({ given, when, then, and }) => {
    given('um usuário já cadastrado com CPF "45678901234"', async () => {
      const hashedPassword = await bcrypt.hash('password123', securityConfig.saltRounds);
      await prisma.user.create({
        data: {
          name: 'Paulo Borba',
          cpf: '45678901234',
          password: hashedPassword,
          userType: UserType.TEACHER,
        },
      });
    });

    when('é enviada uma requisição POST para "/api/users" com payload:', async (docString) => {
      requestBody = JSON.parse(docString);
      response = await request(app).post('/api/users').send(requestBody);
    });

    then('o sistema deve retornar status 409', () => {
      expect(response.status).toBe(409);
    });

    and('a resposta deve ter o seguinte payload no formato JSON:', (docString) => {
      const expected = JSON.parse(docString);
      expect(response.body).toEqual({
        status: expected.status,
        message: expect.stringContaining(`User with cpf ${requestBody.cpf} already exists`),
        success: expected.success,
      });
    });
  });

  test('Tentativa de cadastro com CPF inválido', ({ when, then, and }) => {
    when('é enviada uma requisição POST para "/api/users" com payload:', async (docString) => {
      requestBody = JSON.parse(docString);
      response = await request(app).post('/api/users').send(requestBody);
    });

    then('o sistema deve retornar status 400', () => {
      expect(response.status).toBe(400);
    });

    and('o campo "status" da resposta deve ser "fail"', () => {
      expect(response.body.status).toBe("fail")
    });

    and('o campo "success" da resposta deve ser false', () => {
      expect(response.body.success).toBeFalsy()
    });

    and('o campo "message" da resposta deve conter "cpf: CPF deve conter exatamente 11 dígitos"', () => {
      expect(response.body.message).toEqual(expect.stringContaining('cpf: CPF deve conter exatamente 11 dígitos'));
    });
  });
});
