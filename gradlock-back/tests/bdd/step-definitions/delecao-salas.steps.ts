import { defineFeature, loadFeature } from 'jest-cucumber';
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/prismaClient';
import { securityConfig } from '../../../src/config/baseConfig';
import { UserType } from '../../../generated/prisma';

const feature = loadFeature('../features/delecao_salas.feature');

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

  test('Deleção de sala com sucesso', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias" com cpf "34567890123" está na página de gerenciamento de salas', async () => {
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

    and('existe uma sala com ID "1" sem reservas no sistema', async () => {
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
      // Não criar reservas para esta sala (sem reservas)
    });

    when('ele solicita a deleção da sala com ID "1"', async () => {
      response = await request(app)
        .delete(`/api/rooms/${roomId}`)
        .set('authorization', `Bearer ${accessToken}`);
    });

    then('a mensagem "Sala deletada com sucesso" é exibida', async () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Sala deletada com sucesso');

      // Verificar se foi deletado do banco
      const roomInDb = await prisma.room.findUnique({
        where: { id: roomId },
      });
      expect(roomInDb).toBeNull();
    });
  });

  test('Erro na deleção por ID inválido', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias" com cpf "34567890123" está na página de gerenciamento de salas', async () => {
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

    when('ele solicita a deleção da sala com ID "abc"', async () => {
      response = await request(app)
        .delete('/api/rooms/abc')
        .set('authorization', `Bearer ${accessToken}`);
    });
 
    then('a mensagem "ID da sala deve ser um número válido" é exibida', () => {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('ID da sala deve ser um número válido');
    });
  });

  test('Erro na deleção por sala inexistente', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias" com cpf "34567890123" está na página de gerenciamento de salas', async () => {
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

    when('ele solicita a deleção da sala com ID "999"', async () => {
      response = await request(app)
        .delete('/api/rooms/999')
        .set('authorization', `Bearer ${accessToken}`);
    });

    then('a mensagem "Sala não encontrada" é exibida', () => {
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Sala não encontrada');
    });
  });

  test('Erro na deleção por reservas ativas', ({ given, when, then, and }) => {
    given('o administrador "Pedro Dias" com cpf "34567890123" está na página de gerenciamento de salas', async () => {
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

    and('existe uma sala com ID "1" com reservas no sistema', async () => {
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

      // Criar um usuário para a reserva
      const user = await prisma.user.create({
        data: {
          cpf: '12345678901',
          name: 'João Silva',
          password: 'senha123',
          userType: 'STUDENT',
        },
      });

      // Criar uma reserva futura
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // 7 dias no futuro

      await prisma.reservation.create({
        data: {
          date: futureDate,
          startTime: '09:00',
          endTime: '11:00',
          reason: 'Aula de laboratório',
          userId: user.id,
          roomId: roomId,
        },
      });
    });

    when('ele solicita a deleção da sala com ID "1"', async () => {
      response = await request(app)
        .delete(`/api/rooms/${roomId}`)
        .set('authorization', `Bearer ${accessToken}`);
    });

    then('a mensagem "Não é possível deletar a sala. Existem reservas ativas ou futuras para esta sala" é exibida', () => {
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Não é possível deletar a sala. Existem reservas ativas ou futuras para esta sala',
      );
    });
  });
});
