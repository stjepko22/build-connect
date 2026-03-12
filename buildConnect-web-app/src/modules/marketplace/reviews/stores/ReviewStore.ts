import { makeAutoObservable, runInAction } from 'mobx';
import RootStore from '@/core/stores/RootStore';
import { IReview } from '@/modules/marketplace/reviews/models/IReview';

export default class ReviewStore {
  rootStore: RootStore;
  reviews: IReview[] = [
    {
      id: 'review-1',
      jobId: 'posao-1',
      reviewerId: 'investitor-1',
      revieweeId: 'izvodjac-1',
      rating: 5,
      comment: 'Odlicna izvedba fasade, sve je zavrseno u roku.',
      createdAt: new Date('2026-02-12'),
    },
    {
      id: 'review-2',
      jobId: 'posao-2',
      reviewerId: 'investitor-2',
      revieweeId: 'izvodjac-2',
      rating: 4,
      comment: 'Kvalitetan posao i dobra komunikacija kroz cijeli projekt.',
      createdAt: new Date('2026-02-13'),
    },
    {
      id: 'review-3',
      jobId: 'posao-4',
      reviewerId: 'investitor-2',
      revieweeId: 'izvodjac-3',
      rating: 5,
      comment: 'Profesionalan elektro tim, preporuka za poslovne objekte.',
      createdAt: new Date('2026-02-15'),
    },
  ];
  isLoading: boolean = false;
  reviewRating: number | null = 5;
  reviewComment = '';
  reviewError: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  private validateReviewInput(reviewData: Omit<IReview, 'id' | 'createdAt' | 'reviewerId'>): string | null {
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

  addReview = async (reviewData: Omit<IReview, 'id' | 'createdAt' | 'reviewerId'>) => {
    const validationError = this.validateReviewInput(reviewData);
    if (validationError) {
      throw new Error(validationError);
    }

    this.isLoading = true;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const user = this.rootStore.authenticationStore.user!;
        const newReview: IReview = {
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

  setReviewRating = (value: number | null) => { this.reviewRating = value; };
  setReviewComment = (value: string) => { this.reviewComment = value; };
  setReviewError = (value: string | null) => { this.reviewError = value; };

  resetReviewForm = () => {
    this.reviewRating = 5;
    this.reviewComment = '';
    this.reviewError = null;
  };

  get isReviewFormValid() {
    return (
      Number.isFinite(this.reviewRating ?? NaN) &&
      (this.reviewRating ?? 0) >= 1 &&
      (this.reviewRating ?? 0) <= 5 &&
      this.reviewComment.trim().length >= 10
    );
  }

  submitReviewForJob = async (jobId: string, revieweeId: string) => {
    this.setReviewError(null);
    try {
      await this.addReview({
        jobId,
        revieweeId,
        rating: this.reviewRating || 5,
        comment: this.reviewComment,
      });
      this.resetReviewForm();
      return true;
    } catch (error) {
      this.setReviewError(error instanceof Error ? error.message : 'Objava recenzije nije uspjela.');
      return false;
    }
  };

  getReviewByJobId(jobId: string) {
    return this.reviews.find(r => r.jobId === jobId);
  }
}



