import { makeAutoObservable } from 'mobx';
import { RootStore } from '@/stores/RootStore';

export interface Bid {
  id: string;
  jobId: string;
  contractorId: string;
  contractorName: string;
  amount: number;
  daysToComplete: number;
  message: string;
  createdAt: Date;
}

export class BidStore {
  rootStore: RootStore;
  bids: Bid[] = [];
  isLoading: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  addBid = async (bidData: Omit<Bid, 'id' | 'createdAt' | 'contractorId' | 'contractorName'>) => {
    this.isLoading = true;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newBid: Bid = {
          ...bidData,
          id: Math.random().toString(36).substring(2, 9),
          contractorId: this.rootStore.authenticationStore.user?.id || 'unknown',
          contractorName: this.rootStore.authenticationStore.user?.displayName || 'Anonimni Izvođač',
          createdAt: new Date(),
        };
        
        this.bids.push(newBid);
        this.isLoading = false;
        console.log("Nova ponuda dodana:", newBid);
        resolve();
      }, 800);
    });
  };

  getBidsByJobId(jobId: string) {
    return this.bids.filter(bid => bid.jobId === jobId);
  }
}