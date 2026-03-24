export interface IBidResponse {
  id: string;
  jobId: string;
  contractorId: string;
  contractorName: string;
  amount: number;
  daysToComplete: number;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}
