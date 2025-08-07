'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Room, CreateRoomData, UpdateRoomData } from '../../types/room';

interface RoomModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (roomData: CreateRoomData | UpdateRoomData) => Promise<void>;
  room?: Room | null;
  mode: 'create' | 'edit';
}

export default function RoomModal({ open, onClose, onSave, room, mode }: RoomModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: '',
    hasComputers: false,
    hasProjector: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (room && mode === 'edit') {
      setFormData({
        name: room.name,
        description: room.description,
        capacity: room.capacity.toString(),
        hasComputers: room.hasComputers,
        hasProjector: room.hasProjector,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        capacity: '',
        hasComputers: false,
        hasProjector: false,
      });
    }
    setErrors({});
    setGeneralError(null);
  }, [room, mode, open]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    const capacity = parseInt(formData.capacity);
    if (!formData.capacity || isNaN(capacity) || capacity <= 0) {
      newErrors.capacity = 'Capacidade deve ser um número positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapServerErrorToField = (errorMessage: string) => {
    const newErrors: { [key: string]: string } = {};
    
    // Mapear erros de capacidade
    if (errorMessage.includes('capacidade') && 
        (errorMessage.includes('positivo') || errorMessage.includes('número'))) {
      newErrors.capacity = errorMessage;
    }
    // Mapear erros de nome/sala existente
    else if (errorMessage.includes('já existente') || 
             errorMessage.includes('já está cadastrada') ||
             errorMessage.includes('nome está indisponível') ||
             errorMessage.includes('indisponível')) {
      newErrors.name = errorMessage;
    }
    // Mapear erros de campos obrigatórios
    else if (errorMessage.includes('campos devem ser preenchidos') ||
             errorMessage.includes('descrição') && errorMessage.includes('obrigatór')) {
      newErrors.description = errorMessage;
    }
    // Mapear erros de dados não fornecidos (edição)
    else if (errorMessage.includes('Nenhum dado fornecido')) {
      setGeneralError(errorMessage);
      return;
    }
    // Outros erros gerais
    else {
      setGeneralError(errorMessage);
      return;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError(null);
    setErrors({});
    try {
      const roomData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        capacity: parseInt(formData.capacity),
        hasComputers: formData.hasComputers,
        hasProjector: formData.hasProjector,
      };

      await onSave(roomData);
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar sala:', error);
      mapServerErrorToField(error.message || 'Erro ao salvar sala');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Limpar erro geral quando usuário começar a digitar
    if (generalError) {
      setGeneralError(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Criar Nova Sala' : 'Editar Sala'}
      </DialogTitle>
      
      <DialogContent>
        {generalError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {generalError}
          </Alert>
        )}
        
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          <TextField
            label="Nome da Sala"
            fullWidth
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            disabled={loading}
          />

          <TextField
            label="Descrição"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange('description')}
            error={!!errors.description}
            helperText={errors.description}
            disabled={loading}
          />

          <TextField
            label="Capacidade"
            type="number"
            fullWidth
            value={formData.capacity}
            onChange={handleChange('capacity')}
            error={!!errors.capacity}
            helperText={errors.capacity}
            disabled={loading}
            inputProps={{ min: 1 }}
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Recursos Disponíveis:
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hasComputers}
                  onChange={handleChange('hasComputers')}
                  disabled={loading}
                />
              }
              label="Computadores"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hasProjector}
                  onChange={handleChange('hasProjector')}
                  disabled={loading}
                />
              }
              label="Projetor"
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Salvando...' : mode === 'create' ? 'Criar' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
