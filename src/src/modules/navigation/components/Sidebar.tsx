import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useRootStore } from '@/core/hooks/useRootStore';
import { BRAND_COLORS } from '@/ui/themes/default/theme';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = observer(({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { authenticationStore } = useRootStore();
  const user = authenticationStore.user;

  const handleNav = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    authenticationStore.logout();
    navigate('/');
    if (onClose) onClose();
  };

  const handleAuthAction = () => {
    if (user) {
      handleLogout();
      return;
    }

    authenticationStore.setLoginDialogOpen(true);
    if (onClose) onClose();
  };

  const handleLogoClick = () => {
    navigate('/');
    if (onClose) onClose();
  };

  const menuItems = [
    { label: 'Marketplace', icon: <StorefrontIcon />, path: '/marketplace' },
    ...(user ? [{ label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' }] : []),
    ...(user?.role === 'INVESTITOR' ? [{ label: 'Izvodaci', icon: <EngineeringIcon />, path: '/izvodjaci' }] : []),
    ...(user ? [{ label: 'Moj Profil', icon: <AccountCircleIcon />, path: `/profil/${user.id}` }] : []),
  ];

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: BRAND_COLORS.darkSurface,
        color: 'common.white',
      }}
    >
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          background: BRAND_COLORS.heroGradient,
          borderBottom: '1px solid',
          borderColor: alpha(theme.palette.common.white, 0.08),
        }}
      >
        <Typography
          variant="h5"
          onClick={handleLogoClick}
          sx={{ fontWeight: 900, color: 'primary.main', mb: 0.5, cursor: 'pointer' }}
        >
          Build<Box component="span" sx={{ color: 'common.white' }}>Connect</Box>
        </Typography>
        <Typography
          sx={{
            fontSize: '0.65rem',
            fontWeight: 800,
            color: alpha(theme.palette.common.white, 0.7),
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Premium mreza za gradjevinu
        </Typography>
      </Box>

      <List sx={{ px: 2, mt: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNav(item.path)}
                sx={{
                  borderRadius: '12px',
                  bgcolor: active ? alpha(theme.palette.primary.main, 0.14) : 'transparent',
                  color: active ? 'primary.main' : alpha(theme.palette.common.white, 0.78),
                  border: '1px solid',
                  borderColor: active ? alpha(theme.palette.primary.main, 0.35) : 'transparent',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.18) },
                }}
              >
                <ListItemIcon sx={{ color: active ? 'primary.main' : 'inherit', minWidth: '40px' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: active ? 700 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.1) }} />

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleAuthAction}
          sx={{
            borderRadius: '12px',
            color: user ? 'error.light' : 'primary.main',
            border: '1px solid',
            borderColor: user ? alpha(theme.palette.error.main, 0.25) : alpha(theme.palette.primary.main, 0.35),
            '&:hover': { bgcolor: user ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.primary.main, 0.12) },
          }}
        >
          <ListItemIcon sx={{ color: user ? 'error.light' : 'primary.main', minWidth: '40px' }}>
            {user ? <LogoutIcon /> : <LoginIcon />}
          </ListItemIcon>
          <ListItemText primary={user ? 'Odjava' : 'Prijava'} primaryTypographyProps={{ fontWeight: 700 }} />
        </ListItemButton>
      </Box>
    </Box>
  );
});

export default Sidebar;
