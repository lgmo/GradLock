'use client';

import { Box, TextField, Typography } from '@mui/material';
import Logo from '@/components/ui/Logo';
import AuthCard from '@/components/auth/AuthCard';
import AuthButton from '@/components/auth/AuthButton';
import { useState } from 'react';
import { UserService } from '@/api/services/userService';
import useSnackbar from '@/hooks/useSnackbar';
import { CustomSnackbar } from '@/components/ui/CustomSnackBar';

export default function RegisterTeacher() {
    const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (!cpf || !password || !name) {
                showSnackbar('Preencha todos os campos!', 'error');
                return;
            }

            const parsedCpf = cpf.replace(/\D/g, '');
            if (parsedCpf.length !== 11) {
                showSnackbar('CPF inválido!', 'error');
                return;
            }

            await UserService.create({
                cpf,
                password,
                name,
                userType: 'TEACHER',
            });

            showSnackbar('Usuário criado com sucesso!', 'success');

            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } catch (err) {
            const error = err as { message?: string };
            showSnackbar(error?.message || 'Erro ao fazer cadastro!', 'error');
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            <Logo />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <AuthCard>
                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{ mb: 1, textAlign: 'center' }}
                    >
                        Entrar
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 3,
                        }}
                        component={'form'}
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            variant="outlined"
                            size="small"
                            label="CPF"
                            fullWidth
                            onChange={(e) => setCpf(e.target.value)}
                        />

                        <TextField
                            variant="outlined"
                            size="small"
                            label="Name"
                            fullWidth
                            onChange={(e) => setName(e.target.value)}
                        />

                        <TextField
                            variant="outlined"
                            size="small"
                            label="Senha"
                            type="password"
                            fullWidth
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <AuthButton type="submit">Cadastrar</AuthButton>
                    </Box>
                </AuthCard>
            </Box>
            <CustomSnackbar snackbar={snackbar} onClose={closeSnackbar} />
        </Box>
    );
}
