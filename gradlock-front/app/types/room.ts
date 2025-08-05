export interface Room {
  id: number;
  name: string;
  description: string;
  capacity: number;
  hasComputers: boolean;
  hasProjector: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomData {
  name: string;
  description: string;
  capacity: number;
  hasComputers: boolean;
  hasProjector: boolean;
}

export interface UpdateRoomData extends Partial<CreateRoomData> {}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  count?: number;
}
