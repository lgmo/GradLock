'use client';

import {
    Box,
    Container,
    Tabs,
    Tab,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { useState } from 'react';
import Logo from '@/components/ui/Logo';
import RoomsTab from '@/components/admin/RoomsTab';
import ReservationsTab from '@/components/admin/ReservationsTab';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `admin-tab-${index}`,
        'aria-controls': `admin-tabpanel-${index}`,
    };
}

export default function AdminPage() {
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ mb: 3 }}>
                <Logo />
            </Box>
            <Container maxWidth="lg" sx={{ mt: 20, mb: 4, px: { xs: 2, sm: 3 } }}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="Abas do painel administrativo"
                            variant={isMobile ? 'fullWidth' : 'standard'}
                            sx={{
                                '& .MuiTab-root': {
                                    fontWeight: 'bold',
                                    fontSize: isMobile ? '0.875rem' : '1rem',
                                    textTransform: 'none',
                                    color: '#666',
                                    minHeight: isMobile ? 48 : 64,
                                    '&.Mui-selected': {
                                        color: '#4C56F8',
                                    },
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#4C56F8',
                                    height: 3,
                                },
                                '& .MuiTabs-scroller': {
                                    overflow: 'visible !important',
                                },
                            }}
                        >
                            <Tab
                                label="Salas"
                                {...a11yProps(0)}
                                sx={{ 
                                    minWidth: isMobile ? 0 : 160,
                                    flex: isMobile ? 1 : 'none',
                                }}
                            />
                            <Tab
                                label="Reservas"
                                {...a11yProps(1)}
                                sx={{ 
                                    minWidth: isMobile ? 0 : 160,
                                    flex: isMobile ? 1 : 'none',
                                }}
                            />
                        </Tabs>
                    </Box>

                    <Box sx={{ minHeight: 'calc(100vh - 200px)' }}>
                        <TabPanel value={value} index={0}>
                            <RoomsTab />
                        </TabPanel>

                        <TabPanel value={value} index={1}>
                            <ReservationsTab />
                        </TabPanel>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
