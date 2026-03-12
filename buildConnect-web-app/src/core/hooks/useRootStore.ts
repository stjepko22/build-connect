import RootStoreContext from '@/core/context/RootStoreContext';
import { useContext } from 'react';

export const useRootStore = () => {
  const rootStore = useContext(RootStoreContext);

  if (!rootStore) {
    throw new Error('useRootStore must be used within RootStoreContext.Provider');
  }

  return rootStore;
};

