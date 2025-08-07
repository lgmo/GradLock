'use client';

import { Container, Box, Typography, Paper } from '@mui/material';
import ReservationCard from '../components/admin/ReservationCard';
import Logo from '../components/ui/Logo';

export default function UserPage() {
  return (
    <>
      <Logo />
      <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', alignItems: 'center', py: 2 }}>
        <Box sx={{ width: '100%' }}>
          <Typography 
            variant="h6" 
            component="div"
            color="text.secondary" 
            align="center" 
            sx={{ mb: 3 }}
          >
            Busca e Visualização de Reservas
          </Typography>

          <Paper 
            elevation={4} 
            sx={{ 
              p: 0, 
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <ReservationCard />
          </Paper>
        </Box>
      </Container>
    </>
  );
}