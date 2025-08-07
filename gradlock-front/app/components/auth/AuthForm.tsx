import { Button } from "@mui/material";
import { grey } from "@mui/material/colors";

type AuthButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'contained' | 'outlined';
    color?: string;
    hoverColor?: string,
};

export default function AuthButton({
    children,
    onClick,
    variant = 'contained',
    color = 'primary.main',
    hoverColor = undefined,
}: AuthButtonProps) {
    const colors = {
        primary: { bg: '#1976d2', hover: '#1565c0' },
        grey: { bg: grey[700], hover: grey[900] }
    };

    return (
        <Button
            variant={variant}
            size="large"
            fullWidth
            onClick={onClick}
            sx={{
                py: 1.5,
                backgroundColor: color,
                '&:hover': {
                    ...(hoverColor && { bgColor: hoverColor }),
                    transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
            }}
        >
            {children}
        </Button>
    );
}