import React from 'react';
import { observer } from 'mobx-react-lite';
import { Alert, Box, MenuItem, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import RegistrationStore from '../stores/RegistrationStore';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import BaseLoadingButton from '@/core/components/atoms/buttons/BaseLoadingButton';

import KeyTwoToneIcon from '@mui/icons-material/KeyTwoTone';
import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';

interface RegistrationProps {
  registrationStore: RegistrationStore;
  onCustomSubmit: () => void;
}

const Registration: React.FC<RegistrationProps> = observer(({ registrationStore, onCustomSubmit }) => {
  const { isLoading, isFormValid } = registrationStore;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCustomSubmit();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      gap={{ xs: 2, sm: 2.5 }}
      width="100%"
    >
      <Box textAlign="center">
        <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: '-1px' }}>
          Kreiraj svoj racun
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Pridruzi se nasoj zajednici majstora i investitora.
        </Typography>
      </Box>

      <Box>
        <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.7, display: 'block', color: 'text.secondary', ml: 0.5 }}>
          Registriram se kao:
        </Typography>
        <ToggleButtonGroup
          color="primary"
          value={registrationStore.role}
          exclusive
          onChange={(_, val) => val && registrationStore.setRole(val)}
          fullWidth
        >
          <ToggleButton value="INVESTITOR" sx={{ fontWeight: 700, textTransform: 'none' }}>
            Investitor
          </ToggleButton>
          <ToggleButton value="IZVODJAC" sx={{ fontWeight: 700, textTransform: 'none' }}>
            Izvodjac
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {registrationStore.role === 'IZVODJAC' && (
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.7, display: 'block', color: 'text.secondary', ml: 0.5 }}>
            Vrsta izvodjaca:
          </Typography>
          <BaseInput
            select
            fullWidth
            value={registrationStore.legalType}
            onChange={(e) => registrationStore.setLegalType(e.target.value as 'FIZICKA_OSOBA' | 'FIRMA')}
          >
            <MenuItem value="FIRMA">Tvrtka/obrt</MenuItem>
            <MenuItem value="FIZICKA_OSOBA">Fizicka osoba</MenuItem>
          </BaseInput>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <BaseInput
          label="Ime"
          value={registrationStore.firstName}
          onChange={(e) => registrationStore.setFirstName(e.target.value)}
          sx={{ flex: 1 }}
          slotProps={{ input: { startAdornment: <PersonTwoToneIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> } }}
        />
        <BaseInput
          label="Prezime"
          value={registrationStore.lastName}
          onChange={(e) => registrationStore.setLastName(e.target.value)}
          sx={{ flex: 1 }}
        />
      </Box>

      <BaseInput
        label="Email adresa"
        type="email"
        value={registrationStore.email}
        onChange={(e) => registrationStore.setEmail(e.target.value)}
        slotProps={{ input: { startAdornment: <EmailTwoToneIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> } }}
      />

      <BaseInput
        label="Broj telefona"
        value={registrationStore.phone}
        onChange={(e) => registrationStore.setPhone(e.target.value)}
        required
        helperText="Obavezno. Broj treba imati barem 6 znakova."
        slotProps={{ input: { startAdornment: <PhoneTwoToneIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> } }}
      />

      <BaseInput
        label="Lozinka"
        type="password"
        value={registrationStore.password}
        onChange={(e) => registrationStore.setPassword(e.target.value)}
        slotProps={{ input: { startAdornment: <KeyTwoToneIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> } }}
      />

      {registrationStore.submitError && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {registrationStore.submitError}
        </Alert>
      )}

      <BaseLoadingButton
        title="Registriraj se"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        isLoading={isLoading}
        disabled={isLoading || !isFormValid}
        type="submit"
        sx={{ py: 1.45, mt: 0.35, borderRadius: 3, fontWeight: 800 }}
      />
    </Box>
  );
});

export default Registration;
