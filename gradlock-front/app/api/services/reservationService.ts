import { AxiosResponse } from 'axios';
import api from '../api'; // Sua instância configurada do Axios
import {
  Reservation,
  ReservationSearchFilters,
  ApiResponse,
} from '../../types/reservation'; // Importando os tipos

export class ReservationService {
   /**
    * Busca reservas com base em filtros.
    * @param filters - Um objeto com os filtros a serem aplicados.
    */
  static async searchReservations(filters: ReservationSearchFilters): Promise<Reservation[]> {
    const response: AxiosResponse<ApiResponse<Reservation[]>> = await api.get('/reservations/search', {
      params: filters,
    });
    return response.data.data;
  }

  /**
   * Corresponde a: GET /reservations
   */
  static async getAllReservations(): Promise<Reservation[]> {
    const response: AxiosResponse<ApiResponse<Reservation[]>> = await api.get('/reservations');
    return response.data.data;
  }
}