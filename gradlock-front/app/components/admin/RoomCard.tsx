'use client';

import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box, 
  IconButton, 
  Tooltip,
  Stack
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Computer as ComputerIcon, 
  Videocam as ProjectorIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { Room } from '../../types/room';

interface RoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (roomId: number) => void;
}

export default function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(room);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(room.id);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
      onClick={() => onEdit(room)}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="h3" fontWeight="bold">
            {room.name}
          </Typography>
          <Box>
            <Tooltip title="Editar sala">
              <IconButton 
                size="small" 
                onClick={handleEditClick}
                sx={{ mr: 1 }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Deletar sala">
              <IconButton 
                size="small" 
                onClick={handleDeleteClick}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, minHeight: '40px' }}
        >
          {room.description}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <PeopleIcon fontSize="small" color="primary" />
          <Typography variant="body2">
            Capacidade: <strong>{room.capacity}</strong>
          </Typography>
        </Stack>

        <Box display="flex" gap={1} flexWrap="wrap">
          {room.hasComputers && (
            <Chip
              icon={<ComputerIcon />}
              label="Computadores"
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {room.hasProjector && (
            <Chip
              icon={<ProjectorIcon />}
              label="Projetor"
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
