import { Request, Response } from 'express';
import prisma from '../config/prismaClient';
import { AuthenticatedRequest } from '../types/auth';
import { ReservationStatus } from 'generated/prisma';

export class ReservationsController {
  static async getAllReservations(_req: Request, res: Response): Promise<void> {
    try {
      const reservations = await prisma.reservation.findMany({
        orderBy: {
          date: 'asc',
        },
        select: {
          id: true,
          userId: true,
          roomId: true,
          date: true,
          startTime: true,
          endTime: true,
          status: true,
          reason: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Reservas recuperadas com sucesso',
        data: reservations,
        count: reservations.length,
      });
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao buscar reservas',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }

  // static async getReservationById(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { id } = req.params;
  //     const reservationId = parseInt(id);

  //     // Validação do ID
  //     if (isNaN(reservationId)) {
  //       res.status(400).json({
  //         success: false,
  //         message: 'ID da reserva deve ser um número válido',
  //       });
  //       return;
  //     }

  //     // Busca a reserva com seus detalhes
  //     const reservation = await prisma.reservation.findUnique({
  //       where: { id: reservationId },
  //       include: {
  //         user: {
  //           select: {
  //             id: true,
  //             userId: true,
  //             roomId: true,
  //           },
  //         },
  //       },
  //     });

  //     // Verifica se a reserva existe
  //     if (!reservation) {
  //       res.status(404).json({
  //         success: false,
  //         message: 'Reserva não encontrada',
  //       });
  //       return;
  //     }

  //     res.status(200).json({
  //       success: true,
  //       message: 'Reserva encontrada com sucesso',
  //       data: reservation,
  //     });
  //   } catch (error) {
  //     console.error('Erro ao buscar reserva por ID:', error);
  //     res.status(500).json({
  //       success: false,
  //       message: 'Erro interno do servidor ao buscar reserva',
  //       error: process.env.NODE_ENV === 'development' ? error : undefined,
  //     });
  //   }
  // }

  static async getReservationsByFilter(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
        return;
      }
      
      // Extrai os possíveis filtros da URL (req.query)
      const { roomId, date, status, userId } = req.query;

      // Monta o objeto 'where' para a consulta do Prisma dinamicamente
      const where: any = {};

      // REGRA DE SEGURANÇA: Se o usuário não for admin, ele SÓ PODE ver as próprias reservas.
      if (user.userType !== 'ADMIN') {
        where.userId = user.userId;
      } else if (userId) {
        // Se o usuário for admin E um 'userId' for passado como filtro, filtra por esse usuário.
        where.userId = parseInt(userId as string);
      }

      // Adiciona outros filtros se eles forem fornecidos na URL
      if (roomId) {
        where.roomId = parseInt(roomId as string);
      }

      if (status) {
        // Valida se o status é um dos valores permitidos pelo Enum
        if (['PENDING', 'APPROVED', 'REJECTED'].includes(status as string)) {
          where.status = status as ReservationStatus;
        } else {
            res.status(400).json({ success: false, message: 'Valor de status inválido.' });
            return;
        }
      }

      if (date) {
        // Para filtrar por um dia inteiro, criamos um intervalo do início ao fim do dia.
        const selectedDate = new Date(date as string);
        selectedDate.setUTCHours(0, 0, 0, 0);

        const nextDay = new Date(selectedDate);
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);

        where.date = {
          gte: selectedDate,
          lt: nextDay,
        };
      }
      
      const reservations = await prisma.reservation.findMany({
        where, // O objeto de filtro que montamos dinamicamente
        include: {
          user: { select: { id: true, name: true } },
          room: { select: { id: true, name: true } },
        },
        orderBy: [
            { date: 'asc' }, 
            { startTime: 'asc' }
        ],
      });

      res.status(200).json({
        success: true,
        message: 'Reservas recuperadas com sucesso.',
        count: reservations.length,
        data: reservations,
      });

    } catch (error) {
      console.error('Erro ao listar reservas:', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
  }

  static async createReservation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
        return;
      }
      
      const { roomId, date, startTime, endTime, reason } = req.body;
      const userId = user.userId;

      // Validações de entrada
      if (!roomId || !date || !startTime || !reason) {
        res.status(400).json({
          success: false,
          message: 'Cadastro não realizado. Todos os campos devem ser preenchidos!',
        });
        return;
      }

      // Verifica se a sala existe
      if (isNaN(roomId)) {
        res.status(400).json({
          success: false,
          message: 'ID da sala deve ser um número válido',
        });
        return;
      }

      const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
      if (!room) {
        res.status(404).json({
          success: false,
          message: 'Cadastro não realizado. Sala não encontrada!',
        });
        return;
      }

      // Verificar se a reserva já existe
      const existingReservation = await prisma.reservation.findUnique({
          where: {
            roomId_date_startTime: {
              roomId: roomId,
              date: date.trim(),
              startTime: startTime.trim(),
            },
          },
        });

      if (existingReservation) {
        res.status(409).json({
          success: false,
          message: 'Cadastro não realizado. Reserva já existente!',
        });
        return;
      }

      // Criar a nova reserva
      const newReservation = await prisma.reservation.create({
        data: {
          userId: userId,
          roomId: roomId,
          date: date.trim(),
          startTime: startTime.trim(),
          endTime: endTime.trim(),
          reason: reason.trim(),
        },
      });

      res.status(201).json({
        success: true,
        message: 'Cadastro realizado com sucesso!',
        data: newReservation,
      });
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao criar reserva',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }

  static async deleteReservation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reservationId = parseInt(id);

      // Validação do ID
      if (isNaN(reservationId)) {
        res.status(400).json({
          success: false,
          message: 'ID da reserva deve ser um número válido',
        });
        return;
      }

      // Verificar se a reserva existe
      const existingReservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!existingReservation) {
        res.status(404).json({
          success: false,
          message: 'Reserva não encontrada',
        });
        return;
      }

      // Deletar a reserva
      await prisma.reservation.delete({
        where: { id: reservationId },
      });

      res.status(200).json({
        success: true,
        message: 'Reserva deletada com sucesso',
        data: {
          deletedReservation: {
            id: existingReservation.id,
            name: existingReservation.date,
            description: existingReservation.startTime,
          },
        },
      });
    } catch (error) {
      console.error('Erro ao deletar reserva:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao deletar reserva',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }
}
