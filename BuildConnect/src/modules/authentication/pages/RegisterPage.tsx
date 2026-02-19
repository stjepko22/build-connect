import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Link, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/stores/RootStore';
import { observer } from 'mobx-react-lite';
import { UserRole } from '../stores/AuthenticationStore';

const RegisterPage: React.FC = observer(() => {
  const { authenticationStore } = useStore();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('INVESTITOR');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await authenticationStore.login('novi@korisnik.com', role);
    navigate('/');
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 800 }}>
            Registracija
          </Typography>
          
          <Box sx={{ my: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Ja sam:
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={role}
              exclusive
              onChange={(_, newRole) => newRole && setRole(newRole)}
              fullWidth
            >
              <ToggleButton value="INVESTITOR">Investitor</ToggleButton>
              <ToggleButton value="IZVODJAC">Izvođač</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <form onSubmit={handleRegister}>
            <TextField fullWidth label="Ime i prezime / Naziv firme" margin="normal" required />
            <TextField fullWidth label="Email adresa" margin="normal" type="email" required />
            <TextField fullWidth label="Lozinka" margin="normal" type="password" required />
            
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              Kreiraj račun
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Već imate račun?{' '}
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => navigate('/login')}
                sx={{ fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
              >
                Prijavite se
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
});

export default RegisterPage;