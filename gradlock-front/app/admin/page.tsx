'use client';

import {
    Box,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Container,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Room, CreateRoomData, UpdateRoomData } from '../types/room';
import { RoomService } from '../api/services/roomService';
import RoomCard from '../components/admin/RoomCard';
import RoomModal from '../components/admin/RoomModal';
import Logo from '../components/ui/Logo';

export default function AdminPage() {
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
            showSnackbar(error.message || 'Erro ao salvar sala', 'error');
            throw error; // Re-throw para o modal continuar mostrando o loading
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
                minHeight="100vh"
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
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={loadRooms}>
                    Tentar Novamente
                </Button>
            </Container>
        );
    }

    return (
        <>
            <Logo />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={4}
                >
                    <Typography
                        variant="h4"
                        component="h1"
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
                        display="grid"
                        gridTemplateColumns="repeat(auto-fill, minmax(350px, 1fr))"
                        gap={3}
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
            </Container>
        </>
    );
}
