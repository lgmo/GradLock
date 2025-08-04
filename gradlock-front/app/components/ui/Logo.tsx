import { Box } from "@mui/material";

export default function Logo() {
    return (
        <Box
            component="img"
            src="/gradlock-logo.svg"
            alt="Gradlock Logo"
            sx={{
                position: "absolute",
                left: "50%",
                top: "-7.5%",
                transform: "translateX(-50%)",
                height: 300,
                width: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(226deg) brightness(104%) contrast(97%)'
            }}
        />
    );
}