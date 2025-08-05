import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/prismaClient';
import { UserType } from '../../../generated/prisma';
import { securityConfig } from '../../../src/config/baseConfig';
import bcrypt from 'bcrypt';

const feature = loadFeature('../features/cadastro_salas.feature');

defineFeature(feature, (test) => {
  let response: any;
  let requestBody: any;
  let accessToken: any;

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await prisma.reservation.deleteMany();
    await prisma.room.deleteMany();
    await prisma.user.deleteMany();

    // Reset variables
    response = null;
    requestBody = {};
    accessToken = null;
  });

  test('Cadastro de sala bem sucedido', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias" com cpf "34567890123" está na página de cadastro de salas', async () => {
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
      response = await request(app).post('/api/auth/login').send({ cpf: cpf, password: password });
      accessToken = response.body.accessToken;
    });

    when('ele preenche o campo "Nome da Sala" com "GRAD 6", "Descrição" com "Laboratório de tamanho médio", "Capacidade" com "40", seleciona o campo "Tem computadores?", seleciona o campo "Tem projetores?"', () => {
      requestBody.name = 'GRAD 6';
      requestBody.description = 'Laboratório de tamanho médio';
      requestBody.capacity = 40;
      requestBody.hasComputers = true;
      requestBody.hasProjector = true;
    });

    and('seleciona "Cadastrar"', async () => {
      response = await request(app)
        .post('/api/rooms')
        .send(requestBody)
        .set('Authorization', `Bearer ${accessToken}`);
    });

    then('uma mensagem de sucesso "Cadastro realizado com sucesso!" é exibida', async () => {
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Cadastro realizado com sucesso!');

      // Verificar se foi salvo no banco
      const roomInDb = await prisma.room.findUnique({
        where: { name: 'GRAD 6' },
      });
      expect(roomInDb).not.toBeNull();
      expect(roomInDb!.description).toBe('Laboratório de tamanho médio');
      expect(roomInDb!.capacity).toBe(40);
      expect(roomInDb!.hasComputers).toBe(true);
      expect(roomInDb!.hasProjector).toBe(true);
    });
  });

  test('Cadastro de sala mal sucedido por falta de informações', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias" com cpf "34567890123" está na página de cadastro de salas', async () => {
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
      response = await request(app).post('/api/auth/login').send({ cpf: cpf, password: password });
      accessToken = response.body.accessToken;
    });

    when('deixa de preencher o campo "descrição" do formulario', () => {
      // Deixar campos vazios intencionalmente
      requestBody = {
        name: 'GRAD 7',
        description: '', // Campo vazio
        capacity: 30,
      };
    });

    and('seleciona "Cadastrar"', async () => {
      response = await request(app)
        .post('/api/rooms')
        .send(requestBody)
        .set('authorization', `Bearer ${accessToken}`);
    });

    then('uma mensagem de erro "Cadastro não realizado. Todos os campos devem ser preenchidos!" é exibida.', () => {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Cadastro não realizado. Todos os campos devem ser preenchidos!',
      );
    });
  });

  test('Cadastro de sala mal sucedido por capacidade negativa', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias" com cpf "34567890123" está na página de cadastro de salas', async () => {
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
      response = await request(app).post('/api/auth/login').send({ cpf: cpf, password: password });
      accessToken = response.body.accessToken;
    });

    when('ele preenche o campo "Nome da Sala" com "GRAD 7", "Descrição" com "Laboratório de tamanho médio", "Capacidade" com "-40", seleciona o campo "Tem computadores?", seleciona o campo "Tem projetores?"', () => {
      requestBody.name = 'GRAD 7';
      requestBody.description = 'Laboratório de tamanho médio';
      requestBody.capacity = -40;
      requestBody.hasComputers = true;
      requestBody.hasProjector = true;
    });

    and('seleciona "Cadastrar"', async () => {
      response = await request(app)
        .post('/api/rooms')
        .send(requestBody)
        .set('authorization', `Bearer ${accessToken}`);
    });

    then('uma mensagem de erro "Capacidade deve ser um número positivo" é exibida.', () => {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Capacidade deve ser um número positivo');
    });
  });

  test('Cadastro de sala mal sucedido por ela já estar cadastrada', ({
    given,
    when,
    then,
    and,
  }) => {
    given('o administrador "Pedro Dias" com cpf "34567890123" está na página de cadastro de salas', async () => {
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
      response = await request(app).post('/api/auth/login').send({ cpf: cpf, password: password });
      accessToken = response.body.accessToken;

      // Criar uma sala existente
      await prisma.room.create({
        data: {
          name: 'E112',
          description: 'Sala existente',
          capacity: 20,
          hasComputers: false,
          hasProjector: false,
        },
      });
    });

    when('ele preenche o campo "Nome da Sala" com "E112"', () => {
      requestBody.name = 'E112';
    });

    and('ele preenche os outros campos do formulário', () => {
      requestBody.description = 'Nova descrição';
      requestBody.capacity = 25;
      requestBody.hasComputers = true;
      requestBody.hasProjector = true;
    });

    and('seleciona "Cadastrar"', async () => {
      response = await request(app)
        .post('/api/rooms')
        .send(requestBody)
        .set('authorization', `Bearer ${accessToken}`);
    });

    then('uma mensagem de erro "Cadastro não realizado. Sala já existente!" é exibida', () => {
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cadastro não realizado. Sala já existente!');
    });
  });
});
