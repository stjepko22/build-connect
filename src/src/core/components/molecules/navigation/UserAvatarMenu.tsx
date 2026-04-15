import React, { useState } from 'react';
import { 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  Typography, 
  Divider, 
  IconButton, 
  Tooltip,
  alpha,
  Box 
} from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/core/hooks/useRootStore';

const UserAvatarMenu: React.FC = observer(() => {
  const { authenticationStore } = useRootStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const user = authenticationStore.user;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    authenticationStore.logout();
    navigate('/');
  };

  const handleProfile = () => {
    handleClose();
    if (!user) return;
    navigate(`/profil/${user.id}`);
  };

  if (!user) return null;

  const initial = user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U';

  return (
    <React.Fragment>
      <Tooltip title="Postavke računa">
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{ 
            p: 0.5,
            border: '2px solid',
            borderColor: open ? 'primary.main' : 'transparent',
            transition: '0.2s'
          }}
        >
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: 'secondary.main', 
              color: 'primary.main',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}
          >
            {initial}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        // ISPRAVLJENO: Umjesto PaperProps koristimo slotProps.paper
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              mt: 1.5,
              borderRadius: 3,
              minWidth: 200,
              border: '1px solid',
              borderColor: 'divider',
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {user.displayName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.role} • {user.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfile} sx={{ py: 1.2 }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Moj Profil
        </MenuItem>
        <MenuItem onClick={() => navigate('/moji-poslovi')} sx={{ py: 1.2 }}>
          <ListItemIcon>
            <WorkOutlineIcon fontSize="small" />
          </ListItemIcon>
          Moji poslovi
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={handleLogout} 
          sx={{ 
            py: 1.2, 
            color: 'error.main',
            '&:hover': { bgcolor: alpha('#f44336', 0.04) } 
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          Odjava
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
});

export default UserAvatarMenu;

