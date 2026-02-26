import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  alpha,
  useScrollTrigger,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRootStore } from '@/hooks/useRootStore';
import { observer } from 'mobx-react-lite';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

// Atomi i Molekule
import BaseButton from '@/components/common/atoms/buttons/BaseButton';
import BaseContainer from '@/components/common/atoms/containers/BaseContainer';
import BaseLogo from '@/components/common/atoms/logo/BaseLogo';
import UserAvatarMenu from '@/components/common/molecules/navigation/UserAvatarMenu';

const Navbar: React.FC = observer(() => {
  // Izvlačimo store-ove iz rootStore-a
  const { authenticationStore } = useRootStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 20,
  });

  const isActive = (path: string) => location.pathname === path;
  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const navigateAndClose = (path: string) => {
    navigate(path);
    closeMobileMenu();
  };

  // Destrukturiramo radi lakšeg pristupa i čišćeg koda
  const { isAuthenticated, user, setLoginDialogOpen } = authenticationStore;

  return (
    <AppBar 
      position="sticky" 
      elevation={trigger ? 4 : 0}
      sx={{ 
        backgroundColor: trigger ? alpha('#FFFFFF', 0.9) : '#FFFFFF',
        backdropFilter: trigger ? 'blur(12px)' : 'none',
        borderBottom: '1px solid',
        borderColor: trigger ? 'transparent' : 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1100
      }}
    >
      <BaseContainer maxWidth="lg" withPadding={false}>
        <Toolbar disableGutters sx={{ height: { xs: 64, md: 80 } }}>
          <BaseLogo />

          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, ml: { sm: 2, md: 6 }, gap: 1 }}>
            <BaseButton 
              variant="text" 
              color={isActive('/marketplace') ? 'primary' : 'secondary'}
              onClick={() => navigate('/marketplace')}
              sx={{ fontWeight: isActive('/marketplace') ? 800 : 600 }}
            >
              Marketplace
            </BaseButton>

            {/* Link vidljiv samo prijavljenim korisnicima */}
            {isAuthenticated && (
              <BaseButton 
                variant="text" 
                color={isActive('/moji-poslovi') ? 'primary' : 'secondary'}
                onClick={() => navigate('/moji-poslovi')}
                sx={{ fontWeight: isActive('/moji-poslovi') ? 800 : 600 }}
              >
                Moji Poslovi
              </BaseButton>
            )}
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: { sm: 1, md: 2 } }}>
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {user?.role === 'INVESTITOR' && (
                  <BaseButton 
                    variant="contained" 
                    color="primary" 
                    onClick={() => navigate('/objavi-posao')}
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                  >
                    Objavi Posao
                  </BaseButton>
                )}
                
                {/* Ovdje se nalazi ikona profila/avatara */}
                <UserAvatarMenu />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BaseButton 
                  variant="text" 
                  color="secondary" 
                  onClick={() => setLoginDialogOpen(true)}
                >
                  Prijava
                </BaseButton>
                <BaseButton 
                  variant="contained" 
                  color="primary" 
                  onClick={() => navigate('/register')}
                >
                  Registracija
                </BaseButton>
              </Box>
            )}
          </Box>

          <Box sx={{ ml: 'auto', display: { xs: 'flex', sm: 'none' } }}>
            <IconButton
              aria-label="Otvori navigaciju"
              onClick={openMobileMenu}
              color="inherit"
              sx={{ color: 'secondary.main' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </BaseContainer>

      <Drawer anchor="right" open={isMobileMenuOpen} onClose={closeMobileMenu}>
        <Box sx={{ width: 280 }} role="presentation">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton aria-label="Zatvori navigaciju" onClick={closeMobileMenu}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            <ListItemButton onClick={() => navigateAndClose('/marketplace')}>
              <ListItemText primary="Marketplace" />
            </ListItemButton>

            {isAuthenticated && (
              <ListItemButton onClick={() => navigateAndClose('/moji-poslovi')}>
                <ListItemText primary="Moji Poslovi" />
              </ListItemButton>
            )}
          </List>

          <Divider />

          <List>
            {isAuthenticated ? (
              <>
                {user?.role === 'INVESTITOR' && (
                  <ListItemButton onClick={() => navigateAndClose('/objavi-posao')}>
                    <ListItemText primary="Objavi Posao" />
                  </ListItemButton>
                )}
                <ListItemButton
                  onClick={() => {
                    authenticationStore.logout();
                    navigateAndClose('/');
                  }}
                >
                  <ListItemText primary="Odjava" />
                </ListItemButton>
              </>
            ) : (
              <>
                <ListItemButton
                  onClick={() => {
                    authenticationStore.setLoginDialogOpen(true);
                    closeMobileMenu();
                  }}
                >
                  <ListItemText primary="Prijava" />
                </ListItemButton>
                <ListItemButton onClick={() => navigateAndClose('/register')}>
                  <ListItemText primary="Registracija" />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
});

export default Navbar;
