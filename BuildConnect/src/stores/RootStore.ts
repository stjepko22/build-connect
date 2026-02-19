import { createContext, useContext } from 'react';
import { makeAutoObservable } from 'mobx';
import { AuthenticationStore } from '@/modules/authentication/stores/AuthenticationStore';
import { JobStore } from '@/modules/marketplace/jobs/stores/JobStore';
import { BidStore } from '@/modules/marketplace/bids/stores/BidStore';

export class RootStore {
  authenticationStore: AuthenticationStore;
  jobStore: JobStore;
  bidStore: BidStore;
  appTitle: string = "BuildConnect";

  constructor() {
    makeAutoObservable(this);
    this.authenticationStore = new AuthenticationStore(this);
    this.jobStore = new JobStore(this);
    this.bidStore = new BidStore(this);
    console.log("RootStore initialized with Auth, Job and Bid stores");
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