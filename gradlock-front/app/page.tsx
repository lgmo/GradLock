import { Box, TextField, Typography } from "@mui/material";
import Logo from "@/components/ui/Logo";
import AuthCard from "@/components/auth/AuthCard";
import AuthButton from "@/components/auth/AuthButton";
import { grey } from "@mui/material/colors";

export default function Home() {
  return (
    <Box sx={{
      display: "flex",
      height: "100vh",
      flexDirection: "column",
      position: 'relative'
    }}>
      <Logo />

      <Box sx={{
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        height: "100vh"
      }}>
        <AuthCard>
          <Typography variant="h5" component="h1" sx={{ mb: 1, textAlign: 'center' }}>
            Entrar
          </Typography>

          <TextField
            id="user-email"
            variant="outlined"
            size="small"
            label="CPF"
            fullWidth
          />

          <TextField
            id="user-password"
            variant="outlined"
            size="small"
            label="Senha"
            type="password"
            fullWidth
          />

          <AuthButton>
            Entrar
          </AuthButton>

          <AuthButton color={grey[700]} hoverColor={grey[900]}>
            Cadastrar Aluno
          </AuthButton>

          <AuthButton color={grey[700]} hoverColor={grey[900]}>
            Cadastrar Professor
          </AuthButton>
        </AuthCard>
      </Box>
    </Box>
  );
}