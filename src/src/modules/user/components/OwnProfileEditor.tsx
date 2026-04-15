import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Alert,
  Box,
  Chip,
  MenuItem,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import { useRootStore } from '@/core/hooks/useRootStore';

interface OwnProfileEditorProps {
  onCancel: () => void;
  onSaved: () => void;
}

const OwnProfileEditor: React.FC<OwnProfileEditorProps> = observer(({ onCancel, onSaved }) => {
  const theme = useTheme();
  const { authenticationStore, userStore } = useRootStore();
  const userRole = authenticationStore.user?.role;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const isSaved = await userStore.submitCurrentUserProfile();
    if (isSaved) {
      onSaved();
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        mt: 0,
        borderRadius: 4,
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.12),
        bgcolor: alpha(theme.palette.primary.light, 0.08),
      }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
          {userStore.profileSaveError && (
            <Alert severity="error" sx={{ borderRadius: 3 }}>
              {userStore.profileSaveError}
            </Alert>
          )}

          <BaseInput
            label="Ime i prezime / naziv"
            value={userStore.profileDisplayName}
            onChange={(event) => userStore.setProfileDisplayName(event.target.value)}
            required
          />

          <BaseInput
            select
            label="Tip korisnika"
            value={userStore.profileLegalType}
            onChange={(event) => userStore.setProfileLegalType(event.target.value as 'FIZICKA_OSOBA' | 'FIRMA')}
            required
          >
            <MenuItem value="FIZICKA_OSOBA">Fizicka osoba</MenuItem>
            <MenuItem value="FIRMA">Firma</MenuItem>
          </BaseInput>

          <BaseInput
            label="Lokacija"
            value={userStore.profileLocation}
            onChange={(event) => userStore.setProfileLocation(event.target.value)}
            required
          />

          <BaseInput
            label="Biografija"
            value={userStore.profileBio}
            onChange={(event) => userStore.setProfileBio(event.target.value)}
            multiline
            rows={4}
            required
            helperText="Opis treba imati barem 10 znakova."
          />

          {userRole === 'IZVODJAC' && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.secondary', mb: 1.25 }}>
                Usluge
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {userStore.availableServiceCategories.map((category) => {
                  const isSelected = userStore.profileServiceCategories.includes(category);
                  return (
                    <Chip
                      key={category}
                      clickable
                      label={category}
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      onClick={() => userStore.toggleProfileServiceCategory(category)}
                      sx={{ fontWeight: 700 }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <BaseButton
              type="submit"
              variant="contained"
              color="primary"
              loading={userStore.isSavingProfile}
              disabled={!userStore.isProfileFormValid}
            >
              Spremi promjene
            </BaseButton>
            <BaseButton
              type="button"
              variant="outlined"
              color="secondary"
              onClick={() => {
                userStore.resetProfileForm();
                onCancel();
              }}
            >
              Odustani
            </BaseButton>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
});

export default OwnProfileEditor;
