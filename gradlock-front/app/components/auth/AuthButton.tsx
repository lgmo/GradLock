import { Button, ButtonProps } from '@mui/material';
import { grey } from '@mui/material/colors';

interface AuthButtonProps extends ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    backgroundColor?: string;
    hoverColor?: string;
}

export default function AuthButton({
    children,
    onClick,
    variant = 'contained',
    backgroundColor = 'primary.main',
    hoverColor = undefined,
    ...props
}: AuthButtonProps) {
    return (
        <Button
            variant={variant}
            size="large"
            fullWidth
            onClick={onClick}
            sx={{
                py: 1.5,
                backgroundColor: backgroundColor,
                '&:hover': {
                    ...(hoverColor && { backgroundColor: hoverColor }),
                    transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
            }}
            {...props}
        >
            {children}
        </Button>
    );
}
