import React from 'react';
import { 
  Paper, 
  BottomNavigation, 
  BottomNavigationAction, 
  useTheme, 
  useMediaQuery,
  Box
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRootStore } from '@/core/hooks/useRootStore';

const AppBottomNavigation: React.FC = observer(() => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { authenticationStore } = useRootStore();
  const user = authenticationStore.user;

  // Ako nije mobilni uređaj, ne renderiraj ništa
  if (!isMobile) return null;

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        borderRadius: 0,
        borderTop: '1px solid',
        borderColor: 'divider',
        // Moderni glassmorphism efekt
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }} 
      elevation={0}
    >
      <BottomNavigation
        showLabels
        value={location.pathname}
        onChange={handleChange}
        sx={{ 
          height: 70, // Nešto viši za lakši touch
          bgcolor: 'transparent',
          '& .Mui-selected': {
            color: 'secondary.main',
            '& .MuiSvgIcon-root': {
              transform: 'scale(1.2)',
              transition: 'transform 0.2s ease-in-out'
            }
          }
        }}
      >
        <BottomNavigationAction
          label="Market"
          value="/marketplace"
          icon={<StorefrontIcon />}
        />
        
        {user?.role === 'INVESTITOR' && (
          <BottomNavigationAction
            label="Objavi"
            value="/objavi-posao"
            icon={<AddCircleIcon sx={{ fontSize: '2rem', color: 'primary.main' }} />}
          />
        )}

        <BottomNavigationAction
          label="Dashboard"
          value="/dashboard"
          icon={<DashboardIcon />}
        />

        <BottomNavigationAction
          label="Profil"
          value={`/profil/${user?.id}`}
          icon={<AccountCircleIcon />}
        />
      </BottomNavigation>
      
      {/* Safe Area Inset za novije iPhone uređaje (Home Indicator) */}
      <Box sx={{ height: 'env(safe-area-inset-bottom)', bgcolor: 'transparent' }} />
    </Paper>
  );
});

export default AppBottomNavigation;
