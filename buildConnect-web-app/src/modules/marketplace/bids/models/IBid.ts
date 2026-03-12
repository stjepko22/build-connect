export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface IBid {
  id: string;
  jobId: string;
  contractorId: string;
  contractorName: string;
  amount: number;
  daysToComplete: number;
  message: string;
  status: BidStatus;
  createdAt: Date;
}
