import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import { useRootStore } from '@/core/hooks/useRootStore';
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

  const handleRegistrationSubmit = async () => {
    const success = await registrationStore.submit();
    if (success) {
      navigate('/');
    }
  };

  return (
    <BaseContainer maxWidth="xs" withPadding={true} animate={true}>
      <Registration
        registrationStore={registrationStore}
        onCustomSubmit={handleRegistrationSubmit}
      />
    </BaseContainer>
  );
});

export default RegistrationPage;

