import { createContext, useContext } from 'react';
import { makeAutoObservable } from 'mobx';
import { AuthenticationStore } from '@/modules/authentication/stores/AuthenticationStore';
import { JobStore } from '@/modules/marketplace/jobs/stores/JobStore';

export class RootStore {
  authenticationStore: AuthenticationStore;
  jobStore: JobStore;
  appTitle: string = "BuildConnect";

  constructor() {
    makeAutoObservable(this);
    this.authenticationStore = new AuthenticationStore(this);
    this.jobStore = new JobStore(this);
    console.log("RootStore initialized with JobStore sub-module");
  }
}

export const rootStore = new RootStore();
export const StoreContext = createContext(rootStore);

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used within a StoreProvider');
  return store;
};