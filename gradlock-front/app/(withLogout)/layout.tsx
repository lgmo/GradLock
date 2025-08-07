'use client';

import { Button, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import React from 'react';

export default function LogoutLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    async function handleLogout(e: any) {
        e.preventDefault();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresIn');

        const redirect = () => {
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        };
        redirect();
    }
    return (
        <>
            <Button
                onClick={handleLogout}
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: 'translate(5%, 5%)',
                }}
                startIcon={<LogoutIcon />}
            >
                    Sair
            </Button>
            {children}
        </>
    );
}
