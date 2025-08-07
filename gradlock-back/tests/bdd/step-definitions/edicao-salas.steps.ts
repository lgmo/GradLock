import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../../src/app';
import prisma from '../../../src/config/prismaClient';
import { securityConfig } from '../../../src/config/baseConfig';
import { UserType } from '../../../generated/prisma';

const feature = loadFeature('../features/edicao_salas.feature');

defineFeature(feature, (test) => {
  let response: any;
  let requestBody: any;
  let roomId: number;
  let accessToken: any;

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await prisma.reservation.deleteMany();
    await prisma.room.deleteMany();
    await prisma.user.deleteMany();

    // Reset variables
    response = null;
    requestBody = {};
    roomId = 0;
  });

  test('Edição de sala com sucesso', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias" com cpf "34567890123"', async () => {
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

    and('ele está na página de edição de salas da sala "GRAD 04"', async () => {
      const room = await prisma.room.create({
        data: {
          name: 'GRAD 04',
          description: 'Laboratório antigo',
          capacity: 30,
          hasComputers: true,
          hasProjector: false,
        },
      });
      roomId = room.id;
    });

    when('ele edita o campo "Descrição" para "Laboratório renovado"', () => {
      requestBody.description = 'Laboratório renovado';
    });

    and('seleciona "Editar"', async () => {
      response = await request(app)
        .put(`/api/rooms/${roomId}`)
        .send(requestBody)
        .set('authorization', `Bearer ${accessToken}`);
    });

    then('a mensagem "Sala atualizada com sucesso" é exibida.', async () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Sala atualizada com sucesso');

      // Verificar se foi atualizado no banco
      const roomInDb = await prisma.room.findUnique({
        where: { id: roomId },
      });
      expect(roomInDb!.description).toBe('Laboratório renovado');
      expect(roomInDb!.name).toBe('GRAD 04'); // Não deve ter mudado
    });
  });

  test('Edição de sala mal sucedida por falta de dados', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias" com cpf "34567890123"', async () => {
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

    and('ele está na página de edição de salas da sala "GRAD 04"', async () => {
      const room = await prisma.room.create({
        data: {
          name: 'GRAD 04',
          description: 'Laboratório antigo',
          capacity: 30,
          hasComputers: true,
          hasProjector: false,
        },
      });
      roomId = room.id;
    });

    when('ele seleciona "Editar"', async () => {
      response = await request(app)
        .put(`/api/rooms/${roomId}`)
        .send(requestBody)
        .set('authorization', `Bearer ${accessToken}`);
    });

    then('a mensagem "Nenhum dado fornecido para atualização" é exibida.', () => {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Nenhum dado fornecido para atualização');
    });
  });

  test('Erro na edição de sala por nome indisponível', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias" com cpf "34567890123"', async () => {
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

    and('ele está na página de edição de salas da sala "GRAD 04"', async () => {
      // Criar sala GRAD 04
      const room = await prisma.room.create({
        data: {
          name: 'GRAD 04',
          description: 'Laboratório 4',
          capacity: 30,
          hasComputers: true,
          hasProjector: false,
        },
      });
      roomId = room.id;
    });

    and('existe uma sala com o nome "GRAD 05" cadastrada', async () => {
      // Criar sala GRAD 05 (que já existe)
      await prisma.room.create({
        data: {
          name: 'GRAD 05',
          description: 'Laboratório 5',
          capacity: 25,
          hasComputers: false,
          hasProjector: true,
        },
      });
    });
 
    when('ele edita o campo "Nome da sala" para "GRAD 05"', () => {
      requestBody.name = 'GRAD 05';
    });

    and('seleciona "Editar"', async () => {
      response = await request(app)
        .put(`/api/rooms/${roomId}`)
        .send(requestBody)
        .set('authorization', `Bearer ${accessToken}`);
    });

    then('a mensagem "Falha na edição. Esse nome está indisponível" é exibida.', () => {
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Falha na edição. Esse nome está indisponível');
    });
  });

  test('Erro na edição de sala por capacidade negativa', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias" com cpf "34567890123"', async () => {
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

    and('ele está na página de edição de salas da sala "GRAD 04"', async () => {
      const room = await prisma.room.create({
        data: {
          name: 'GRAD 04',
          description: 'Laboratório 4',
          capacity: 30,
          hasComputers: true,
          hasProjector: false,
        },
      });
      roomId = room.id;
    });

    when('ele edita o campo "Capacidade" para "-15"', () => {
      requestBody.capacity = -15;
    });

    and('seleciona "Editar"', async () => {
      response = await request(app)
        .put(`/api/rooms/${roomId}`)
        .send(requestBody)
        .set('authorization', `Bearer ${accessToken}`);
    });

    then('a mensagem "Falha na edição. A capacidade deve ser um número positivo!" é exibida.', () => {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Falha na edição. A capacidade deve ser um número positivo!');
    });
  });
});
