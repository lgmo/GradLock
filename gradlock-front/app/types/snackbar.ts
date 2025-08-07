import { AlertProps } from '@mui/material';

export interface SnackbarState {
    open: boolean;
    message: string;
    severity: AlertProps['severity'];
}
