import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import theme from './ui/themes/default/theme';
import RootStoreContext from './core/context/RootStoreContext';
import RootStore from './core/stores/RootStore';
import { useRootStore } from './core/hooks/useRootStore';

const rootStore = new RootStore();
const MainLayout = React.lazy(() => import('@/ui/layout/MainLayout'));
const LandingPage = React.lazy(() => import('@/modules/landing/pages/LandingPage'));
const JobListPage = React.lazy(() => import('@/modules/marketplace/jobs/pages/JobListPage'));
const JobDetailsPage = React.lazy(() => import('@/modules/marketplace/jobs/pages/JobDetailsPage'));
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

const RequireAuth: React.FC<RequireAuthProps> = observer(({ allowedRoles }) => {
  const { authenticationStore } = useRootStore();
  const user = authenticationStore.user;

  if (!user) {
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
          <Suspense fallback={loadingFallback}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/marketplace" element={<JobListPage />} />
                <Route path="/marketplace/:id" element={<JobDetailsPage />} />
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
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </RootStoreContext.Provider>
  );
};

export default App;

