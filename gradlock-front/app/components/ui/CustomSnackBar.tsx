import { SnackbarState } from '@/types/snackbar';
import { Alert, Snackbar } from '@mui/material';

export const CustomSnackbar = ({
    snackbar,
    onClose,
}: {
    snackbar: SnackbarState;
    onClose: () => void;
}) => (
    <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={onClose}>
        <Alert onClose={onClose} severity={snackbar.severity} variant="filled">
            {snackbar.message}
        </Alert>
    </Snackbar>
);
