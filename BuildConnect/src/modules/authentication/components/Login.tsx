import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import { Box, Grid, MenuItem, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import BaseLoadingButton from '../../../components/common/atoms/buttons/BaseLoadingButton';
import BaseInput from '../../../components/common/atoms/inputs/BaseInput';
import AuthenticationStore from '../stores/AuthenticationStore';

interface LoginProps {
  authenticationStore: AuthenticationStore;
  onSuccess?: () => void;
}

const Login: React.FC<LoginProps> = observer(({ authenticationStore, onSuccess }) => {
  const auth = authenticationStore;

  // Jednostavna validacija emaila
  const isEmailFormatValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const emailError = auth.loginEmail.length > 0 && !isEmailFormatValid(auth.loginEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth.isLoginFormValid && !emailError) {
      await auth.login();
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ width: '100%' }}
      >
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: 'primary.main', letterSpacing: '-1px' }}>
          Prijavite se
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4, textAlign: 'center' }}>
          Molimo prijavite se kako biste nastavili.
        </Typography>

        <Box sx={{ width: '100%', display: "flex", flexDirection: "column", gap: 3, mb: 4 }}>
          <BaseInput
            select
            label="Prijavi me kao"
            value={auth.loginRole}
            onChange={(e) => auth.setLoginRole(e.target.value as 'INVESTITOR' | 'IZVODJAC')}
            fullWidth
          >
            <MenuItem value="INVESTITOR">Investitor (Tražim majstore)</MenuItem>
            <MenuItem value="IZVODJAC">Izvođač (Tražim posao)</MenuItem>
          </BaseInput>

          <BaseInput
            label="Email adresa"
            type="email"
            fullWidth
            value={auth.loginEmail}
            onChange={(e) => auth.setLoginEmail(e.target.value)}
            required
            error={emailError}
            helperText={emailError ? "Unesite ispravnu email adresu (npr. ime@domena.com)" : ""}
            slotProps={{
              input: {
                startAdornment: <EmailIcon sx={{ mr: 1, color: emailError ? 'error.main' : 'text.disabled', fontSize: 20 }} />,
              },
            }}
          />

          <BaseInput
            label="Lozinka"
            type="password"
            fullWidth
            value={auth.loginPassword}
            onChange={(e) => auth.setLoginPassword(e.target.value)}
            required
            slotProps={{
              input: {
                startAdornment: <KeyIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} />,
              },
            }}
          />
        </Box>

        <BaseLoadingButton
          title="Prijavi se"
          variant="contained"
          fullWidth
          size="large"
          isLoading={auth.isLoading}
          disabled={auth.isLoading || !auth.isLoginFormValid || emailError}
          type="submit"
          sx={{ py: 1.8, borderRadius: 3, fontWeight: 800 }}
        />
      </Grid>
    </form>
  );
});

export default Login;