import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/stores/RootStore';
import { observer } from 'mobx-react-lite';
import EngineeringIcon from '@mui/icons-material/Engineering';

const Navbar: React.FC = observer(() => {
  const { authenticationStore } = useStore();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ backgroundColor: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <EngineeringIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 800, cursor: 'pointer', letterSpacing: '.1rem' }}
            onClick={() => navigate('/')}
          >
            BUILD<span style={{ color: '#FFB300' }}>CONNECT</span>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="secondary" onClick={() => navigate('/marketplace')}>
              Marketplace
            </Button>

            {authenticationStore.isAuthenticated ? (
              <>
                <Button color="secondary" onClick={() => navigate('/moji-poslovi')}>
                  Moji Poslovi
                </Button>
                
                {authenticationStore.user?.role === 'INVESTITOR' && (
                  <Button variant="contained" color="primary" onClick={() => navigate('/objavi-posao')}>
                    Objavi Posao
                  </Button>
                )}
                
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  size="small"
                  onClick={() => {
                    authenticationStore.logout();
                    navigate('/');
                  }}
                >
                  Odjava ({authenticationStore.user?.displayName})
                </Button>
              </>
            ) : (
              <>
                <Button color="secondary" onClick={() => navigate('/login')}>Prijava</Button>
                <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
                  Registracija
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
});

export default Navbar;