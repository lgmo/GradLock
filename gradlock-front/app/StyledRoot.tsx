"use client"
import React from "react";
import theme from "./theme";


import { ThemeProvider } from "@emotion/react";

export default function StyledRoot({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}
