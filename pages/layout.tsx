// src/app/layout.tsx
import { ReactNode } from 'react';
import Navbar from './navbar';
import { Container } from '@mui/material';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Navbar />
            <Container>
                {children}
            </Container>
        </>
    );
};

export default Layout;
