import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/stores/RootStore';
import { observer } from 'mobx-react-lite';

const LoginPage: React.FC = observer(() => {
  const { authenticationStore } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const role = email.includes('investitor') ? 'INVESTITOR' : 'IZVODJAC';
    await authenticationStore.login(email, role);
    navigate('/');
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 800 }}>
            Prijava
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Dobrodošli natrag na BuildConnect
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email adresa"
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Lozinka"
              type="password"
              margin="normal"
              variant="outlined"
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={authenticationStore.isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {authenticationStore.isLoading ? 'Prijava u tijeku...' : 'Prijavi se'}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Nemate račun?{' '}
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => navigate('/register')}
                sx={{ fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
              >
                Registrirajte se
              </Link>
            </Typography>
          </Box>
        </Paper>
        <Alert severity="info" sx={{ mt: 3, width: '100%' }}>
          Info: Unesite "investitor" u email za ulogu Investitora, bilo što drugo za Izvođača.
        </Alert>
      </Box>
    </Container>
  );
});

export default LoginPage;