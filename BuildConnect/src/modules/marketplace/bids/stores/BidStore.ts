import { makeAutoObservable } from 'mobx';
import { RootStore } from '@/stores/RootStore';

export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Bid {
  id: string;
  jobId: string;
  contractorId: string;
  contractorName: string;
  amount: number;
  daysToComplete: number;
  message: string;
  status: BidStatus; // Novi field
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

  addBid = async (bidData: Omit<Bid, 'id' | 'createdAt' | 'contractorId' | 'contractorName' | 'status'>) => {
    this.isLoading = true;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newBid: Bid = {
          ...bidData,
          id: Math.random().toString(36).substring(2, 9),
          contractorId: this.rootStore.authenticationStore.user?.id || 'unknown',
          contractorName: this.rootStore.authenticationStore.user?.displayName || 'Anonimni Izvođač',
          status: 'PENDING',
          createdAt: new Date(),
        };
        
        this.bids.push(newBid);
        this.isLoading = false;
        resolve();
      }, 800);
    });
  };

  acceptBid = async (bidId: string) => {
    this.isLoading = true;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const bid = this.bids.find(b => b.id === bidId);
        if (bid) {
          // Odbij sve ostale ponude za taj posao
          this.bids.forEach(b => {
            if (b.jobId === bid.jobId && b.id !== bidId) {
              b.status = 'REJECTED';
            }
          });
          // Prihvati odabranu
          bid.status = 'ACCEPTED';
        }
        this.isLoading = false;
        resolve();
      }, 500);
    });
  };

  getBidsByJobId(jobId: string) {
    return this.bids.filter(bid => bid.jobId === jobId);
  }
}