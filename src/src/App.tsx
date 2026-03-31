import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import theme from './ui/themes/default/theme';
import RootStoreContext from './core/context/RootStoreContext';
import RootStore from './core/stores/RootStore';
import { useRootStore } from './core/hooks/useRootStore';
import AppBottomNavigation from '@/modules/navigation/components/AppBottomNavigation';
import LoginView from '@/modules/authentication/components/LoginView';

const rootStore = new RootStore();
const MainLayout = React.lazy(() => import('@/ui/layout/MainLayout'));
const HomePage = React.lazy(() => import('@/modules/home/pages/HomePage'));
const JobListPage = React.lazy(() => import('@/modules/marketplace/jobs/pages/JobListPage'));
const JobDetailsPage = React.lazy(() => import('@/modules/marketplace/jobs/pages/JobDetailsPage'));
const ContractorDirectoryPage = React.lazy(() => import('@/modules/marketplace/contractors/pages/ContractorDirectoryPage'));
const ProfilePage = React.lazy(() => import('@/modules/user/pages/ProfilePage'));
const DashboardPage = React.lazy(() => import('@/modules/dashboard/pages/DashboardPage'));
const MyJobsPage = React.lazy(() => import('@/modules/marketplace/jobs/pages/MyJobsPage'));
const CreateJobPage = React.lazy(() => import('@/modules/marketplace/jobs/pages/CreateJobPage'));
const LoginPage = React.lazy(() => import('@/modules/authentication/pages/LoginPage'));
const RegistrationPage = React.lazy(() => import('@/modules/authentication/pages/RegistrationPage'));

type Role = 'INVESTITOR' | 'IZVODJAC';

interface RequireAuthProps {
  allowedRoles?: Role[];
}

const UnauthorizedLoginPromptHandler: React.FC = observer(() => {
  const location = useLocation();
  const { authenticationStore } = useRootStore();

  useEffect(() => {
    if (!authenticationStore.pendingUnauthorizedLoginPrompt) {
      return;
    }

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    if (!isAuthPage) {
      authenticationStore.setLoginDialogOpen(true);
    }

    authenticationStore.clearUnauthorizedLoginPrompt();
  }, [authenticationStore, location.pathname]);

  return null;
});

const RequireAuth: React.FC<RequireAuthProps> = observer(({ allowedRoles }) => {
  const { authenticationStore } = useRootStore();
  const user = authenticationStore.user;

  if (!user) {
    if (authenticationStore.pendingUnauthorizedLoginPrompt) {
      return <Navigate to="/" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/marketplace" replace />;
  }

  return <Outlet />;
});

const App: React.FC = () => {
  const loadingFallback = (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );

  return (
    <RootStoreContext.Provider value={rootStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <UnauthorizedLoginPromptHandler />
          <Suspense fallback={loadingFallback}>
            <>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/marketplace" element={<JobListPage />} />
                  <Route path="/marketplace/:id" element={<JobDetailsPage />} />
                  <Route path="/izvodjaci" element={<ContractorDirectoryPage />} />
                  <Route path="/posao/:id" element={<JobDetailsPage />} />
                  <Route path="/profil/:id" element={<ProfilePage />} />

                  <Route element={<RequireAuth />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/moji-poslovi" element={<MyJobsPage />} />
                  </Route>

                  <Route element={<RequireAuth allowedRoles={['INVESTITOR']} />}>
                    <Route path="/objavi-posao" element={<CreateJobPage />} />
                  </Route>
                </Route>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <AppBottomNavigation />
              <LoginView />
            </>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </RootStoreContext.Provider>
  );
};

export default App;

