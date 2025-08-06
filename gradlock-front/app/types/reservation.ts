export interface Reservation {
  id: number;
  userId: number;
  roomId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    userType: string;
  };
}