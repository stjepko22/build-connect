import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';

// Store
import RegistrationStore from '../stores/RegistrationStore';

// Atomi
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import BaseLoadingButton from '@/core/components/atoms/buttons/BaseLoadingButton';

// Ikone
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
      display={"flex"} 
      flexDirection={"column"} 
      gap={3} 
      width={"100%"}
    >
      <Box textAlign="center">
        <Typography variant='h4' sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: '-1px' }}>
          Kreiraj svoj račun
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Pridružite se našoj zajednici majstora i investitora.
        </Typography>
      </Box>

      <Box>
        <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block', color: 'text.secondary', ml: 0.5 }}>
          Registriram se kao:
        </Typography>
        <ToggleButtonGroup
          color="primary"
          value={registrationStore.role}
          exclusive
          onChange={(_, val) => val && registrationStore.setRole(val)}
          fullWidth
        >
          <ToggleButton value="INVESTITOR" sx={{ fontWeight: 700, textTransform: 'none' }}>Investitor</ToggleButton>
          <ToggleButton value="IZVODJAC" sx={{ fontWeight: 700, textTransform: 'none' }}>Izvođač</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {registrationStore.role === 'IZVODJAC' && (
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block', color: 'text.secondary', ml: 0.5 }}>
            Tip izvođača:
          </Typography>
          <ToggleButtonGroup
            color="primary"
            value={registrationStore.legalType}
            exclusive
            onChange={(_, val) => val && registrationStore.setLegalType(val)}
            fullWidth
          >
            <ToggleButton value="FIZICKA_OSOBA" sx={{ fontWeight: 700, textTransform: 'none' }}>Fizička osoba</ToggleButton>
            <ToggleButton value="FIRMA" sx={{ fontWeight: 700, textTransform: 'none' }}>Firma</ToggleButton>
          </ToggleButtonGroup>
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
        slotProps={{ input: { startAdornment: <PhoneTwoToneIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> } }}
      />

      <BaseInput 
        label="Lozinka"
        type="password"
        value={registrationStore.password}
        onChange={(e) => registrationStore.setPassword(e.target.value)}
        slotProps={{ input: { startAdornment: <KeyTwoToneIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> } }}
      />

      <BaseLoadingButton
        title="Registriraj se"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        isLoading={isLoading}
        disabled={isLoading || !isFormValid}
        type="submit"
        sx={{ py: 1.8, mt: 1, borderRadius: 3, fontWeight: 800 }}
      />
    </Box>
  );
});

export default Registration;



