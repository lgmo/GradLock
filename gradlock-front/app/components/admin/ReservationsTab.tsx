'use client';

import { Box, Typography, Paper } from '@mui/material';
import ReservationCard from './ReservationCard';

export default function ReservationsTab() {
    return (
        <Box sx={{ pt: 2 }}>
            <Typography 
                variant="h5" 
                component="h2"
                fontWeight="bold"
                sx={{ color: '#4C56F8', mb: 3, textAlign: 'center' }}
            >
                Busca e Visualização de Reservas
            </Typography>

            <Paper 
                elevation={4} 
                sx={{ 
                    p: 0, 
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    maxWidth: '100%',
                    margin: 'auto'
                }}
            >
                <ReservationCard />
            </Paper>
        </Box>
    );
}
