import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, MenuItem, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/stores/RootStore';
import { observer } from 'mobx-react-lite';

const LoginPage: React.FC = observer(() => {
  const { authenticationStore } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'INVESTITOR' | 'IZVODJAC'>('INVESTITOR');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Sada šaljemo i ulogu u store kako bi aplikacija znala što smijemo raditi
    await authenticationStore.login(email, password, role);
    navigate('/');
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 800 }}>
            Prijava
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
            BuildConnect - Građevinski Marketplace
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email adresa"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Lozinka"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <TextField
              fullWidth
              select
              label="Prijavi me kao"
              margin="normal"
              value={role}
              onChange={(e) => setRole(e.target.value as 'INVESTITOR' | 'IZVODJAC')}
              helperText="Odaberite vašu ulogu za testiranje funkcionalnosti"
            >
              <MenuItem value="INVESTITOR">Investitor (Objavljujem poslove)</MenuItem>
              <MenuItem value="IZVODJAC">Izvođač (Šaljem ponude)</MenuItem>
            </TextField>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={authenticationStore.isLoading}
            >
              {authenticationStore.isLoading ? 'Prijava...' : 'Prijavi se'}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/register')}
            >
              Nemaš račun? Registriraj se
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
});

export default LoginPage;