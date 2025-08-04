import { Card, CardContent, Box } from "@mui/material";

export default function AuthCard({ children }: { children: React.ReactNode }) {
    return (
        <Card sx={{
            minWidth: "25vw",
            padding: 2,
            boxShadow: 3,
            borderRadius: 2
        }}>
            <CardContent sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
            }}>
                {children}
            </CardContent>
        </Card>
    );
}
