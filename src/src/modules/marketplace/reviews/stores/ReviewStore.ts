import { AxiosError } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { IReviewResponse } from '@/api/models/reviews/IReviewResponse';
import RootStore from '@/core/stores/RootStore';
import { IReview } from '@/modules/marketplace/reviews/models/IReview';
import ReviewService from '@/modules/marketplace/reviews/services/ReviewService';

export default class ReviewStore {
  rootStore: RootStore;
  reviewService: ReviewService;
  reviews: IReview[] = [];
  isLoading = false;
  isLoadingReviews = false;
  reviewRating: number | null = 5;
  reviewComment = '';
  reviewError: string | null = null;
  reviewListError: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.reviewService = new ReviewService();
    makeAutoObservable(this);
  }

  loadReviews = async (jobId?: string, revieweeId?: string) => {
    this.isLoadingReviews = true;
    this.reviewListError = null;

    try {
      const response = await this.reviewService.getReviewsAsync({
        jobId,
        revieweeId,
      });

      runInAction(() => {
        this.replaceReviews(
          response.data.map(this.mapReviewResponseToModel),
          jobId,
          revieweeId
        );
      });
    } catch (error) {
      console.error('Load reviews failed:', error);
      runInAction(() => {
        this.reviewListError = this.getApiErrorMessage(error, 'Dohvat recenzija nije uspio.');
      });
    } finally {
      runInAction(() => {
        this.isLoadingReviews = false;
      });
    }
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

  submitReviewForJob = async (jobId: string) => {
    this.setReviewError(null);
    const user = this.rootStore.authenticationStore.user;

    if (!user) {
      this.setReviewError('Morate biti prijavljeni za ostavljanje recenzije.');
      return false;
    }

    this.isLoading = true;

    try {
      const response = await this.reviewService.createReviewAsync(
        jobId,
        {
          rating: this.reviewRating || 5,
          comment: this.reviewComment,
        }
      );

      runInAction(() => {
        this.upsertReview(this.mapReviewResponseToModel(response.data));
      });

      this.resetReviewForm();
      return true;
    } catch (error) {
      this.setReviewError(this.getApiErrorMessage(error, 'Objava recenzije nije uspjela.'));
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  getReviewByJobId(jobId: string) {
    return this.reviews.find((review) => review.jobId === jobId);
  }

  private mapReviewResponseToModel = (reviewResponse: IReviewResponse): IReview => {
    return {
      ...reviewResponse,
      createdAt: new Date(reviewResponse.createdAt),
    };
  };

  private upsertReview = (review: IReview) => {
    const existingReviewIndex = this.reviews.findIndex((existingReview) => existingReview.id === review.id);

    if (existingReviewIndex === -1) {
      this.reviews = [review, ...this.reviews];
      return;
    }

    const nextReviews = [...this.reviews];
    nextReviews[existingReviewIndex] = review;
    this.reviews = nextReviews;
  };

  private replaceReviews = (reviews: IReview[], jobId?: string, revieweeId?: string) => {
    if (!jobId && !revieweeId) {
      this.reviews = reviews;
      return;
    }

    const filteredExistingReviews = this.reviews.filter((review) => {
      const matchesJob = jobId ? review.jobId === jobId : false;
      const matchesReviewee = revieweeId ? review.revieweeId === revieweeId : false;

      return !matchesJob && !matchesReviewee;
    });

    this.reviews = [...filteredExistingReviews, ...reviews];
  };

  private getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || fallbackMessage;
  };
}
