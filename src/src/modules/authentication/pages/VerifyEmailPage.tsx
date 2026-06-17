import React, { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import ErrorOutlineTwoToneIcon from '@mui/icons-material/ErrorOutlineTwoTone';
import { observer } from 'mobx-react-lite';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import { useRootStore } from '@/core/hooks/useRootStore';
import AuthPageShell from '../components/AuthPageShell';

type VerificationState = 'loading' | 'success' | 'error';

const VerifyEmailPage: React.FC = observer(() => {
  const { authenticationStore } = useRootStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationState, setVerificationState] = useState<VerificationState>('loading');
  const email = searchParams.get('email') || '';

  useEffect(() => {
    const token = searchParams.get('token') || '';

    if (!email.trim() || !token.trim()) {
      authenticationStore.setAuthError('Verifikacijski link nije potpun.');
      setVerificationState('error');
      return;
    }

    void authenticationStore.verifyEmail(email, token).then((isVerified) => {
      setVerificationState(isVerified ? 'success' : 'error');
    });
  }, [authenticationStore, email, searchParams]);

  const handleBack = () => {
    if ((window.history.state?.idx ?? 0) > 0) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  const handleResendVerificationEmail = () => {
    void authenticationStore.resendVerificationEmail(email);
  };

  const isLoading = verificationState === 'loading';
  const isSuccess = verificationState === 'success';
  const canResendVerificationEmail = !isLoading && !isSuccess && email.trim().length > 0;

  return (
    <AuthPageShell onBack={handleBack}>
      <Stack spacing={2.5} sx={{ width: '100%', textAlign: 'center' }}>
        {isLoading && <CircularProgress color="primary" sx={{ mx: 'auto' }} />}
        {isSuccess && <CheckCircleTwoToneIcon sx={{ mx: 'auto', color: 'success.main', fontSize: 58 }} />}
        {!isLoading && !isSuccess && <ErrorOutlineTwoToneIcon sx={{ mx: 'auto', color: 'error.main', fontSize: 58 }} />}

        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'secondary.main' }}>
            {isLoading ? 'Potvrđujemo email' : isSuccess ? 'Email je potvrđen' : 'Potvrda nije uspjela'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
            {isLoading
              ? 'Molimo pričekajte trenutak.'
              : isSuccess
                ? 'Sada se možete prijaviti svojim podacima.'
                : 'Link je možda istekao ili nije ispravan.'}
          </Typography>
        </Box>

        {!isLoading && !isSuccess && authenticationStore.authError && (
          <Alert severity="error" sx={{ borderRadius: 3, textAlign: 'left' }}>
            {authenticationStore.authError}
          </Alert>
        )}

        {authenticationStore.authInfoMessage && (
          <Alert severity="success" sx={{ borderRadius: 3, textAlign: 'left' }}>
            {authenticationStore.authInfoMessage}
          </Alert>
        )}

        {canResendVerificationEmail && (
          <BaseButton
            variant="outlined"
            color="secondary"
            fullWidth
            loading={authenticationStore.isLoading}
            onClick={handleResendVerificationEmail}
          >
            Pošalji novi link
          </BaseButton>
        )}

        {!isLoading && (
          <BaseButton variant="contained" color="primary" fullWidth onClick={() => navigate('/login')}>
            Idi na prijavu
          </BaseButton>
        )}
      </Stack>
    </AuthPageShell>
  );
});

export default VerifyEmailPage;
