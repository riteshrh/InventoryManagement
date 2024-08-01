import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useRouter } from 'next/router';
import { auth } from '../firebaseConfig'; // Ensure this path is correct
import { onAuthStateChanged, signOut } from 'firebase/auth';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
    const [user, setUser] = useState<any>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '/login/login';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };
    

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={{ bgcolor: '#1a237e' }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => router.push('/')}>
                        Pantry Tracker
                    </Typography>
                    {user ? (
                        <>
                            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <Button color="inherit" onClick={() => router.push('dashboard/dashboard')} sx={{ mr: 2 }}>
                                    Dashboard
                                </Button>
                                <Button color="inherit" onClick={() => router.push('/insights')} sx={{ mr: 2 }}>
                                    Insights
                                </Button>
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Box>
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <IconButton color="inherit" aria-label="menu" onClick={handleMenu}>
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    keepMounted
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={() => { handleClose(); router.push('dashboard/dashboard'); }}>Dashboard</MenuItem>
                                    <MenuItem onClick={() => { handleClose(); router.push('/insights'); }}>Insights</MenuItem>
                                    <MenuItem onClick={() => { handleClose(); handleLogout(); }}>Logout</MenuItem>
                                </Menu>
                            </Box>
                            <IconButton sx={{ ml: 2 }} onClick={() => router.push('/profile')}>
                                <Avatar alt={user.displayName} src={user.photoURL} />
                            </IconButton>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex' }}>
                            <Button color="inherit" onClick={() => router.push('/login/login')} sx={{ mr: 2 }}>
                                Login
                            </Button>
                            <Button color="inherit" onClick={() => router.push('/login/register')}>
                                Register
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
