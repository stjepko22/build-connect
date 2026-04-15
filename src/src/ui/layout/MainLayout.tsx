import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Drawer, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useRootStore } from '@/core/hooks/useRootStore';
import Sidebar from '@/modules/navigation/components/Sidebar';

const DRAWER_WIDTH = 260;

const MainLayout: React.FC = observer(() => {
  const { navigationStore, authenticationStore, jobStore, bidStore, reviewStore, userStore } = useRootStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isDashboardPage = location.pathname === '/dashboard';
  const previousUserIdRef = useRef<string | null>(authenticationStore.user?.id ?? null);

  useEffect(() => {
    const currentUserId = authenticationStore.user?.id ?? null;
    if (previousUserIdRef.current && !currentUserId) {
      navigate('/');
    }
    previousUserIdRef.current = currentUserId;
  }, [authenticationStore.user, navigate]);

  useEffect(() => {
    const user = authenticationStore.user;
    if (!user || !isDashboardPage) {
      return;
    }

    void jobStore.loadJobs();

    if (user.role === 'IZVODJAC') {
      void bidStore.loadBids(undefined, user.id);
      void reviewStore.loadReviews(undefined, user.id);
      void userStore.loadContractors();
      return;
    }

    void bidStore.loadBids();
    void reviewStore.loadReviews();
    void userStore.loadContractors();
  }, [authenticationStore.user, bidStore, isDashboardPage, jobStore, reviewStore, userStore]);

  const handleDrawerToggle = () => {
    navigationStore.toggleMobileSidebar();
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          maxWidth: '100vw',
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: { xs: 'flex', md: 'none' },
        }}
      >
        <Toolbar sx={{ position: 'relative', justifyContent: 'flex-start' }}>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ display: { md: 'none' }, zIndex: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            onClick={handleLogoClick}
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontWeight: 800,
              color: 'primary.main',
              cursor: 'pointer',
              textAlign: 'center',
              maxWidth: 'calc(100% - 96px)',
            }}
          >
            Build
            <Box component="span" sx={{ color: 'secondary.main' }}>
              Connect
            </Box>
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={navigationStore.isMobileSidebarOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          <Sidebar onClose={handleDrawerToggle} />
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isLandingPage ? 0 : { xs: 2, sm: 3 },
          minWidth: 0,
          maxWidth: '100%',
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: { xs: '64px', md: 0 },
          mb: { xs: '80px', md: 0 },
          bgcolor: 'background.default',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </Box>

    </Box>
  );
});

export default MainLayout;
