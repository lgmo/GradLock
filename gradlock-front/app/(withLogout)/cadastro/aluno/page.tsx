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
import { useState } from 'react';
import { AuthService } from '@/api/services/authService';
import { UserService } from '@/api/services/userService';

export default function RegisterStudent() {
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
    const [name, setName] = useState('');
    const [enrollment, setEnrollment] = useState('');
    const [course, setCourse] = useState('');

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
                userType: 'STUDENT',
                enrollment,
                course,
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
                            label="Nome"
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

                        <TextField
                            variant="outlined"
                            size="small"
                            label="Matricula"
                            fullWidth
                            onChange={(e) => setEnrollment(e.target.value)}
                        />

                        <TextField
                            variant="outlined"
                            size="small"
                            label="Curso"
                            fullWidth
                            onChange={(e) => setCourse(e.target.value)}
                        />

                        <AuthButton type="submit">Cadastrar</AuthButton>
                    </Box>
                </AuthCard>
            </Box>
            <CustomSnackbar snackbar={snackbar} onClose={closeSnackbar} />
        </Box>
    );
}
