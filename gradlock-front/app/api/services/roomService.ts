import { AxiosResponse } from 'axios';
import api from '../api';
import { Room, CreateRoomData, UpdateRoomData, ApiResponse } from '../../types/room';

export class RoomService {
  static async getAllRooms(): Promise<Room[]> {
    const response: AxiosResponse<ApiResponse<Room[]>> = await api.get('/rooms');
    return response.data.data;
  }

  static async createRoom(roomData: CreateRoomData): Promise<Room> {
    const response: AxiosResponse<ApiResponse<Room>> = await api.post('/rooms', roomData);
    return response.data.data;
  }

  static async updateRoom(roomId: number, roomData: UpdateRoomData): Promise<Room> {
    const response: AxiosResponse<ApiResponse<Room>> = await api.put(`/rooms/${roomId}`, roomData);
    return response.data.data;
  }

  static async deleteRoom(roomId: number): Promise<void> {
    await api.delete(`/rooms/${roomId}`);
  }
}
