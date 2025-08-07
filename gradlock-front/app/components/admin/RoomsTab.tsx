'use client';

import {
    Box,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Room, CreateRoomData, UpdateRoomData } from '../../types/room';
import { RoomService } from '../../api/services/roomService';
import RoomCard from './RoomCard';
import RoomModal from './RoomModal';

export default function RoomsTab() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
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
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            setLoading(true);
            setError(null);
            const roomsData = await RoomService.getAllRooms();
            setRooms(roomsData);
        } catch (error) {
            alert(error);
            console.error('Erro ao carregar salas:', error);
            setError(
                'Erro ao carregar salas. Verifique se o servidor está funcionando.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = () => {
        setSelectedRoom(null);
        setModalMode('create');
        setModalOpen(true);
    };

    const handleEditRoom = (room: Room) => {
        setSelectedRoom(room);
        setModalMode('edit');
        setModalOpen(true);
    };

    const handleDeleteRoom = (roomId: number) => {
        setRoomToDelete(roomId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!roomToDelete) return;

        try {
            await RoomService.deleteRoom(roomToDelete);
            setRooms(rooms.filter((room) => room.id !== roomToDelete));
            showSnackbar('Sala deletada com sucesso!', 'success');
        } catch (error: any) {
            console.error('Erro ao deletar sala:', error);
            showSnackbar(error.message || 'Erro ao deletar sala', 'error');
        } finally {
            setDeleteDialogOpen(false);
            setRoomToDelete(null);
        }
    };

    const handleSaveRoom = async (
        roomData: CreateRoomData | UpdateRoomData
    ) => {
        try {
            if (modalMode === 'create') {
                const newRoom = await RoomService.createRoom(
                    roomData as CreateRoomData
                );
                setRooms([...rooms, newRoom]);
                showSnackbar('Sala criada com sucesso!', 'success');
            } else if (selectedRoom) {
                const updatedRoom = await RoomService.updateRoom(
                    selectedRoom.id,
                    roomData as UpdateRoomData
                );
                setRooms(
                    rooms.map((room) =>
                        room.id === selectedRoom.id ? updatedRoom : room
                    )
                );
                showSnackbar('Sala atualizada com sucesso!', 'success');
            }
        } catch (error: any) {
            console.error('Erro ao salvar sala:', error);
            // O erro agora é exibido no modal, então apenas re-throw
            throw error;
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
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
                    Carregando salas...
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
                <Button variant="contained" onClick={loadRooms}>
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
                    Gerenciar Salas
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateRoom}
                    size="large"
                >
                    Nova Sala
                </Button>
            </Box>

            {rooms.length === 0 ? (
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
                        Nenhuma sala cadastrada
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={3}
                    >
                        Clique em "Nova Sala" para adicionar a primeira sala
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateRoom}
                    >
                        Criar Primeira Sala
                    </Button>
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
                            sm: 'repeat(auto-fill, minmax(350px, 1fr))',
                        }}
                        gap={3}
                        pb={2} // Padding bottom para dar espaço no final
                    >
                        {rooms.map((room) => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                onEdit={handleEditRoom}
                                onDelete={handleDeleteRoom}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* Modal para criar/editar sala */}
            <RoomModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveRoom}
                room={selectedRoom}
                mode={modalMode}
            />

            {/* Dialog de confirmação para deletar */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja deletar esta sala? Esta ação
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
                        Deletar
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
