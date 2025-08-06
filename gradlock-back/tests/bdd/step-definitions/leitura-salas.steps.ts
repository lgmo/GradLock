import { defineFeature, loadFeature } from 'jest-cucumber';
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/prismaClient';
import { securityConfig } from '../../../src/config/baseConfig';
import { UserType } from '../../../generated/prisma';

const feature = loadFeature('../features/leitura_salas.feature');

defineFeature(feature, (test) => {
  let response: any;
  let roomId: number;
  let accessToken: any;

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await prisma.reservation.deleteMany();
    await prisma.room.deleteMany();
    await prisma.user.deleteMany();

    // Reset variables
    response = null;
    roomId = 0;
  });

  test('Listar todas as salas com sucesso', ({ given, when, then, and }) => {
    given('existem as salas "GRAD 1", "GRAD 2" e "GRAD 3" cadastradas no sistema', async () => {
      // Salas de teste
      await prisma.room.createMany({
        data: [
          {
            name: 'GRAD 1',
            description: 'Laboratório 1',
            capacity: 30,
            hasComputers: true,
            hasProjector: false,
          },
          {
            name: 'GRAD 2',
            description: 'Laboratório 2',
            capacity: 25,
            hasComputers: false,
            hasProjector: true,
          },
          {
            name: 'GRAD 3',
            description: 'Laboratório 3',
            capacity: 40,
            hasComputers: true,
            hasProjector: true,
          },
        ],
      });
    });

    when('o usuário logado com cpf "12345678901" solicita a lista de todas as salas', async () => {
      const password = '041102';
      const hashedPassword = await bcrypt.hash(password, securityConfig.saltRounds);
      const cpf = '12345678901';
      await prisma.user.create({
        data: {
          name: 'João Silva',
          cpf: cpf, // Sem formatação para armazenamento
          password: hashedPassword,
          userType: UserType.STUDENT,
        },
      });
      response = await request(app).post('/api/auth/login').send({ cpf: cpf, password: password });
      const accessToken = response.body.accessToken;
      response = await request(app).get('/api/rooms').set('authorization', `Bearer ${accessToken}`);
    });

    then('o sistema retorna todas as salas "GRAD 1", "GRAD 2" e "GRAD 3"', () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);

      // Verificar se as salas específicas estão presentes
      const roomNames = response.body.data.map((room: any) => room.name);
      expect(roomNames).toContain('GRAD 1');
      expect(roomNames).toContain('GRAD 2');
      expect(roomNames).toContain('GRAD 3');
    });

    and('a mensagem "Salas recuperadas com sucesso" é exibida', () => {
      expect(response.body.message).toBe('Salas recuperadas com sucesso');
    });
  });

  test('Listar salas quando não há salas cadastradas', ({ given, when, then, and }) => {
    given('existe nenhuma sala cadastrada no sistema', () => {
      // Não criar nenhuma sala
    });

    when('o usuário logado com cpf "12345678901" solicita a lista de todas as salas', async () => {
      const password = '041102';
      const hashedPassword = await bcrypt.hash(password, securityConfig.saltRounds);
      const cpf = '12345678901';
      await prisma.user.create({
        data: {
          name: 'João Silva',
          cpf: cpf, // Sem formatação para armazenamento
          password: hashedPassword,
          userType: UserType.TEACHER,
        },
      });
      response = await request(app).post('/api/auth/login').send({ cpf: cpf, password: password });
      const accessToken = response.body.accessToken;
      response = await request(app).get('/api/rooms').set('authorization', `Bearer ${accessToken}`);
    });

    then('o sistema retorna uma lista vazia', () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    and('a mensagem "Salas recuperadas com sucesso" é exibida', () => {
      expect(response.body.message).toBe('Salas recuperadas com sucesso');
    });
  });

  test('Listar uma sala específica com sucesso', ({ given, when, then, and }) => {
    given('existe a sala "GRAD 1" cadastrada no sistema', async () => {
      const room = await prisma.room.create({
        data: {
          name: 'GRAD 1',
          description: 'Laboratório 1',
          capacity: 30,
          hasComputers: true,
          hasProjector: false,
        },
      });
      roomId = room.id;
    });

    when('o usuário logado com cpf "12345678901" solicita a lista da sala "GRAD 1"', async () => {
      const password = '041102';
      const hashedPassword = await bcrypt.hash(password, securityConfig.saltRounds);
      const cpf = '12345678901';
      await prisma.user.create({
        data: {
          name: 'João Silva',
          cpf: cpf,
          password: hashedPassword,
          userType: UserType.STUDENT,
        },
      });
      response = await request(app).post('/api/auth/login').send({ cpf: cpf, password: password });
      const accessToken = response.body.accessToken;
      response = await request(app).get(`/api/rooms/${roomId}`).set('authorization', `Bearer ${accessToken}`);
    });

    then('o sistema retorna a sala "GRAD 1"', () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('GRAD 1');
      expect(response.body.data.id).toBe(roomId);
    });

    and('a mensagem "Sala encontrada com sucesso" é exibida', () => {
      expect(response.body.message).toBe('Sala encontrada com sucesso');
    });
  });

  test('Listar uma sala específica que não existe', ({ given, when, then }) => {
    given('não existe a sala "GRAD 404" cadastrada no sistema', () => {
      // Não criar nenhuma sala com esse nome
    });

    when('o usuário logado com cpf "12345678901" solicita a lista da sala "GRAD 404"', async () => {
      const password = '041102';
      const hashedPassword = await bcrypt.hash(password, securityConfig.saltRounds);
      const cpf = '12345678901';
      await prisma.user.create({
        data: {
          name: 'João Silva',
          cpf: cpf,
          password: hashedPassword,
          userType: UserType.STUDENT,
        },
      });
      response = await request(app).post('/api/auth/login').send({ cpf: cpf, password: password });
      const accessToken = response.body.accessToken;
      response = await request(app).get('/api/rooms/999').set('authorization', `Bearer ${accessToken}`); // ID que não existe
    });

    then('o sistema retorna uma mensagem "Sala não encontrada"', () => {
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Sala não encontrada');
    });
  });
});
