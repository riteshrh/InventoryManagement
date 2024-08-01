import { useState } from 'react';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/login/login');
    } catch (error) {
      setError('Error creating account');
    }
  };

  return (
    <Grid container sx={{ minHeight: '89vh' }}>
      <Grid item xs={12} md={6} sx={{ bgcolor: 'lightblue', display: { xs: 'none', md: 'block' } }} />
      <Grid item xs={12} md={6} sx={{ bgcolor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          bgcolor="white"
          p={4}
          boxShadow={3}
          borderRadius={2}
          sx={{ maxWidth: 400, width: '100%' }}
        >
          <Typography variant="h5" component="h1" mb={3}>
            Register
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <form onSubmit={handleRegister}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Register
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}
