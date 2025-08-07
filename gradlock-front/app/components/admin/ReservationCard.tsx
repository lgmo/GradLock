'use client';

import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { 
  Search as SearchIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Room as RoomIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Reservation, ReservationSearchFilters, ReservationStatus } from '../../types/reservation';
import { Room } from '../../types/room';
import { ReservationService } from '../../api/services/reservationService';
import { RoomService } from '../../api/services/roomService';


interface ReservationCardProps {
  // Component props se necessário
}

export default function ReservationCard({}: ReservationCardProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<ReservationSearchFilters>({
    roomId: undefined,
    date: undefined,
    status: undefined,
  });

  // Estado separado para o campo de data formatado
  const [dateInput, setDateInput] = useState<string>('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Buscar todas as reservas inicialmente usando filtros vazios
        const reservationsData = await ReservationService.searchReservations({});
        setReservations(reservationsData);
        
        // Buscar salas para popular o dropdown de filtros
        const roomsData = await RoomService.getAllRooms();
        setRooms(roomsData);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados. Tente novamente.');
      }
    };
    
    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const searchFilters: any = {};
      
      // Só adicionar filtros se tiverem valores válidos
      if (filters.roomId) {
        searchFilters.roomId = filters.roomId;
      }
      
      // Validação mais rigorosa para a data
      if (filters.date && filters.date.trim() !== '') {
        // Verificar se a data está no formato correto YYYY-MM-DD e é válida
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(filters.date)) {
          const dateObj = new Date(filters.date);
          // Verificar se é uma data válida
          if (!isNaN(dateObj.getTime())) {
            searchFilters.date = filters.date;
            console.log('Data válida adicionada ao filtro:', filters.date);
          } else {
            console.log('Data inválida ignorada:', filters.date);
          }
        } else {
          console.log('Formato de data inválido ignorado:', filters.date);
        }
      }
      
      if (filters.status) {
        searchFilters.status = filters.status;
      }
      
      console.log('Filtros enviados:', searchFilters);
      
      const reservationsData = await ReservationService.searchReservations(searchFilters);
      setReservations(reservationsData);
    } catch (err) {
      setError('Erro ao buscar reservas. Tente novamente.');
      console.error('Erro ao buscar reservas:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.APPROVED:
        return 'success';
      case ReservationStatus.PENDING:
        return 'warning';
      case ReservationStatus.REJECTED:
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // Remove seconds
  };

  // Função para converter DD/MM/YYYY para YYYY-MM-DD
  const convertToISODate = (dateString: string) => {
    if (!dateString) return null;
    
    // Remover caracteres não numéricos e adicionar barras automaticamente
    let cleaned = dateString.replace(/\D/g, '');
    
    // Adicionar barras automaticamente enquanto digita
    if (cleaned.length >= 2) {
      cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    if (cleaned.length >= 5) {
      cleaned = cleaned.substring(0, 5) + '/' + cleaned.substring(5, 9);
    }
    
    // Verificar se está no formato completo DD/MM/YYYY
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = cleaned.match(dateRegex);
    
    if (match) {
      const [, day, month, year] = match;
      // Verificar se é uma data válida
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (date.getFullYear() == parseInt(year) && 
          date.getMonth() == parseInt(month) - 1 && 
          date.getDate() == parseInt(day)) {
        // Garantir que o mês e dia tenham sempre 2 dígitos
        const paddedMonth = month.padStart(2, '0');
        const paddedDay = day.padStart(2, '0');
        return `${year}-${paddedMonth}-${paddedDay}`;
      }
    }
    
    return null;
  };

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          <SearchIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Buscar Reservas
        </Typography>

        {/* Filtros de Busca */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Sala</InputLabel>
              <Select
                value={filters.roomId || ''}
                label="Sala"
                onChange={(e) => setFilters({ ...filters, roomId: Number(e.target.value) || undefined })}
              >
                <MenuItem value="">
                  <em>Todas as salas</em>
                </MenuItem>
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Data (DD/MM/AAAA)"
              placeholder="DD/MM/AAAA"
              helperText="Deixe vazio para buscar todas as datas"
              value={dateInput}
              onChange={(e) => {
                let value = e.target.value;
                console.log('Data digitada:', value);
                
                // Se o campo estiver vazio, limpar tudo
                if (!value || value.trim() === '') {
                  setDateInput('');
                  setFilters({ ...filters, date: undefined });
                  return;
                }
                
                // Aplicar máscara automaticamente
                let cleaned = value.replace(/\D/g, '');
                let masked = '';
                
                if (cleaned.length >= 1) {
                  masked = cleaned.substring(0, 2);
                }
                if (cleaned.length >= 3) {
                  masked += '/' + cleaned.substring(2, 4);
                }
                if (cleaned.length >= 5) {
                  masked += '/' + cleaned.substring(4, 8);
                }
                
                // Atualizar o estado do input
                setDateInput(masked);
                
                // Converter para formato ISO se estiver completo
                const convertedDate = convertToISODate(masked);
                if (convertedDate) {
                  console.log('Data convertida para ISO:', convertedDate);
                  setFilters({ ...filters, date: convertedDate });
                } else {
                  console.log('Data incompleta ou inválida');
                  // Para data incompleta, não definir o filtro
                  setFilters({ ...filters, date: undefined });
                }
              }}
              inputProps={{
                maxLength: 10,
                pattern: '[0-9]{2}/[0-9]{2}/[0-9]{4}'
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status || ''}
                label="Status"
                onChange={(e) => setFilters({ ...filters, status: e.target.value as ReservationStatus || undefined })}
              >
                <MenuItem value="">
                  <em>Todos os status</em>
                </MenuItem>
                <MenuItem value={ReservationStatus.PENDING}>Pendente</MenuItem>
                <MenuItem value={ReservationStatus.APPROVED}>Confirmado</MenuItem>
                <MenuItem value={ReservationStatus.REJECTED}>Rejeitado</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => {
                setFilters({
                  roomId: undefined,
                  date: undefined,
                  status: undefined,
                });
                setDateInput(''); // Limpar também o campo de data
                // Resetar também as reservas para todas
                ReservationService.searchReservations({}).then(setReservations);
              }}
              disabled={loading}
            >
              Limpar Filtros
            </Button>
          </Box>
        </Box>

        {/* Mensagem de erro */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Lista de Reservas */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Resultados ({reservations.length})
          </Typography>
          
          {reservations.length === 0 && !loading ? (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              <Typography variant="body1">
                Nenhuma reserva encontrada
              </Typography>
              <Typography variant="body2">
                Use os filtros acima para buscar reservas
              </Typography>
            </Box>
          ) : (
            <List>
              {reservations.map((reservation, index) => (
                <Box key={reservation.id}>
                  <ListItem
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      backgroundColor: 'background.paper'
                    }}
                  >
                    <ListItemText
                      primaryTypographyProps={{ component: 'div' }}
                      secondaryTypographyProps={{ component: 'div' }}
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <RoomIcon fontSize="small" color="primary" />
                          <Typography variant="subtitle1" component="span" fontWeight="bold">
                            {reservation.room?.name || `Sala ${reservation.roomId}`}
                          </Typography>
                          <Chip
                            label={reservation.status}
                            size="small"
                            color={getStatusColor(reservation.status) as any}
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <EventIcon fontSize="small" />
                              <Typography variant="body2" component="span">
                                {formatDate(reservation.date)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ScheduleIcon fontSize="small" />
                              <Typography variant="body2" component="span">
                                {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                              </Typography>
                            </Box>
                          </Box>
                          
                          {reservation.user && (
                            <Typography variant="body2" component="div" color="text.secondary">
                              Usuário: {reservation.user.name}
                            </Typography>
                          )}
                          
                          {reservation.reason && (
                            <Typography variant="body2" component="div" color="text.secondary" sx={{ mt: 0.5 }}>
                              Motivo: {reservation.reason}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < reservations.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
