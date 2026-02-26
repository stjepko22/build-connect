import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '@/stores/RootStore';

export interface Review {
  id: string;
  jobId: string;
  reviewerId: string; // Investitor
  revieweeId: string; // Izvođač
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export default class ReviewStore {
  rootStore: RootStore;
  reviews: Review[] = [];
  isLoading: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  private validateReviewInput(reviewData: Omit<Review, 'id' | 'createdAt' | 'reviewerId'>): string | null {
    const user = this.rootStore.authenticationStore.user;

    if (!user) return 'Morate biti prijavljeni za ostavljanje recenzije.';
    if (user.role !== 'INVESTITOR') return 'Samo investitor može ostaviti recenziju.';

    const job = this.rootStore.jobStore.jobs.find((j) => j.id === reviewData.jobId);
    if (!job) return 'Posao za recenziju nije pronađen.';
    if (job.investitorId !== user.id) return 'Ne možete recenzirati posao koji nije vaš.';

    const acceptedBid = this.rootStore.bidStore.bids.find(
      (bid) => bid.jobId === reviewData.jobId && bid.status === 'ACCEPTED'
    );
    if (!acceptedBid) return 'Recenziju možete ostaviti tek nakon prihvaćene ponude.';
    if (acceptedBid.contractorId !== reviewData.revieweeId) {
      return 'Recenzija mora biti vezana za prihvaćenog izvođača.';
    }

    if (!Number.isFinite(reviewData.rating) || reviewData.rating < 1 || reviewData.rating > 5) {
      return 'Ocjena mora biti između 1 i 5.';
    }

    if (reviewData.comment.trim().length < 10) {
      return 'Komentar mora imati barem 10 znakova.';
    }

    const existingReview = this.reviews.find((r) => r.jobId === reviewData.jobId);
    if (existingReview) return 'Za ovaj posao je već ostavljena recenzija.';

    return null;
  }

  addReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'reviewerId'>) => {
    const validationError = this.validateReviewInput(reviewData);
    if (validationError) {
      throw new Error(validationError);
    }

    this.isLoading = true;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const user = this.rootStore.authenticationStore.user!;
        const newReview: Review = {
          ...reviewData,
          id: Math.random().toString(36).substring(2, 9),
          reviewerId: user.id,
          createdAt: new Date(),
        };
        
        runInAction(() => {
          this.reviews.push(newReview);
          this.isLoading = false;
        });
        
        console.log(`[ReviewStore] Recenzija uspješno dodana za posao: ${reviewData.jobId}`);
        resolve();
      }, 800);
    });
  };

  getReviewByJobId(jobId: string) {
    return this.reviews.find(r => r.jobId === jobId);
  }
}
