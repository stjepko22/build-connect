import { AxiosError } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { IBidResponse } from '@/api/models/bids/IBidResponse';
import RootStore from '@/core/stores/RootStore';
import { IBid } from '@/modules/marketplace/bids/models/IBid';
import BidService from '@/modules/marketplace/bids/services/BidService';

export default class BidStore {
  rootStore: RootStore;
  bidService: BidService;
  bids: IBid[] = [];
  isLoading = false;
  isLoadingBids = false;
  bidAmount = '';
  bidDaysToComplete = '';
  bidMessage = '';
  bidError: string | null = null;
  bidListError: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.bidService = new BidService();
    makeAutoObservable(this);
  }

  loadBids = async (jobId?: string, contractorId?: string) => {
    this.isLoadingBids = true;
    this.bidListError = null;

    try {
      const response = await this.bidService.getBidsAsync({
        jobId,
        contractorId,
      });

      runInAction(() => {
        this.replaceBids(
          response.data.map(this.mapBidResponseToModel),
          jobId,
          contractorId
        );
      });
    } catch (error) {
      console.error('Load bids failed:', error);
      runInAction(() => {
        this.bidListError = this.getApiErrorMessage(error, 'Dohvat ponuda nije uspio.');
      });
    } finally {
      runInAction(() => {
        this.isLoadingBids = false;
      });
    }
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
    const user = this.rootStore.authenticationStore.user;

    if (!user) {
      this.setBidError('Morate biti prijavljeni za slanje ponude.');
      return false;
    }

    this.isLoading = true;

    try {
      const response = await this.bidService.createBidAsync(
        jobId,
        {
          amount: Number(this.bidAmount),
          daysToComplete: Number(this.bidDaysToComplete),
          message: this.bidMessage,
        }
      );

      runInAction(() => {
        this.upsertBid(this.mapBidResponseToModel(response.data));
      });

      this.resetBidForm();
      return true;
    } catch (error) {
      this.setBidError(this.getApiErrorMessage(error, 'Slanje ponude nije uspjelo.'));
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  acceptBid = async (bidId: string) => {
    const user = this.rootStore.authenticationStore.user;

    if (!user) {
      this.setBidError('Morate biti prijavljeni za prihvat ponude.');
      return false;
    }

    this.isLoading = true;
    this.setBidError(null);

    try {
      const response = await this.bidService.acceptBidAsync(bidId);
      const updatedBids = response.data.map(this.mapBidResponseToModel);
      const updatedBid = updatedBids.find((bid) => bid.id === bidId);

      runInAction(() => {
        this.replaceBids(updatedBids, updatedBid?.jobId);
      });

      return true;
    } catch (error) {
      this.setBidError(this.getApiErrorMessage(error, 'Prihvat ponude nije uspio.'));
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  getBidsByJobId(jobId: string) {
    return this.bids.filter((bid) => bid.jobId === jobId);
  }

  private mapBidResponseToModel = (bidResponse: IBidResponse): IBid => {
    return {
      ...bidResponse,
      createdAt: new Date(bidResponse.createdAt),
    };
  };

  private upsertBid = (bid: IBid) => {
    const existingBidIndex = this.bids.findIndex((existingBid) => existingBid.id === bid.id);

    if (existingBidIndex === -1) {
      this.bids = [bid, ...this.bids];
      return;
    }

    const nextBids = [...this.bids];
    nextBids[existingBidIndex] = bid;
    this.bids = nextBids;
  };

  private replaceBids = (bids: IBid[], jobId?: string, contractorId?: string) => {
    if (!jobId && !contractorId) {
      this.bids = bids;
      return;
    }

    const filteredExistingBids = this.bids.filter((bid) => {
      const matchesJob = jobId ? bid.jobId === jobId : false;
      const matchesContractor = contractorId ? bid.contractorId === contractorId : false;

      return !matchesJob && !matchesContractor;
    });

    this.bids = [...filteredExistingBids, ...bids];
  };

  private getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || fallbackMessage;
  };
}
