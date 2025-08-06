'use client';

import {
    Box,
    Typography,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
} from '@mui/material';
import { Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';

// Tipos para reservas (você pode ajustar conforme sua estrutura)
interface Reservation {
    id: number;
    roomName: string;
    userName: string;
    startTime: string;
    endTime: string;
    status: 'active' | 'cancelled' | 'completed';
    date: string;
}

export default function ReservationsTab() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState<number | null>(null);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        try {
            setLoading(true);
            setError(null);
            // TODO: Implementar chamada para a API de reservas
            // const reservationsData = await ReservationService.getAllReservations();

        } catch (error) {
            console.error('Erro ao carregar reservas:', error);
            setError('Erro ao carregar reservas. Verifique se o servidor está funcionando.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReservation = (reservationId: number) => {
        setReservationToDelete(reservationId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!reservationToDelete) return;

        try {
            // TODO: Implementar chamada para a API
            // await ReservationService.deleteReservation(reservationToDelete);
            
            setReservations(reservations.filter((reservation) => reservation.id !== reservationToDelete));
            showSnackbar('Reserva cancelada com sucesso!', 'success');
        } catch (error: any) {
            console.error('Erro ao cancelar reserva:', error);
            showSnackbar(error.message || 'Erro ao cancelar reserva', 'error');
        } finally {
            setDeleteDialogOpen(false);
            setReservationToDelete(null);
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'cancelled':
                return 'error';
            case 'completed':
                return 'default';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active':
                return 'Ativa';
            case 'cancelled':
                return 'Cancelada';
            case 'completed':
                return 'Concluída';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
            >
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Carregando reservas...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={loadReservations} startIcon={<RefreshIcon />}>
                    Tentar Novamente
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ pt: 2 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={{ xs: 2, sm: 0 }}
            >
                <Typography
                    variant="h5"
                    component="h2"
                    fontWeight="bold"
                    sx={{ color: '#4C56F8' }}
                >
                    Reservas Ativas
                </Typography>
            </Box>

            {reservations.length === 0 ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    py={8}
                >
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                    >
                        Nenhuma reserva encontrada
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        As reservas aparecerão aqui quando forem criadas
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        maxHeight: 'calc(100vh - 300px)', // Altura máxima baseada na viewport
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        pr: 1, // Padding right para evitar que o scroll cubra o conteúdo
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#c1c1c1',
                            borderRadius: '4px',
                            '&:hover': {
                                background: '#a8a8a8',
                            },
                        },
                    }}
                >
                    <Box
                        display="grid"
                        gridTemplateColumns={{
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                        }}
                        gap={3}
                        pb={2} // Padding bottom para dar espaço no final
                    >
                        {reservations.map((reservation) => (
                        <Card
                            key={reservation.id}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    boxShadow: 3,
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.2s ease-in-out',
                                },
                            }}
                        >
                                <CardContent sx={{ flexGrow: 1 }}>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    mb={2}
                                >
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        fontWeight="bold"
                                    >
                                        {reservation.roomName}
                                    </Typography>
                                    <Chip
                                        label={getStatusLabel(reservation.status)}
                                        color={getStatusColor(reservation.status) as any}
                                        size="small"
                                    />
                                </Box>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Usuário:</strong> {reservation.userName}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Data:</strong> {new Date(reservation.date).toLocaleDateString('pt-BR')}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Horário:</strong> {reservation.startTime} - {reservation.endTime}
                                </Typography>

                                {reservation.status === 'active' && (
                                    <Box mt={2} display="flex" justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDeleteReservation(reservation.id)}
                                        >
                                            Cancelar
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    </Box>
                </Box>
            )}

            {/* Dialog de confirmação para cancelar reserva */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirmar Cancelamento</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja cancelar esta reserva? Esta ação
                        não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        color="error"
                        variant="contained"
                    >
                        Confirmar Cancelamento
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
