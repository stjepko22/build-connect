import { createContext, useContext } from 'react';
import { makeAutoObservable } from 'mobx';
import { AuthenticationStore } from '@/modules/authentication/stores/AuthenticationStore';

export class RootStore {
  authenticationStore: AuthenticationStore;
  appTitle: string = "BuildConnect";

  constructor() {
    makeAutoObservable(this);
    // Povezivanje modula s root-om
    this.authenticationStore = new AuthenticationStore(this);
    console.log("RootStore & AuthStore initialized");
  }

  setAppTitle(newTitle: string) {
    this.appTitle = newTitle;
  }
}

export const rootStore = new RootStore();
export const StoreContext = createContext(rootStore);

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};