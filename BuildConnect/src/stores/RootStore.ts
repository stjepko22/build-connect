import { createContext, useContext } from 'react';
import { makeAutoObservable } from 'mobx';
import { AuthenticationStore } from '@/modules/authentication/stores/AuthenticationStore';
import { JobStore } from '@/modules/marketplace/jobs/stores/JobStore';
import { BidStore } from '@/modules/marketplace/bids/stores/BidStore';
import { ReviewStore } from '@/modules/marketplace/reviews/stores/ReviewStore';

export class RootStore {
  authenticationStore: AuthenticationStore;
  jobStore: JobStore;
  bidStore: BidStore;
  reviewStore: ReviewStore;
  appTitle: string = "BuildConnect";

  constructor() {
    makeAutoObservable(this);
    this.authenticationStore = new AuthenticationStore(this);
    this.jobStore = new JobStore(this);
    this.bidStore = new BidStore(this);
    this.reviewStore = new ReviewStore(this);
    console.log("RootStore initialized with all modules");
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