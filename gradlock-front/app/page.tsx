'use client';

import {
    Alert,
    AlertProps,
    Box,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import Logo from '@/components/ui/Logo';
import AuthCard from '@/components/auth/AuthCard';
import AuthButton from '@/components/auth/AuthButton';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import { AuthService } from './api/services/authService';
import Link from 'next/link';

export default function Home() {
    type SnackbarState = {
        open: boolean;
        message: string;
        severity: AlertProps['severity'];
    };

    const useSnackbar = () => {
        const [snackbar, setSnackbar] = useState<SnackbarState>({
            open: false,
            message: '',
            severity: 'success',
        });

        const showSnackbar = (
            message: string,
            severity: AlertProps['severity'] = 'success'
        ) => {
            setSnackbar({ open: true, message, severity });
        };

        const closeSnackbar = () => {
            setSnackbar((prev) => ({ ...prev, open: false }));
        };

        return { snackbar, showSnackbar, closeSnackbar };
    };

    const CustomSnackbar = ({
        snackbar,
        onClose,
    }: {
        snackbar: SnackbarState;
        onClose: () => void;
    }) => (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={onClose}
        >
            <Alert
                onClose={onClose}
                severity={snackbar.severity}
                variant="filled"
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    );

    const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (!cpf || !password) {
                showSnackbar('Preencha todos os campos!', 'error');
                return;
            }

            const parsedCpf = cpf.replace(/\D/g, '');
            if (parsedCpf.length !== 11) {
                showSnackbar('CPF inválido!', 'error');
                return;
            }

            const { accessToken, refreshToken, expiresIn } =
                await AuthService.login(parsedCpf, password);

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('tokenExpiresIn', expiresIn.toString());
            localStorage.setItem('refreshToken', refreshToken);

            showSnackbar('Login realizado com sucesso!', 'success');

            setTimeout(() => {
                window.location.href = '/admin';
            }, 2000);
        } catch (err) {
            const error = err as { message?: string };
            showSnackbar(error?.message || 'Erro ao realizar login!', 'error');
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
                            id="user-password"
                            variant="outlined"
                            size="small"
                            label="Senha"
                            type="password"
                            fullWidth
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <AuthButton type="submit">Entrar</AuthButton>

                        <AuthButton
                            backgroundColor={grey[700]}
                            hoverColor={grey[900]}
                        >
                            Cadastrar Aluno
                        </AuthButton>

                        <AuthButton
                            backgroundColor={grey[700]}
                            hoverColor={grey[900]}
                        >
                            Cadastrar Professor
                        </AuthButton>
                    </Box>
                </AuthCard>
            </Box>
            <CustomSnackbar snackbar={snackbar} onClose={closeSnackbar} />
        </Box>
    );
}
