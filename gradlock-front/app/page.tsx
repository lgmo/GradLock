'use client';

import { Box, TextField, Typography } from '@mui/material';
import Logo from '@/components/ui/Logo';
import AuthCard from '@/components/auth/AuthCard';
import AuthButton from '@/components/auth/AuthButton';
import { grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { AuthService } from './api/services/authService';
import { useRouter } from 'next/navigation';
import useSnackbar from './hooks/useSnackbar';
import { CustomSnackbar } from './components/ui/CustomSnackBar';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            router.push('/admin');
        }
    }, [router]);

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
                            onClick={() => {
                                window.location.href = '/cadastro/aluno';
                            }}
                        >
                            Cadastrar Aluno
                        </AuthButton>

                        <AuthButton
                            backgroundColor={grey[700]}
                            hoverColor={grey[900]}
                            onClick={() => {
                                window.location.href = '/cadastro/professor';
                            }}
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
