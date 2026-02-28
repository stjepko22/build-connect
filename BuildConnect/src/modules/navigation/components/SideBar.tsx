import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, alpha, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRootStore } from '@/core/hooks/useRootStore';

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

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Marketplace', icon: <StorefrontIcon />, path: '/marketplace' },
    { label: 'Moj Profil', icon: <AccountCircleIcon />, path: `/profil/${user?.id}` },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main', mb: 0.5 }}>
          Build<Box component="span" sx={{ color: 'secondary.main' }}>Connect</Box>
        </Typography>
        <Typography 
          sx={{ 
            fontSize: '0.65rem', 
            fontWeight: 800, 
            color: 'text.secondary', 
            textTransform: 'uppercase', 
            letterSpacing: 1 
          }}
        >
          LinkedIn za građevinu
        </Typography>
      </Box>
      
      <Divider />

      <List sx={{ px: 2, mt: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNav(item.path)}
                sx={{
                  borderRadius: '12px',
                  bgcolor: active ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  color: active ? 'primary.main' : 'text.secondary',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) }
                }}
              >
                <ListItemIcon sx={{ color: active ? 'primary.main' : 'inherit', minWidth: '40px' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: active ? 700 : 500 }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <ListItemButton 
          onClick={() => authenticationStore.logout()}
          sx={{ borderRadius: '12px', color: 'error.main' }}
        >
          <ListItemIcon sx={{ color: 'error.main', minWidth: '40px' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Odjava" primaryTypographyProps={{ fontWeight: 700 }} />
        </ListItemButton>
      </Box>
    </Box>
  );
});

export default Sidebar;


