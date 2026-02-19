import { makeAutoObservable } from 'mobx';
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

export class ReviewStore {
  rootStore: RootStore;
  reviews: Review[] = [];
  isLoading: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  addReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'reviewerId'>) => {
    this.isLoading = true;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newReview: Review = {
          ...reviewData,
          id: Math.random().toString(36).substring(2, 9),
          reviewerId: this.rootStore.authenticationStore.user?.id || 'unknown',
          createdAt: new Date(),
        };
        
        this.reviews.push(newReview);
        this.isLoading = false;
        console.log("Recenzija dodana:", newReview);
        resolve();
      }, 800);
    });
  };

  getReviewByJobId(jobId: string) {
    return this.reviews.find(r => r.jobId === jobId);
  }
}