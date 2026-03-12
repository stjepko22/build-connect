import { makeAutoObservable, runInAction } from 'mobx';
import RootStore from '@/core/stores/RootStore';
import { IBid } from '@/modules/marketplace/bids/models/IBid';

export default class BidStore {
  rootStore: RootStore;
  bids: IBid[] = [];
  isLoading: boolean = false;
  bidAmount = '';
  bidDaysToComplete = '';
  bidMessage = '';
  bidError: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  private validateBidInput(
    bidData: Omit<IBid, 'id' | 'createdAt' | 'contractorId' | 'contractorName' | 'status'>
  ): string | null {
    const user = this.rootStore.authenticationStore.user;

    if (!user) return 'Morate biti prijavljeni za slanje ponude.';
    if (user.role !== 'IZVODJAC') return 'Samo izvođači mogu slati ponude.';

    if (!Number.isFinite(bidData.amount) || bidData.amount <= 0) {
      return 'Iznos ponude mora biti veći od 0.';
    }

    if (!Number.isFinite(bidData.daysToComplete) || bidData.daysToComplete <= 0) {
      return 'Rok izvedbe mora biti veći od 0 dana.';
    }

    if (bidData.message.trim().length < 10) {
      return 'Poruka ponude mora imati barem 10 znakova.';
    }

    const existingBid = this.bids.find(
      (bid) =>
        bid.jobId === bidData.jobId &&
        bid.contractorId === user.id &&
        bid.status !== 'REJECTED'
    );

    if (existingBid) {
      return 'Već imate aktivnu ponudu za ovaj posao.';
    }

    const alreadyAccepted = this.bids.some(
      (bid) => bid.jobId === bidData.jobId && bid.status === 'ACCEPTED'
    );

    if (alreadyAccepted) {
      return 'Za ovaj posao je već odabrana ponuda.';
    }

    return null;
  }

  addBid = async (bidData: Omit<IBid, 'id' | 'createdAt' | 'contractorId' | 'contractorName' | 'status'>) => {
    const validationError = this.validateBidInput(bidData);
    if (validationError) {
      throw new Error(validationError);
    }

    this.isLoading = true;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const user = this.rootStore.authenticationStore.user!;
        const newBid: IBid = {
          ...bidData,
          id: Math.random().toString(36).substring(2, 9),
          contractorId: user.id,
          contractorName: user.displayName,
          status: 'PENDING',
          createdAt: new Date(),
        };
        
        runInAction(() => {
          this.bids.push(newBid);
          this.isLoading = false;
        });
        resolve();
      }, 800);
    });
  };

  setBidAmount = (value: string) => { this.bidAmount = value; };
  setBidDaysToComplete = (value: string) => { this.bidDaysToComplete = value; };
  setBidMessage = (value: string) => { this.bidMessage = value; };
  setBidError = (value: string | null) => { this.bidError = value; };

  resetBidForm = () => {
    this.bidAmount = '';
    this.bidDaysToComplete = '';
    this.bidMessage = '';
    this.bidError = null;
  };

  get isBidFormValid() {
    return (
      Number.isFinite(Number(this.bidAmount)) &&
      Number(this.bidAmount) > 0 &&
      Number.isFinite(Number(this.bidDaysToComplete)) &&
      Number(this.bidDaysToComplete) > 0 &&
      this.bidMessage.trim().length >= 10
    );
  }

  submitBidForJob = async (jobId: string) => {
    this.setBidError(null);
    try {
      await this.addBid({
        jobId,
        amount: Number(this.bidAmount),
        daysToComplete: Number(this.bidDaysToComplete),
        message: this.bidMessage,
      });
      this.resetBidForm();
      return true;
    } catch (error) {
      this.setBidError(error instanceof Error ? error.message : 'Slanje ponude nije uspjelo.');
      return false;
    }
  };

  acceptBid = async (bidId: string) => {
    this.isLoading = true;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        runInAction(() => {
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
        });
        resolve();
      }, 500);
    });
  };

  getBidsByJobId(jobId: string) {
    return this.bids.filter(bid => bid.jobId === jobId);
  }
}


