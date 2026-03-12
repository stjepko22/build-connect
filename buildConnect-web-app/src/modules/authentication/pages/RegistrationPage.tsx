import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import { useRootStore } from '@/core/hooks/useRootStore';
import Registration from '../components/Registration';

const RegistrationPage: React.FC = observer(() => {
  const { registrationStore } = useRootStore();
  const navigate = useNavigate();

  useEffect(() => {
    registrationStore.initializeForm(true);
    return () => registrationStore.clearFormState();
  }, [registrationStore]);

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

