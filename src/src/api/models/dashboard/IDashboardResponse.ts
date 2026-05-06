import { LegalType } from '@/modules/user/models/LegalType';
import { BidStatus } from '@/modules/marketplace/bids/models/IBid';
import { JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';

export interface IDashboardSummaryResponse {
  jobsCount: number;
  totalBidsOnMyJobs: number;
  activeProjectsCount: number;
  sentBidsCount: number;
  acceptedBidsCount: number;
  averageRating: number;
}

export interface IDashboardJobActivityResponse {
  jobId: string;
  title: string;
  budget?: number;
  bidsCount: number;
}

export interface IDashboardBidActivityResponse {
  bidId: string;
  jobId: string;
  jobTitle: string;
  status: BidStatus;
  amount: number;
}

export interface IDashboardRecommendedContractorResponse {
  contractorId: string;
  displayName: string;
  location: string;
  legalType: LegalType;
  averageRating: number;
  reviewCount: number;
  categoryMatches: JobCategory[];
  isLocationMatch: boolean;
}

export interface IDashboardResponse {
  summary: IDashboardSummaryResponse;
  jobActivities?: IDashboardJobActivityResponse[];
  bidActivities?: IDashboardBidActivityResponse[];
  recommendedContractors?: IDashboardRecommendedContractorResponse[];
}

export default IDashboardResponse;
