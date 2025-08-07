export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
}

export interface Reservation {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  reason?: string | null;
  roomId: number;
  userId: number;
  createdAt: string;
  updatedAt: string; 
  room?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    name: string;
  };
}

export interface ReservationSearchFilters {
  roomId?: number;
  date?: string;
  status?: ReservationStatus;
  userId?: number; 
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  count?: number;
}