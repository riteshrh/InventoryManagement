import { useState } from 'react';
import { Box, Typography, Grid, Button, TextField } from '@mui/material';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebaseConfig'; 
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard/dashboard');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard/dashboard');
    } catch (error) {
      setError('Failed to sign in with Google');
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
            Login
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <form onSubmit={handleEmailLogin}>
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
              Sign In
            </Button>
          </form>
          <Button
            onClick={handleGoogleLogin}
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign In with Google
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
