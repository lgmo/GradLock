import { SnackbarState } from '@/types/snackbar';
import { AlertProps } from '@mui/material';
import { useState } from 'react';

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

export default useSnackbar;
