import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import { useRootStore } from '@/core/hooks/useRootStore';
import OwnProfileEditor from '@/modules/user/components/OwnProfileEditor';

const EditProfilePage: React.FC = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticationStore, userStore } = useRootStore();
  const authenticatedUser = authenticationStore.user;
  const currentUser = authenticatedUser ? userStore.getUserById(authenticatedUser.id) : null;
  const navigationState = location.state as { returnTo?: string; returnLabel?: string } | null;
  const backTarget = navigationState?.returnTo || (authenticatedUser ? `/profil/${authenticatedUser.id}` : '/dashboard');
  const backLabel = navigationState?.returnLabel || 'Povratak na profil';

  useEffect(() => {
    if (!authenticatedUser) {
      return;
    }

    void userStore.loadUserById(authenticatedUser.id);
  }, [authenticatedUser, userStore]);

  useEffect(() => {
    if (currentUser) {
      userStore.initializeProfileForm(currentUser);
    }
  }, [currentUser, userStore]);

  if (!authenticatedUser) {
    return null;
  }

  if (userStore.isLoadingUsers && !currentUser) {
    return (
      <BaseContainer maxWidth="md" withPadding={false}>
        <Box sx={{ pt: 1, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Box>
      </BaseContainer>
    );
  }

  if (!currentUser) {
    return (
      <BaseContainer maxWidth="md" withPadding={false}>
        <Alert severity="error" sx={{ mt: 1, borderRadius: 3 }}>
          {userStore.selectedUserError || 'Vas profil nije dostupan za uredjivanje.'}
        </Alert>
      </BaseContainer>
    );
  }

  return (
    <BaseContainer maxWidth={false} disableGutters animate={false}>
      <BaseButton
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(backTarget)}
        sx={{ mb: 1.5, mt: 0.25, px: 0, fontWeight: 700 }}
      >
        {backLabel}
      </BaseButton>

      <Stack
        spacing={0.55}
        sx={{
          mb: 2.15,
          px: { md: 0.15, lg: 0.25 },
          py: { md: 0.35, lg: 0.45 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: 'secondary.main',
            letterSpacing: '-0.04em',
            lineHeight: 1.04,
            fontSize: { xs: '1.7rem', md: '2rem', lg: '2.2rem' },
          }}
        >
          Uredi profil
        </Typography>
        <Typography sx={{ color: 'text.secondary', maxWidth: 720, lineHeight: 1.6, fontSize: { xs: '0.92rem', md: '0.98rem' } }}>
          Azurirajte podatke koji se prikazuju na vasem profilu.
        </Typography>
      </Stack>

      <OwnProfileEditor
        onCancel={() => navigate(backTarget)}
        onSaved={() => navigate(backTarget)}
      />
    </BaseContainer>
  );
});

export default EditProfilePage;
