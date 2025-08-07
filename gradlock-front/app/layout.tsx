import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Box, Typography } from "@mui/material";
import StyledRoot from "./StyledRoot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GradLock",
  icons: {
    icon: "/gradlock-logo-mini.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning={true}
      >
        <AppRouterCacheProvider>
          <StyledRoot>
            <Box
              sx={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                backgroundImage: "url(/background.png)",
                backgroundSize: "cover",
                zIndex: 2,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(8px)',
                  zIndex: 1,
                }
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 3,
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {children}
              </Box>
            </Box>
            <Box sx={{
              display: "flex",
              justifyContent: "center",
              height: "auto",
              bgcolor: "white",
              width: "100vw",
              color: "black",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: 0,
              position: "absolute",
              zIndex: 2,
            }}>
              <Typography variant="caption">
                Projeto desenvolvido para a disciplina de Engenharia de Software e Sistemas - UFPE © 2025
              </Typography>
            </Box>
          </StyledRoot>
        </AppRouterCacheProvider>

      </body>
    </html>
  );
}
