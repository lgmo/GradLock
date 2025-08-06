import { defineFeature, loadFeature } from 'jest-cucumber';
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/prismaClient';
import { securityConfig } from '../../../src/config/baseConfig';
import { UserType } from '../../../generated/prisma';

const feature = loadFeature('../features/listagem_reserva.feature');

defineFeature(feature, (test) => {
  let response: any;
  let roomId: number;
  let accessToekn: any;

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await prisma.reservation.deleteMany();
    await prisma.room.deleteMany();
    await prisma.user.deleteMany();

    const password = '041102';
    const hashedPassword1 = await bcrypt.hash(password, securityConfig.saltRounds);
    const password2 = '040002';
    const hashedPassword2 = await bcrypt.hash(password2, securityConfig.saltRounds);
    const password3 = '041552';
    const hashedPassword3 = await bcrypt.hash(password3, securityConfig.saltRounds);

    await prisma.user.createMany({
      data: [
        {
          name: 'Pedro dias',
          cpf: '34567890123',
          password: hashedPassword1,
          userType: UserType.STUDENT,
        },
        {
          name: 'Admin',
          cpf: '12345678901',
          password: hashedPassword2,
          userType: UserType.ADMIN,
        },
        {
          name: 'Professor',
          cpf: '10987654321',
          password: hashedPassword3,
          userType: UserType.TEACHER,
        },
      ],
    });
    
    // Reset variables
    response = null;
    roomId = 0;
  });

  test('Listar as reservas do usuario com sucesso', ({ given, when, then, and }) => {
    given('Given existem as seguintes reservas cadastradas no sistema:', async () => {
      // Salas de teste
      await prisma.reservation.createMany({
        data: [
          {
            roomId: 1,
            userId: 1,
            date: '2025-07-16',
            startTime: '10:00',
            endTime: '11:00',
            //status: 'PENDENTE',
            reason: 'Monitoria',
          },
          {
            roomId: 1,
            userId: 2,
            date: '2025-07-19',
            startTime: '14:00',
            endTime: '15:00',
            //status: 'PENDENTE',
            reason: 'Monitoria',
          },
          {
            roomId: 2,
            userId: 1,
            date: '2025-07-20',
            startTime: '09:00',
            endTime: '10:00',
            //status: 'CONFIRMADA',
            reason: 'Monitoria',
          },

        ],
      });
    });

    when('o usuário solicita a lista de todas as suas reservas', async () => {
      const password = '041102';
      const cpf = '34567890123';
      response = await request(app).post('/api/auth/login').send({ cpf: cpf, password: password });
      const accessToken = response.body.accessToken;
      response = await request(app).get(`/api/reservation/search`).set('authorization', `Bearer ${accessToken}`);
    });

    then('o sistema deve exibir uma lista com as seguintes reservas:', () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);

      // Verificar ordenação por data
      expect(response.body.data[0].date).toBeLessThanOrEqual(response.body.data[1].date);

      expect(response.body.data[0].date).toBe('2025-07-18');
      expect(response.body.data[1].date).toBe('2025-07-20');
    });

    and('a mensagem "Reservas recuperadas com sucesso" é exibida', () => {
      expect(response.body.message).toBe('Reservas recuperadas com sucesso');
    });
  });

  test('Visualizar as reservas do dia 18', ({ given, when, then, and }) => {
    given('existem as seguintes reservas cadastradas no sistema:', async () => {
      // Salas de teste
      await prisma.reservation.createMany({
        data: [
          {
            roomId: 1,
            userId: 1,
            date: '2025-07-18',
            startTime: '10:00',
            endTime: '11:00',
            //status: 'PENDENTE',
            reason: 'Monitoria',
          },
          {
            roomId: 1,
            userId: 2,
            date: '2025-07-23',
            startTime: '17:00',
            endTime: '18:00',
            //status: 'PENDENTE',
            reason: 'Monitoria',
          },
          {
            roomId: 2,
            userId: 1,
            date: '2025-07-20',
            startTime: '19:00',
            endTime: '20:00',
            //status: 'CONFIRMADA',
            reason: 'Monitoria',
          },

        ],
      });
    });

    when('o admin solicita a lista de reservas para "2025-07-18"', async () => {
      const password = '040002';
      const cpf = '12345678901';
      response = await request(app).post('/api/auth/login').send({ cpf: cpf, password: password });
      const accessToken = response.body.accessToken;
      response = await request(app).get(`/api/reservation/search`).set('authorization', `Bearer ${accessToken}`).query({ date: '2025-07-18' });
    });

    then('o sistema retorna todas as reservas ordenadas por data', () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);

      // Verificar ordenação por data
      expect(response.body.data[0].date).toBe('2025-07-18');
    });

    // and('a mensagem "Reservas recuperadas com sucesso" é exibida', () => {
    //   expect(response.body.message).toBe('Reservas recuperadas com sucesso');
    // });
  });
});
