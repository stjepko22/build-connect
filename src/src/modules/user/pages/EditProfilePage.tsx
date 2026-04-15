import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import { useRootStore } from '@/core/hooks/useRootStore';
import OwnProfileEditor from '@/modules/user/components/OwnProfileEditor';

const EditProfilePage: React.FC = observer(() => {
  const navigate = useNavigate();
  const { authenticationStore, userStore } = useRootStore();
  const authenticatedUser = authenticationStore.user;
  const currentUser = authenticatedUser ? userStore.getUserById(authenticatedUser.id) : null;

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
    <BaseContainer maxWidth="md" withPadding={false}>
      <BaseButton
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/profil/${authenticatedUser.id}`)}
        sx={{ mb: 1.5, mt: 0.25, px: 0, fontWeight: 700 }}
      >
        Povratak na profil
      </BaseButton>

      <Stack spacing={0.75} sx={{ mb: 1.5 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: 'secondary.main', letterSpacing: '-1px' }}>
          Uredi profil
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Azurirajte javne podatke koje vide drugi korisnici.
        </Typography>
      </Stack>

      <OwnProfileEditor
        onCancel={() => navigate(`/profil/${authenticatedUser.id}`)}
        onSaved={() => navigate(`/profil/${authenticatedUser.id}`)}
      />
    </BaseContainer>
  );
});

export default EditProfilePage;
