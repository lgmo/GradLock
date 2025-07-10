import { Request, Response } from 'express';
import prisma from '../config/prismaClient';

export class RoomsController {
  static async getAllRooms(req: Request, res: Response): Promise<void> {
    try {
      const rooms = await prisma.room.findMany({
        orderBy: {
          name: 'asc'
        },
        select: {
          id: true,
          name: true,
          description: true,
          capacity: true,
          hasComputers: true,
          hasProjector: true,
          createdAt: true,
          updatedAt: true
        }
      });

      res.status(200).json({
        success: true,
        message: 'Salas recuperadas com sucesso',
        data: rooms,
        count: rooms.length
      });
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao buscar salas',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  static async getRoomById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roomId = parseInt(id);

      // Validação do ID
      if (isNaN(roomId)) {
        res.status(400).json({
          success: false,
          message: 'ID da sala deve ser um número válido'
        });
        return;
      }

      // Busca a sala com suas reservas
      const room = await prisma.room.findUnique({
        where: { id: roomId },
        include: {
          reservations: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  userType: true
                }
              }
            },
            orderBy: {
              date: 'desc'
            }
          }
        }
      });

      // Verifica se a sala existe
      if (!room) {
        res.status(404).json({
          success: false,
          message: 'Sala não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Sala encontrada com sucesso',
        data: room
      });
    } catch (error) {
      console.error('Erro ao buscar sala por ID:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao buscar sala',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}
