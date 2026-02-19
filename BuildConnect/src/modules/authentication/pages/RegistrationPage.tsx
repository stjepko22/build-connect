import { observer } from 'mobx-react-lite';
import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseContainer from '@/components/common/atoms/containers/BaseContainer';
import { useRootStore } from '@/hooks/useRootStore';
import Registration from '../components/Registration';
import RegistrationStore from '../stores/RegistrationStore';

const RegistrationPage: React.FC = observer(() => {
  const rootStore = useRootStore();
  const navigate = useNavigate();

  const registrationStore = useMemo(() => new RegistrationStore(rootStore), [rootStore]);

  useEffect(() => {
    registrationStore.initializeForm(true);
    return () => registrationStore.clearFormState();
  }, [registrationStore]);

  const handleRegistrationSubmit = async () => {
    const success = await registrationStore.submit();
    if (success) {
      // Budući da AuthenticationStore.register postavlja korisnika, 
      // aplikacija će automatski prepoznati da je prijavljen.
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