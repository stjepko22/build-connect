import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRootStore } from '@/core/hooks/useRootStore';
import AuthPageShell from '../components/AuthPageShell';
import Registration from '../components/Registration';

const RegistrationPage: React.FC = observer(() => {
  const { registrationStore } = useRootStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    registrationStore.initializeForm(true);
    const requestedRole = searchParams.get('role');

    if (requestedRole === 'INVESTITOR' || requestedRole === 'IZVODJAC') {
      registrationStore.setRole(requestedRole);
    }

    return () => registrationStore.clearFormState();
  }, [registrationStore, searchParams]);

  const handleBack = () => {
    if ((window.history.state?.idx ?? 0) > 0) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  const handleRegistrationSubmit = async () => {
    await registrationStore.submit();
  };

  return (
    <AuthPageShell onBack={handleBack}>
      <Registration
        registrationStore={registrationStore}
        onCustomSubmit={handleRegistrationSubmit}
        onGoToLogin={() => navigate('/login')}
      />
    </AuthPageShell>
  );
});

export default RegistrationPage;
